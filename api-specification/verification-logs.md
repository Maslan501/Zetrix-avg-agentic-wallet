# Verification Logs

## **List Verification Logs**

Returns the calling service's own verification log entries from the last 30 days.

**Description**

Every proof request and verification AVG performs is logged for 30 days, then deleted. Services do not log in to the Admin Portal in Phase 1, so each service reads its own log through this API using its API key (OD-24). Registry controllers and Zetrix view logs in the Admin Portal instead (see [Services and Verification Logs](../admin-portal/services-and-verification-logs.md)).

Logs never hold claim values. Only claim **names** are recorded.

**Request**

| Method | URL |
| --- | --- |
| GET | `/v1/verification-logs` |

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `X-API-Key` | String | Service API key. |

| Query | Required | Description |
| --- | --- | --- |
| `from` | No | Start of range, ISO 8601 UTC. Not older than 30 days. |
| `to` | No | End of range, ISO 8601 UTC. Must be after `from`. |
| `result` | No | `VERIFIED` or `FAILED`. |
| `reasonCode` | No | One reason code from [Result and Error Codes](result-and-error-codes.md). |
| `page` | No | Page number, starting at 1. Default 1. |
| `size` | No | Rows per page: 10, 20, 50 or 100. Default 20. |

**Response:** *(JSON)*

```json
{
    "status": 200,
    "message": "Success",
    "data": {
        "page": 1,
        "size": 20,
        "total": 50,
        "items": [
            {
                "timestamp": "2026-11-20T09:01:12Z",
                "proofRequestId": "pr_01JD8Q6W1X4M2V9K7T3N5B8C0A",
                "serviceReference": "quote-req-000123",
                "result": "FAILED",
                "reasonCode": "PROOF_REQUEST_EXPIRED",
                "reasonDescription": "The agent answered more than 5 minutes after the proof request was created.",
                "credentialType": "VERIFIED",
                "disclosedClaimNames": ["agentName", "ownerVerified"],
                "holderId": "did:zid:4f2a9c...b7e1",
                "callbackStatus": "DELIVERED"
            }
        ]
    },
    "timestamp": "2026-11-20T09:10:00Z"
}
```

| Type | Params | Description |
| --- | --- | --- |
| string | `timestamp` | Time of the check, UTC. |
| string | `proofRequestId` | Proof request ID. |
| string | `serviceReference` | Service reference, if any. |
| string | `result` | `VERIFIED` or `FAILED`. |
| string | `reasonCode` | Reason code when failed. |
| string | `reasonDescription` | Plain-language description of the reason. |
| string | `credentialType` | `BASIC` or `VERIFIED`. |
| array of string | `disclosedClaimNames` | Claim names disclosed. Never values. |
| string | `holderId` | Agent holder DID, masked (first 12 + last 4 characters). |
| string | `callbackStatus` | Callback delivery status, e.g. `DELIVERED` or `CALLBACK_FAILED`. |

**Error Responses**

| Status | Code | Message | Description |
| --- | --- | --- | --- |
| 401 | INVALID\_API\_KEY | `Invalid API key` | Key unknown, revoked or expired. |
| 400 | BAD\_REQUEST | `From date must be before To date.` | Invalid date range. |
| 400 | BAD\_REQUEST | `Only the last 30 days can be queried.` | Range outside retention. |

**Notes**

* A service only ever receives its own entries (tenant isolation is enforced on the backend).
* There is no CSV export in Phase 1.
