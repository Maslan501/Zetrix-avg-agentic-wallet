# vp submission

Submits the agent's Verifiable Presentation (OID4VP response) to AVG for a proof request and returns the HMAC-signed verification result.

## Description

This is step 7 of the service call flow. The agent submits its VP straight to AVG, the OID4VP verifier, at the `submitUrl` from the proof request. The agent never submits the VP to the service. AVG verifies the VP itself using the issuer key and VC status on the Zetrix chain (step 7a). MBI is not called during verification; MBI only creates the VP for the agent (step 6).

AVG returns a result signed with the service's HMAC secret (step 8a), and posts the same signed result to the service's callback URL (step 8c). The agent forwards the signed result to the service unchanged (step 8b).

## Request

| Method | URL                 |
| ------ | ------------------- |
| POST   | `/v1/presentations` |

### Request Headers

| Header         | Type   | Description               |
| -------------- | ------ | ------------------------- |
| `Content-Type` | String | Always `application/json` |

### Request Body

```json
{
    "proofRequestId": "pr_01JD8Q6W1X4M2V9K7T3N5B8C0A",
    "vpToken": "<VP created by MBI, signed over the x401 challenge>",
    "presentationSubmission": {
        "definitionId": "pr_01JD8Q6W1X4M2V9K7T3N5B8C0A",
        "descriptorMap": [
            { "id": "agent-cert", "format": "ldp_vp", "path": "$" }
        ]
    }
}
```

| Type            | Params                   | Required | Description                                                                                                                          |
| --------------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| string          | `proofRequestId`         | Yes      | The proof request the VP answers.                                                                                                    |
| string / object | `vpToken`                | Yes      | The VP created by MBI with only the requested claims revealed, bound to the x401 challenge and signed with the agent key in the HSM. |
| object          | `presentationSubmission` | No       | OID4VP presentation submission describing the VP.                                                                                    |

## Verification Checks

AVG first checks the proof request state, then runs these checks in order. The first failure decides the reason code.

| Order | Check                                                                                          | Reason Code on Failure       |
| ----- | ---------------------------------------------------------------------------------------------- | ---------------------------- |
| 0     | Proof request exists and is not expired                                                        | `PROOF_REQUEST_EXPIRED`      |
| 0     | Proof request has not been used. It is marked used on any attempt.                             | `PROOF_REQUEST_ALREADY_USED` |
| 1     | VP signature is valid and bound to the x401 challenge                                          | `CHALLENGE_MISMATCH`         |
| 2     | Issuer key found on the Zetrix chain, and issuer is the Zetrix issuer set in AVG configuration | `UNTRUSTED_ISSUER`           |
| 3     | VC status on the Zetrix chain is not revoked                                                   | `CREDENTIAL_REVOKED`         |
| 4     | VC is not past `validUntil`                                                                    | `CREDENTIAL_EXPIRED`         |
| 5     | Credential type (template) matches the proof request                                           | `CREDENTIAL_TYPE_MISMATCH`   |
| 6     | All requested claims are disclosed                                                             | `MISSING_CLAIMS` (with list) |
| —     | Zetrix chain readable                                                                          | `VERIFIER_UNAVAILABLE`       |

## Response

### Verified

```json
{
    "status": 200,
    "message": "Success",
    "data": {
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
    },
    "timestamp": "2026-11-20T09:01:12Z"
}
```

### Not verified

```json
{
    "status": 200,
    "message": "Success",
    "data": {
        "result": false,
        "reasonCode": "MISSING_CLAIMS",
        "missingClaims": ["ownerVerified"],
        "proofRequestId": "pr_01JD8Q6W1X4M2V9K7T3N5B8C0A",
        "serviceId": "svc_01JD7ZK3M0",
        "credentialType": "VERIFIED",
        "disclosedClaims": {
            "agentName": "ali-travel-agent"
        },
        "serviceReference": "quote-req-000123",
        "timestamp": "2026-11-20T09:01:12Z",
        "signature": "pL3x9a...7Yk="
    },
    "timestamp": "2026-11-20T09:01:12Z"
}
```

The `data` object is the **signed result**. See [Signed Verification Result](/broken/pages/3d24e7062735350f8f7a08c905b698defa357108) for each field and how the service verifies the signature.

## Error Responses

| Status | Code         | Message                                          | Description                          |
| ------ | ------------ | ------------------------------------------------ | ------------------------------------ |
| 404    | NOT\_FOUND   | `Proof request not found: \`{proofRequestId}\`\` | No proof request with this ID.       |
| 400    | BAD\_REQUEST | `Invalid presentation`                           | Body missing or VP cannot be parsed. |

## Notes

\{% hint style="info" %\} AVG fails closed: it never returns `result: true` unless every check passes and the Zetrix chain was readable. \{% endhint %\}

\{% hint style="info" %\} A replayed, used proof request returns `PROOF_REQUEST_ALREADY_USED` without reading the chain. \{% endhint %\}

\{% hint style="info" %\} After `MISSING_CLAIMS`, the agent needs a **new** proof request from the service. An old VP is never changed or resubmitted.

{% hint style="info" %}
AVG verifies Zetrix-issued VCs only. Non-Zetrix VCs (e.g. CAICT) are not supported in Phase 1.
{% endhint %}

{% hint style="info" %}
Every attempt is logged for 30 days without claim values.
{% endhint %}

## Sequence Diagram
