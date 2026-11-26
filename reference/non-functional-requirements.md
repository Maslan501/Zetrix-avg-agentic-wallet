# Non-Functional Requirements

## Performance

| ID | Requirement |
| --- | --- |
| PER-01 | AVG proof request creation: P95 under 300 ms. |
| PER-02 | AVG verification (step 7 to 8a): P95 under 1.5 seconds including the Zetrix chain read. |
| PER-03 | Registry search (`find_services`): P95 under 1 second. |
| PER-04 | Admin Portal pages: P95 load under 3 seconds for lists of up to 1,000 rows. |

## Security and Access Control

| ID | Requirement |
| --- | --- |
| SEC-01 | HTTPS only. TLS 1.3 preferred, TLS 1.2 permitted. |
| SEC-02 | API keys and HMAC signing secrets are random, at least 256-bit, and shown once. API keys stored only as hashes. Signing secrets stored encrypted at rest with the encryption key in the Zetrix key store / HSM. Never written to logs. |
| SEC-03 | Admin Portal follows the High Risk controls of the MyEG Password & Authentication Control Matrix v0.9. |
| SEC-04 | Role-based access and organisation scope enforced on the backend for every API call. |
| SEC-05 | Applications approved by a different user from the one who created or last edited them. |
| SEC-06 | Proof requests are single use, expire after 5 minutes, and use a nonce of at least 128 bits. Replayed or expired proof requests are rejected without calling MBI. |
| SEC-07 | AVG fails closed: never returns `true` unless every check passes and the Zetrix chain was readable. |
| SEC-08 | Agent private keys never leave the HSM. The wallet only requests signatures. |
| SEC-09 | `ownerId`, `ownerIdType`, `dob`, `countryOfOrigin` and `ownerPhoneNumber` are not disclosed by default; only to services approved for them, with owner consent. |
| SEC-10 | Tenant isolation: every Admin Portal and AVG log API call is filtered by company. Cross-tenant access returns 403 and is logged. |
| SEC-11 | Password reset links are one-time, expire in 2 hours, and never confirm whether an email exists. |
| SEC-12 | Passwords hashed with Argon2id, scrypt or bcrypt with a unique salt. TOTP secrets encrypted at rest. |
| SEC-13 | Role permissions stored as settings; safety rules stay in code. |

## Reliability and Resilience

| ID | Requirement |
| --- | --- |
| REL-01 | AVG and Admin Portal availability target 99.5% monthly (to be confirmed with infra). |
| REL-02 | MBI calls: 5-second timeout, 1 retry. |
| REL-03 | Registry sync asynchronous with retries after 1, 5 and 15 minutes, then `SYNC_FAILED` with manual retry. |
| REL-04 | Trust-removing changes (suspend, delist, key revoke) reach AVG within 60 seconds, applied before the registry and mirror. |
| REL-05 | Service Cert issue and revoke are idempotent. |

## Compliance

| ID | Requirement |
| --- | --- |
| AUD-01 | Every Admin Portal action is logged, including failed attempts. |
| AUD-02 | Every AVG proof request and verification is logged with result and reason code, without claim values. |
| AUD-03 | Verification logs kept 30 days, then deleted. The audit trail is append-only. |
| AUD-04 | PDPA 2010: only needed claims are disclosed; owner consent captured before personal claims are shared. |
| AUD-05 | Pilot registry controllers are outside Malaysia. No agent owner personal data is shared with them; logs shared hold no claim values. |

## Scalability

| ID | Requirement |
| --- | --- |
| SCL-01 | AVG supports at least 100 verifications per second at launch and scales horizontally. |
| SCL-02 | Registry and Admin Portal support at least 10,000 listed services. |
| SCL-03 | Per-service rate limits configurable by Zetrix Super Admin (default 60 proof requests per minute). |
