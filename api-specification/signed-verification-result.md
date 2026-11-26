# Signed Verification Result

Every verification produces one signed result. The service receives it **two ways**: the agent forwards it in the `PROOF-RESPONSE` header (step 8b), and AVG posts it to the service's callback URL (step 8c). Both deliveries are fixed for every service.

## **What AVG Signs**

AVG signs a JSON text, the **payload**, and sends it with a timestamp and a signature.

```json
{
    "presentationId": "7f3c2a10-5b8e-4d1a-9c46-0e2b7a1d9f33",
    "status": "VERIFIED",
    "verified": true,
    "verifiedClaims": {
        "verifiedAgentCert": {
            "agentName": "Example Agent",
            "ownerVerified": true,
            "evidenceProvider": "mydigitalid"
        }
    },
    "credentialLevel": "verified",
    "serviceId": "svc_example"
}
```

| Type | Params | Description |
| --- | --- | --- |
| string | `presentationId` | The proof request id. Use it to match and de-duplicate. |
| string | `status` | `VERIFIED` or `REJECTED`. |
| boolean | `verified` | `true` only when every check passed. A `true` result proves identity only; it does not authorise any action. |
| object | `verifiedClaims` | The disclosed claims that were asked for, under the root of the credential presented (`verifiedAgentCert` or `basicAgentCert`). Empty when `verified` is `false`. A Basic result never holds `ownerVerified`. |
| string | `credentialLevel` | `basic` or `verified`. Present when `verified` is `true`. |
| string | `reasonCode` | Why the check failed. See [Result and Error Codes](result-and-error-codes.md). |
| string | `serviceId` | The service the result is for. |

## **Signature**

```
signature = base64( HMAC-SHA256( key     = your signing secret,
                                 message = timestamp + "." + payload ) )
```

* `payload` is the exact text AVG sent. Never parse and re-serialise it before checking.
* `timestamp` is the ISO 8601 instant AVG sent, used as it is.

***

## Delivery by Header (8b)

The agent forwards the result to the service in a request header.

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `PROOF-RESPONSE` | String | base64url of `{"payload": "...", "signature": "...", "timestamp": "..."}` |

The agent cannot change the result: any change breaks the signature.

***

## Delivery by Callback (8c)

Right after every check, AVG posts the same result to the service's registered HTTPS callback URL. The endpoint is documented on the webhook page under this section.

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `X-Callback-Signature` | String | base64 HMAC-SHA256 of `timestamp + "." + signed_result` |
| `X-Callback-Timestamp` | String | ISO 8601 instant, used as it is. |

**Request Body:** *(JSON)*

```json
{
    "presentation_id": "7f3c2a10-5b8e-4d1a-9c46-0e2b7a1d9f33",
    "signed_result": "{\"presentationId\":\"7f3c2a10-5b8e-4d1a-9c46-0e2b7a1d9f33\",\"status\":\"VERIFIED\",\"verified\":true}"
}
```

**Expected Response:** any `2xx` within **5 seconds**.

**Retry Policy**

| Attempt | When |
| --- | --- |
| 1 | Immediately after the check |
| 2 | 5 seconds later |
| 3 | 30 seconds later |
| 4 | 2 minutes later |
| — | Then the delivery is logged as `CALLBACK_FAILED`. The check is not repeated, and the agent still has the result. |

***

## **Service-Side Check**

```javascript
const crypto = require("crypto");

// header: value of PROOF-RESPONSE, or build { payload: body.signed_result,
//   signature: X-Callback-Signature, timestamp: X-Callback-Timestamp } for the callback
function checkAvgResult({ payload, signature, timestamp }, secrets /* [current, previous] */) {
  const skew = Math.abs(Date.now() - Date.parse(timestamp));
  if (!(skew <= 300_000)) return null;                       // refuse if more than 300 s off
  const given = Buffer.from(signature, "base64");
  const ok = secrets.some(secret => {
    const expected = crypto.createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`).digest();
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
  return ok ? JSON.parse(payload) : null;                    // parse only after the check
}

function readProofResponseHeader(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}
```

**Validation Rules**

| Check | Rule | On failure |
| --- | --- | --- |
| Signature | Matches the HMAC computed with your secret (current, or previous during a 24-hour rotation). Compare in constant time. | Refuse the call. |
| Timestamp | Not more than 300 seconds from your clock, past or future. | Refuse the call. |
| `presentationId` | A proof request your service created, used once. | Refuse the call. |
| `verified` / `status` | `verified` is `true` and `status` is `VERIFIED`. | Refuse with the `reasonCode`. |

**Notes**

* **Idempotency:** the service receives each result at least twice (header and callback), plus any callback retries. Treat all of them for the same `presentationId` as one result.
* If the callback fails, the result is still valid through the header.
