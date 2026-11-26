# Signed Verification Result

Every verification produces one signed result. The service receives it **two ways**: the agent forwards it in the x401 header (step 8b), and AVG posts it to the service's callback URL (step 8c). Both deliveries are fixed for every service.

## **Signed Result Fields**

```json
{
    "result": true,
    "reasonCode": null,
    "proofRequestId": "pr_01JD8Q6W1X4M2V9K7T3N5B8C0A",
    "serviceId": "svc_01JD7ZK3M0",
    "credentialType": "VERIFIED",
    "disclosedClaims": {
        "agentName": "ali-travel-agent",
        "ownerVerified": true,
        "evidenceProvider": "mydigitalid"
    },
    "serviceReference": "quote-req-000123",
    "timestamp": "2026-11-20T09:01:12Z",
    "signature": "Zq8f0m...Q2c="
}
```

| Type | Params | Description |
| --- | --- | --- |
| boolean | `result` | `true` only when every check passed. A `true` result proves identity only; it does not authorise any action. |
| string | `reasonCode` | `null` when `result` is `true`; otherwise the reason. See [Result and Error Codes](result-and-error-codes.md). |
| array of string | `missingClaims` | Present only with `MISSING_CLAIMS`. |
| string | `proofRequestId` | The proof request this result answers. Use it to match and de-duplicate. |
| string | `serviceId` | The service the result is for. |
| string | `credentialType` | Agent Cert type presented: `BASIC` or `VERIFIED`. |
| object | `disclosedClaims` | Claim values the agent disclosed. Only the service receives these; they are never stored in AVG logs. |
| string | `serviceReference` | Your reference from the proof request, if any. |
| string | `timestamp` | Time AVG produced the result, ISO 8601 UTC. |
| string | `signature` | HMAC over the result, keyed with the service's signing secret. |

{% hint style="warning" %}
**Proposed signing scheme.** The PRD specifies an HMAC with the service's shared secret. The algorithm (HMAC-SHA256), the canonicalisation of the payload and the encoding below are proposed and must be confirmed with the AVG development team.
{% endhint %}

**Signature computation (proposed)**

1. Take the signed result without the `signature` field.
2. Serialise it as canonical JSON (keys sorted, no whitespace, UTF-8).
3. Compute `HMAC-SHA256(signingSecret, canonicalJson)`.
4. Encode as Base64.

***

## Delivery by x401 Header (8b)

The agent sends AVG's signed result to the service in a request header when it retries its call.

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `x401` | String | Base64url-encoded signed result JSON. *(Header name and encoding proposed.)* |

The agent cannot change the result: any change breaks the signature.

***

## Delivery by Callback (8c)

Right after verifying, AVG posts the same signed result (same signature, includes `proofRequestId`) to the service's registered callback URL.

**Request**

| Method | URL |
| --- | --- |
| POST | `{callbackUrl}` (registered at onboarding; HTTPS, on the verified endpoint domain) |

**Request Body:** *(JSON)*

The signed result object, exactly as above.

**Expected Response**

Any `2xx` status within **5 seconds**.

**Retry Policy**

| Attempt | When |
| --- | --- |
| 1 | Immediately after verification |
| 2 | 5 seconds later |
| 3 | 30 seconds later |
| 4 | 2 minutes later |
| — | Then the delivery is logged as `CALLBACK_FAILED`. Verification itself is not repeated. |

***

## **Service-Side Verification (8b)**

The service recomputes the HMAC with the secret it shares with AVG and compares. Match means the result is valid and not tampered with.

```javascript
const crypto = require("crypto");

function canonical(obj) {
  if (Array.isArray(obj)) return `[${obj.map(canonical).join(",")}]`;
  if (obj && typeof obj === "object") {
    return `{${Object.keys(obj).sort()
      .map(k => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(",")}}`;
  }
  return JSON.stringify(obj);
}

function verifyAvgResult(signedResult, secrets /* [current, previous] */) {
  const { signature, ...payload } = signedResult;
  const body = canonical(payload);
  return secrets.some(secret => {
    const expected = crypto.createHmac("sha256", secret).update(body).digest();
    const given = Buffer.from(signature, "base64");
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
}
```

**Validation Rules**

| Field | Rule | Error Message |
| --- | --- | --- |
| `signature` | Must match the HMAC recomputed with the service's secret (current, or previous during a 24-hour rotation). | Refuse the call (`HMAC_MISMATCH`). |
| `proofRequestId` | Must be a proof request this service created. | Refuse the call. |
| `serviceId` | Must be this service. | Refuse the call. |
| `result` | Must be `true` to serve the call. | Refuse with the `reasonCode`. |

**Notes**

* **Idempotency:** the service receives each result at least twice (header and callback), plus any callback retries. Treat all of them for the same `proofRequestId` as one result.
* If the callback fails, the result is still valid through the x401 header.
* Using the callback for an agent logging in to a website on the owner's behalf is not in Phase 1 (needs owner permission policy, Phase 2).
