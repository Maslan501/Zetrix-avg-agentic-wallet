---
description: >-
  Agent Verification Gateway (AVG): verify that an AI agent belongs to a real,
  verified owner before you serve it.
---

# Overview

The Zetrix Agent Verification Gateway (AVG) is a secure, client-facing verification service that lets websites, APIs, agents and MCP servers confirm the identity of an AI agent before serving it. An agent proves who it is by presenting its **Agent Cert**, a Verifiable Credential (VC) issued by Zetrix through the Malaysia Blockchain Infrastructure VC Service (MBI). AVG checks that proof against the Zetrix chain and returns a signed result the service can trust.

AVG is part of the **Agentic Zetrix Wallet** programme. Phase 1 covers agent identity through the existing ZVG / MyDigital ID owner check, service verification through AVG, and service onboarding by registry controllers through the new Zetrix Registry Admin. Approved services are listed in the Zetrix registry and mirrored on OpenAgenet.

## **Functional Scope**

AVG and its supporting components provide the following functions:

| Function | Description |
| --- | --- |
| Create Proof Request | A service asks AVG, using its API key, for a single-use OID4VP proof request with an x401 challenge. |
| Verify Agent VP | AVG verifies the agent's Verifiable Presentation (VP) itself, using issuer keys and VC status on the Zetrix chain. |
| Signed Result Delivery | AVG returns an HMAC-signed result to the agent (forwarded in the `PROOF-RESPONSE` header) and posts the same result to the service's callback URL. |
| Verification Logs | Every proof request and verification is logged for 30 days, without claim values. |
| Service Onboarding | Registry controllers onboard, approve, suspend and delist services through the Zetrix Registry Admin (maker / checker). |
| Service Discovery | Agents search the Zetrix registry for approved services and see up front which credential and claims each one asks for. |
| Service Cert | Each approved service receives a did:zid Service Cert naming the registry controller that approved it. |

## **Role in the ZID Ecosystem**

* **Trust Gateway:** Sits between services and agents, so services never integrate with MBI or register as an MBI verifier for each VC template.
* **OID4VP Verifier:** Verifies agent VPs directly against the Zetrix chain. MBI only creates the VP; it is not part of the check.
* **Privacy Layer:** Services receive only the claims they were approved for, and only after the owner consents to personal claims.
* **Registry Anchor:** Only services approved through the Zetrix Registry Admin can create proof requests and appear in the Zetrix registry.

## **Benefits**

* **One Integration:** A service integrates once with AVG over REST using an API key, regardless of which Agent Cert template is presented.
* **Replay Protection:** Every proof request carries a one-time challenge (at least 128-bit nonce), expires after 5 minutes and works once.
* **Tamper-Evident Results:** Results are HMAC-signed with the service's own secret, so an agent cannot change a result without breaking the signature.
* **Fail Closed:** AVG never returns `true` unless every check passes and the Zetrix chain was readable.
* **Data Minimisation:** Logs never hold claim values, holder DIDs are masked, and personal claims need written justification at onboarding.

## **Who Should Read This**

| Audience | Start here |
| --- | --- |
| Service developers integrating AVG | [Service Integration Quickstart](getting-started/integration-quickstart.md), [API Specification](api-specification/README.md) |
| Agent wallet developers | [Agent Wallet](agent-wallet/README.md) |
| Registry controller staff | [Registry and Service Cert](registry/README.md) |
| Zetrix operations | [Registry and Service Cert](registry/README.md) |

## **Phase 1 Scope Notes**

* Owner identity check is the existing ZVG / MyDigital ID flow only. Owners without MyDigital ID get a Basic Agent Cert only.
* AVG verifies Zetrix-issued credentials only. CAICT-issued credentials are not supported.
* Agent Cert issuance and service checks are free in Phase 1.
* A `true` result proves agent identity only. It does not authorise any action; that remains the service's decision.
