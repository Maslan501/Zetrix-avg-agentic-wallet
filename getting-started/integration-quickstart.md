# integration quickstart

This page lists what a service (website, API, agent or MCP server) must do to verify calling agents through AVG.

{% hint style="info" %}
Services do not log in to the Admin Portal in Phase 1. Your registry controller (pilot: a telco) onboards your service and hands you the API key and signing secret.
{% endhint %}

## Before You Integrate

Give your registry controller the following so they can submit your onboarding application:

| Item                    | Notes                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service details         | Name, type, description, endpoint URL (HTTPS), version.                                                                                                   |
| Company details         | Company name, registration number, country, technical contact.                                                                                            |
| Domain proof            | Add the DNS TXT record the portal generates: name `_zetrix-verify.<endpoint domain>`, value `zetrix-verify=<token>`. Keep it while the service is active. |
| Required credential     | `Basic only`, `Verified only`, or `Basic or Verified`.                                                                                                    |
| Allowed claims          | Extra claims you need beyond the defaults, with a written justification for personal claims.                                                              |
| Callback URL            | HTTPS, on the verified endpoint domain. Mandatory.                                                                                                        |
| OpenAgenet listing data | Capability tags, use case examples, input / output description, manifest / schema link, OpenAgenet domains.                                               |
| Supporting documents    | At least one (e.g. company registration certificate). PDF, JPG or PNG, up to 5 MB each, maximum 15 files.                                                 |

After approval you receive, **once**:

| Credential          | Use                                                        |
| ------------------- | ---------------------------------------------------------- |
| API key             | Authenticates your calls to AVG.                           |
| HMAC signing secret | Verifies the signed results AVG produces for your service. |

## Integration Steps

{% stepper %}
{% step %}
## Receive the agent's call

When an agent calls your service and you need to know who it is, ask AVG for a proof request.
{% endstep %}

{% step %}
## Create a proof request

Call [Create Proof Request](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/api-specification/proof-request.md) with your API key, the credential you require and the claims you need.
{% endstep %}

{% step %}
## Return the proof request to the agent

Pass it to the agent unchanged, for example in an x401 response.
{% endstep %}

{% step %}
## Wait for the signed result

The agent submits its VP directly to AVG and forwards AVG's signed result to you in the x401 header. AVG also posts the same result to your callback URL.
{% endstep %}

{% step %}
## Verify the HMAC

Verify the HMAC with your signing secret, check the `proofRequestId` is one you created, and check `result` is `true`. See [Signed Verification Result](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/api-specification/signed-verification-result.md).
{% endstep %}

{% step %}
## De-duplicate

De-duplicate by `proofRequestId`. You receive each result at least twice (header and callback); treat them as one.
{% endstep %}

{% step %}
## Decide what to allow

A `true` result proves identity only. Authorisation is your decision.
{% endstep %}
{% endstepper %}

## Checklist

* [ ] API key stored in a secret manager, never in source code or logs.
* [ ] Signing secret stored encrypted; rotation handled with a 24-hour overlap.
* [ ] Callback endpoint answers `2xx` within 5 seconds and is idempotent per `proofRequestId`.
* [ ] Requests only claims within your Allowed Claims.
* [ ] Handles `RATE_LIMITED` (default 60 proof requests per minute) using the `Retry-After` header.
* [ ] Refuses any result whose HMAC does not match (`HMAC_MISMATCH`).
* [ ] Creates a new proof request for every retry. Each proof request works once and expires after 5 minutes.
