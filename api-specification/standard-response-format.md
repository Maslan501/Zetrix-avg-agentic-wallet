# Standard Response Format

AVG uses two response shapes. Which one you get depends on the endpoint.

| Shape | Used by |
| --- | --- |
| Plain JSON object, with an `Error` object on failure | `POST /v1/proof-requests`, `GET /v1/logs` |
| Compatible envelope `{ success, object }`, with `{ success: false, messages }` on failure | `POST /v1/verification/request` and the agent endpoints (`/v1/presentation/...`) |

## Plain Responses

On success the body is the resource itself, for example the proof request:

```json
{
    "proofRequestId": "7f3c2a10-5b8e-4d1a-9c46-0e2b7a1d9f33",
    "nonce": "Zm9vYmFyMTIzNDU2Nzg5MGFiY2RlZmdoaWprbG1ub3A",
    "expiresAt": "2026-11-20T09:05:00.000Z"
}
```

On failure:

```json
{
    "code": "CLAIMS_NOT_ALLOWED",
    "message": "Claims not allowed: ownerName",
    "details": {
        "claims": ["ownerName"]
    }
}
```

| Type | Params | Description |
| --- | --- | --- |
| string | `code` | A reason code, or `INVALID_REQUEST`, `UNAVAILABLE`. See [Result and Error Codes](result-and-error-codes.md). |
| string | `message` | Plain-language message. |
| object | `details` | Optional details, for example the claims that were not allowed. |

## Compatible Envelope

```json
{
    "success": true,
    "object": { }
}
```

On failure:

```json
{
    "success": false,
    "messages": ["..."]
}
```

## Verification Outcomes vs Errors

A failed **verification** is not an HTTP error. When the agent's proof fails a check, AVG still returns a signed result where `verified` is `false`, `status` is `REJECTED` and `reasonCode` names the failed check. HTTP errors (`4xx`, `503`) are used only when a request cannot be processed, for example an invalid API key.
