# Authentication

AVG uses two credentials per service, both created when the service is approved in the Admin Portal and shown **once** to the approver.

| Credential | Purpose | Format |
| --- | --- | --- |
| API key | Identifies and authenticates the service when it calls AVG. | Random, at least 256-bit. Stored by AVG as a hash only. |
| HMAC signing secret | AVG signs each verification result with it; the service uses it to check the result. | Random, at least 256-bit. Stored by AVG encrypted at rest; the encryption key is kept in the Zetrix key store / HSM. |

Neither value is ever written to logs or shown again. After the approval dialog closes, the portal shows only the key prefix and last 4 characters.

***

## API Key Authentication

Every service call to AVG must carry a valid API key of an **Active** service.

**Request Headers**

| Header | Type | Description |
| --- | --- | --- |
| `X-API-Key` | String | The service's AVG API key. |
| `Content-Type` | String | Always `application/json` |

```
X-API-Key: avg_live_9f3c...e21a
```

**Error Responses**

| Status | Code | Message | Description |
| --- | --- | --- | --- |
| 401 | INVALID\_API\_KEY | `Invalid API key` | Key unknown, revoked or expired. |
| 403 | SERVICE\_SUSPENDED | `Service suspended` | Service is Suspended or Delisted. |
| 429 | RATE\_LIMITED | `Rate limited` | More than the service's limit (default 60 proof requests per minute). `Retry-After` header returned. |

***

## Key Lifecycle

| Rule | Detail |
| --- | --- |
| Maximum keys | At most 2 non-revoked keys per service at any time. |
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
| Rotate | Creates a new secret (shown once). AVG signs with the new secret; the old one stays valid for 24 hours so the service can switch. |
| Revoke | Stops the secret at once. |

{% hint style="info" %}
During the 24-hour rotation overlap, accept a result if it verifies with either the new or the old secret.
{% endhint %}

***

## Agent Authentication

The calling agent does not use an API key. It proves itself through the VP it submits:

* The VP is bound to the proof request's x401 challenge (nonce), signed with the agent key held in the Wallet BE HSM.
* The proof request must exist, belong to AVG, be unexpired and unused.

See [Verifiable Presentation Submission](vp-submission.md).
