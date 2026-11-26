# standard response format

All AVG REST responses use the same envelope as other Zetrix ZID services.

## Success Response

```json
{
    "status": 200,
    "message": "Success",
    "data": {},
    "timestamp": "2026-11-20T09:00:00Z"
}
```

| Type    | Params      | Description                    |
| ------- | ----------- | ------------------------------ |
| integer | `status`    | HTTP status code.              |
| string  | `message`   | Short, human-readable message. |
| object  | `data`      | Endpoint-specific payload.     |
| string  | `timestamp` | Response time, ISO 8601 UTC.   |

## Error Response

```json
{
    "status": 400,
    "code": "CLAIMS_NOT_ALLOWED",
    "message": "Claims not allowed: ownerName",
    "data": {
        "claims": ["ownerName"]
    },
    "timestamp": "2026-11-20T09:00:00Z"
}
```

| Type    | Params      | Description                                                                                                  |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| integer | `status`    | HTTP status code.                                                                                            |
| string  | `code`      | Machine-readable code. See [Result and Error Codes](/broken/pages/368cd72ad22d54d841fb491585ebf907b16869d2). |
| string  | `message`   | Plain-language message that says what to do next.                                                            |
| object  | `data`      | Optional details, for example the list of claims not allowed.                                                |
| string  | `timestamp` | Response time, ISO 8601 UTC.                                                                                 |

## Verification Outcomes vs Errors

A failed **verification** is not an HTTP error. When the agent's VP fails a check, AVG still returns HTTP `200` with a signed result where `result` is `false` and `reasonCode` names the failed check. HTTP errors (`4xx`) are used only when a request cannot be processed, for example an invalid API key.

| Situation                                        | HTTP status | Body                                             |
| ------------------------------------------------ | ----------- | ------------------------------------------------ |
| Request accepted, verification passed            | 200         | Signed result, `result: true`                    |
| Request accepted, verification failed            | 200         | Signed result, `result: false`, `reasonCode` set |
| Request rejected (key, suspension, claims, rate) | 4xx         | Error envelope with `code`                       |
