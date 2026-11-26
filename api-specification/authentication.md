# Authentication

AVG uses two credentials per service, both created when the service is approved in the Admin Portal and shown **once** to the approver.

| Credential | Purpose | Storage at AVG |
| --- | --- | --- |
| API key | Identifies and authenticates the service when it calls AVG. | Hash only. |
| HMAC signing secret | AVG signs each verification result with it; the service uses it to check the result. | Encrypted at rest; the encryption key is kept in the Zetrix key store / HSM. |

Neither value is ever written to logs or shown again. After the approval dialog closes, the portal shows only the key prefix and last 4 characters.

***

## API Key Authentication

The service's calls to AVG (**Proof Requests** and **Logs**) carry the API key of an **Active** service as a bearer token.

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `Authorization` | String | `Bearer <API key>` |
| `Content-Type` | String | Always `application/json` |

```
Authorization: Bearer YOUR_AVG_API_KEY
```

**Error Responses**

| Status | Code | Description |
| --- | --- | --- |
| 401 | INVALID\_API\_KEY | Key missing, unknown, revoked or expired. |
| 403 | SERVICE\_SUSPENDED | Service is Suspended or Delisted. |
| 429 | RATE\_LIMITED | More than the service's limit (default 60 proof requests per minute). `Retry-After` header returned. A wrong key does not use up the allowance. |

***

## Key Lifecycle

| Rule | Detail |
| --- | --- |
| Maximum keys | At most 2 keys work at the same time. |
| Rotate | Creates a new key (shown once) and sets the old key to `Expiring`. The expiring key keeps working for 24 hours, then is revoked automatically. |
| Revoke | Stops the key at once. AVG rejects it within 60 seconds. Reason mandatory. |
| Last key | Revoking the only active key is allowed, but the service stops working until a new key is created. |
| Status values | `Active`, `Expiring`, `Revoked` |

Key rotation and revocation are done in the Admin Portal by a Checker, Client Admin or Zetrix Super Admin. See [API Keys and Signing Secret](../admin-portal/api-keys-and-signing-secret.md).

***

## Signing Secret Lifecycle

| Rule | Detail |
| --- | --- |
| One secret per service | AVG signs every result for the service with it. |
| Rotate | Creates a new secret (shown once). AVG signs with the new secret; the old one stays valid for 24 hours. |
| Revoke | Stops the secret at once. |

{% hint style="info" %}
During the 24-hour rotation overlap, check a result with the new secret first, then with the old one.
{% endhint %}

***

## Agent Authentication

The calling agent does not use an API key. The **Agent Endpoints** are open endpoints with a separate limit of 120 requests a minute per client address. The agent proves itself through the VP it submits:

* The VP is bound to the request: holder signature over the nonce, and the audience.
* The proof request must exist, be unexpired and unused.
* Cancelling a request needs the `state` value from the request definition, so a stranger who learns a request id cannot cancel it.
