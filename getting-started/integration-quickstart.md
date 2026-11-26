# Service Integration Quickstart

This page lists what a service (website, API, agent or MCP server) must do to verify calling agents through AVG.

{% hint style="info" %}
Services do not log in to the Admin Portal in Phase 1. Your registry controller (pilot: a telco) onboards your service and hands you the API key and signing secret.
{% endhint %}

## **Before You Integrate**

Give your registry controller the following so they can submit your onboarding application:

| Item | Notes |
| --- | --- |
| Service details | Name, type, description, endpoint URL (HTTPS), version. |
| Company details | Company name, registration number, country, technical contact. |
| Domain proof | Add the DNS TXT record the portal generates: name `_zetrix-verify.<endpoint domain>`, value `zetrix-verify=<token>`. Keep it while the service is active. |
| Required credential | `Basic only`, `Verified only`, or `Basic or Verified`. |
| Allowed claims | Extra claims you need beyond the defaults, with a written justification for personal claims. |
| Callback URL | HTTPS, on the verified endpoint domain. Mandatory. |
| OpenAgenet listing data | Capability tags, use case examples, input / output description, manifest / schema link, OpenAgenet domains. |
| Supporting documents | At least one (e.g. company registration certificate). PDF, JPG or PNG, up to 5 MB each, maximum 15 files. |

After approval you receive, **once**:

| Credential | Use |
| --- | --- |
| API key | Authenticates your calls to AVG. |
| HMAC signing secret | Verifies the signed results AVG produces for your service. |

## **Integration Steps**

1. **Receive the agent's call** (step 3). When an agent calls your service and you need to know who it is, ask AVG for a proof request.
2. **Create a proof request** (step 4). Call [Create Proof Request](../api-specification/proof-request.md) with your API key, the credential you require and the claims you need.
3. **Return the proof request to the agent** (step 5). Pass it to the agent unchanged, for example in an x401 response.
4. **Wait for the signed result** (step 8b / 8c). The agent submits its VP directly to AVG and forwards AVG's signed result to you in the x401 header. AVG also posts the same result to your callback URL.
5. **Verify the HMAC** with your signing secret, check the `proofRequestId` is one you created, and check `result` is `true`. See [Signed Verification Result](../api-specification/signed-verification-result.md).
6. **De-duplicate** by `proofRequestId`. You receive each result at least twice (header and callback); treat them as one.
7. **Decide what to allow.** A `true` result proves identity only. Authorisation is your decision.

## **Checklist**

* [ ] API key stored in a secret manager, never in source code or logs.
* [ ] Signing secret stored encrypted; rotation handled with a 24-hour overlap.
* [ ] Callback endpoint answers `2xx` within 5 seconds and is idempotent per `proofRequestId`.
* [ ] Requests only claims within your Allowed Claims.
* [ ] Handles `RATE_LIMITED` (default 60 proof requests per minute) using the `Retry-After` header.
* [ ] Refuses any result whose HMAC does not match (`HMAC_MISMATCH`).
* [ ] Creates a new proof request for every retry. Each proof request works once and expires after 5 minutes.
