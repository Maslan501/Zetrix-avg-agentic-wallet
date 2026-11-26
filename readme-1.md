# README

AVG exposes a REST API used by two callers:

| Caller                                | Authenticates with                                   | Endpoints                                                                                                                                                   |
| ------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service                               | AVG API key                                          | [Create Proof Request](/broken/pages/ec2429b399bc699c08fe75436d2587341c5efec6), [Verification Logs](/broken/pages/7ea49100a0cea8dcb29b186dff9fa2d428fd9afe) |
| Calling agent (Zetrix Agentic Wallet) | Proof request ID + VP signed over the x401 challenge | [Submit VP](/broken/pages/6423502d8e0e94f7c4de09b38aeaa2d5009eeb6a)                                                                                         |

AVG also calls the service: it posts every signed result to the service's registered callback URL. See [Signed Verification Result](/broken/pages/3d24e7062735350f8f7a08c905b698defa357108).

{% hint style="warning" %}
**Proposed contract.** The PRD (v1.3.1) defines the behaviour, fields, limits and result codes of AVG but not final URL paths or JSON field spelling. Paths, header names and field names on these pages are a proposed contract derived from the PRD. Confirm them with the AVG development team before you build against them. Result codes, limits and rules are as specified in the PRD.
{% endhint %}

## Base URL

| Environment   | Base URL                                     |
| ------------- | -------------------------------------------- |
| Production    | `https://<avg-host>` _(to be confirmed)_     |
| Testnet / UAT | `https://<avg-uat-host>` _(to be confirmed)_ |

In Phase 1, Zetrix hosts one AVG for every service. The AVG URL is also published on each service card in the Zetrix registry, and the agent wallet only submits VPs to that URL.

## Endpoint Summary

| Method | URL                     | Caller         | Description                                                              |
| ------ | ----------------------- | -------------- | ------------------------------------------------------------------------ |
| POST   | `/v1/proof-requests`    | Service        | Create a single-use OID4VP proof request with an x401 challenge.         |
| POST   | `/v1/presentations`     | Agent          | Submit the agent's VP for a proof request and receive the signed result. |
| POST   | `{callbackUrl}`         | AVG to service | Deliver the signed result to the service's callback URL.                 |
| GET    | `/v1/verification-logs` | Service        | Read the service's own verification log (last 30 days).                  |

## Conventions

* All traffic is HTTPS only (TLS 1.3 preferred, TLS 1.2 permitted).
* Request and response bodies are JSON (`Content-Type: application/json`).
* Timestamps are ISO 8601 in UTC.
* Claim keys use the attribute names of the [AVG VC Templates](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/vc-templates.md), for example `agentName`, `ownerVerified`, `evidenceProvider`.
