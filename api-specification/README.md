# API Specification

AVG exposes a REST API used by two callers:

| Caller | Authenticates with | Endpoints |
| --- | --- | --- |
| Service | AVG API key | [Create Proof Request](proof-request.md), [Verification Logs](verification-logs.md) |
| Calling agent (Zetrix Agentic Wallet) | Proof request ID + VP signed over the x401 challenge | [Submit VP](vp-submission.md) |

AVG also calls the service: it posts every signed result to the service's registered callback URL. See [Signed Verification Result](signed-verification-result.md).

## **Base URL**

| Environment | Base URL |
| --- | --- |
| Production | `https://<avg-host>` |
| Testnet / UAT | `https://<avg-uat-host>` |

Base URLs are provided by Zetrix when your service is onboarded. In Phase 1, Zetrix hosts one AVG for every service. The AVG URL is also published on each service card in the Zetrix registry, and the agent wallet only submits VPs to that URL.

## **Endpoint Summary**

| Method | URL | Caller | Description |
| --- | --- | --- | --- |
| POST | `/v1/proof-requests` | Service | Create a single-use OID4VP proof request with an x401 challenge. |
| POST | `/v1/presentations` | Agent | Submit the agent's VP for a proof request and receive the signed result. |
| POST | `{callbackUrl}` | AVG to service | Deliver the signed result to the service's callback URL. |
| GET | `/v1/verification-logs` | Service | Read the service's own verification log (last 30 days). |

## **Conventions**

* All traffic is HTTPS only (TLS 1.3 preferred, TLS 1.2 permitted).
* Request and response bodies are JSON (`Content-Type: application/json`).
* Timestamps are ISO 8601 in UTC.
* Claim keys use the attribute names of the [AVG VC Templates](../vc-templates.md), for example `agentName`, `ownerVerified`, `evidenceProvider`.
