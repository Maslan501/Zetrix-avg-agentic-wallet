# Result and Error Codes

## Codes by Channel

| Code | Channel | Meaning |
| --- | --- | --- |
| INVALID\_API\_KEY | 401 | Key unknown, revoked or expired. |
| SERVICE\_SUSPENDED | 403 | Service is Suspended or Delisted. |
| PROOF\_REQUEST\_NOT\_OWNED | 403 | Proof request belongs to another service. |
| CLAIMS\_NOT\_ALLOWED | 400 | Requested claims outside the service's Allowed Claims. |
| CREDENTIAL\_REQUIREMENT\_TOO\_LOW | 400 | Requested credential is broader than what the service was onboarded with. |
| CREDENTIAL\_NOT\_ALLOWED | 400 | The `credential` named in the proof request is not one the service accepts. |
| INVALID\_REQUEST | 400 | The request body is not valid. |
| RATE\_LIMITED | 429 | Too many requests. `Retry-After` header returned. |
| BASIC\_NOT\_CONFIGURED | 503 | The service accepts the Basic Agent Cert, but this AVG has no Basic template configured yet. |
| VERIFIER\_UNAVAILABLE | 503 (create) | The Zetrix chain cannot be read, so no new proof request is started. Retry after `Retry-After`. Open requests are kept. |
| UNAVAILABLE | 503 | AVG could not handle the request right now. Try again. |
| PROOF\_REQUEST\_EXPIRED | `verified: false` | Proof request older than 5 minutes. |
| PROOF\_REQUEST\_ALREADY\_USED | `verified: false` | Proof request already used once. |
| UNTRUSTED\_ISSUER | `verified: false` | Issuer is not the Zetrix issuer set in AVG configuration. |
| CREDENTIAL\_TYPE\_MISMATCH | `verified: false` | The Agent Cert type presented is not the one the proof request asks for (e.g. Basic given where Verified only is required). |
| CREDENTIAL\_EXPIRED | `verified: false` | VC past `validUntil`. |
| CREDENTIAL\_REVOKED | `verified: false` | VC revoked (status on the Zetrix chain). |
| CHALLENGE\_MISMATCH | `verified: false` | VP not bound to this proof request's nonce. |
| PROOF\_INVALID | `verified: false` | The presentation could not be read, or a credential proof does not verify. |
| SIGNING\_UNAVAILABLE | `verified: false` | AVG could not sign the result at that moment. Create a new proof request to retry. |
| MISSING\_CLAIMS | `verified: false` | One or more requested claims not disclosed. List returned. |
| VERIFIER\_UNAVAILABLE | `verified: false` | Zetrix chain could not be read. Create a new proof request to retry. |
| DISCLOSURE\_DECLINED | Agent to service | Owner declined to share requested claims. |
| CREDENTIAL\_NOT\_HELD | Wallet tool | Agent has no credential of the required type. |
| PROOF\_REQUEST\_NOT\_TRUSTED | Wallet tool | Service not in the Zetrix registry, or submit URL does not match the AVG URL on the service card. |
| HMAC\_MISMATCH | Service side | Signed result does not match the service's secret. Service refuses the call. |
| CALLBACK\_FAILED | Log status | Callback to the service failed after 3 retries. The agent still received the signed result. |

***

## Verification Result Reasons

What each reason means and what to do, as shown in the verification log.

| Reason | What it means | What to do |
| --- | --- | --- |
| PROOF\_REQUEST\_EXPIRED | The agent answered more than 5 minutes after the proof request was created. | Service creates a new proof request and asks again. |
| PROOF\_REQUEST\_ALREADY\_USED | The proof request was already used for a check. Each one works once. | Service creates a new proof request. |
| UNTRUSTED\_ISSUER | The Agent Cert was issued by an issuer AVG does not accept (only the Zetrix issuer is accepted). | Agent needs an Agent Cert from Zetrix (MBI). |
| CREDENTIAL\_TYPE\_MISMATCH | The agent showed the wrong type of Agent Cert, e.g. Basic where Verified only is required. | Owner gets a Verified Agent Cert, or the service accepts Basic. |
| CREDENTIAL\_EXPIRED | The Agent Cert is past its expiry date. | Owner renews the Agent Cert. |
| CREDENTIAL\_REVOKED | The Agent Cert was revoked by Zetrix. | Owner contacts Zetrix support; a new Agent Cert is needed. |
| CHALLENGE\_MISMATCH | The agent's proof was not made for this proof request. | Agent answers the current proof request again. |
| MISSING\_CLAIMS | The agent did not share all the details the service asked for. The missing claim names are listed. | Agent asks the owner to share them, then answers a new proof request. |
| DISCLOSURE\_DECLINED | The owner said no to sharing the requested details with this service. | Service cannot serve the agent unless it asks for fewer details. |
| CREDENTIAL\_NOT\_HELD | The agent does not have the type of Agent Cert the service needs. | Owner applies for the needed Agent Cert. |
| VERIFIER\_UNAVAILABLE | AVG could not read the Zetrix chain at that moment. | Service creates a new proof request and tries again later. |
| CALLBACK\_FAILED | The check finished but AVG could not reach the service's callback URL after 3 retries. The agent still got the result. | Service fixes its callback URL; the result is still valid through the `PROOF-RESPONSE` header. |
| SERVICE\_SUSPENDED | The service is suspended or delisted, so AVG refused the call. | Registry controller or Zetrix reactivates the service. |
| INVALID\_API\_KEY | The service used an API key that is wrong, revoked or expired. | Service uses its current API key or asks its registry controller to rotate it. |
| CLAIMS\_NOT\_ALLOWED | The service asked for details outside its approved list. | Service asks only for approved claims, or applies to change its list. |
| CREDENTIAL\_REQUIREMENT\_TOO\_LOW | The service asked for a broader credential than it was approved for. | Service asks for the credential it was approved for. |
| RATE\_LIMITED | The service sent more than 60 proof requests in one minute. | Service waits and tries again. |
| HMAC\_MISMATCH | The signed result did not match the service's secret, so it was changed or not from AVG. Seen only on the service side. | Service refuses the call. |
