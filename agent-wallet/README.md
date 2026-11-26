# Agent Wallet

The calling agent uses the **Zetrix Agentic Wallet** (MCP) to hold its Agent Cert, find services and answer proof requests. Agent private keys never leave the Wallet BE HSM; the wallet only requests signatures.

| Page | Flow steps | Description |
| --- | --- | --- |
| [Apply for Verified Agent Cert](apply-verified-agent-cert.md) | 1a, 2 | Get a Verified Agent Cert through ZVG / MyDigital ID. |
| [Discover Services](discover-services.md) | — | Search the Zetrix registry for approved services. |
| [Respond to Proof Request](respond-to-proof-request.md) | 5 to 8b | Check the proof request, get owner consent, create a selective-disclosure VP, submit it to AVG and forward the signed result. |

## **Agent Cert Types**

| Agent Cert | Owner check | Claims held |
| --- | --- | --- |
| Basic Agent Cert | None (self-declared) | `agentName`, `agentPurpose` |
| Verified Agent Cert | Owner verified through ZVG / MyDigital ID | `agentName`, `agentPurpose`, `ownerVerified`, `evidenceProvider`, `evidenceAssuranceLevel`, `evidenceDate`, `ownerName`, `ownerId` (+ `ownerIdType`), `dob`, `countryOfOrigin`, `ownerPhoneNumber` |

Full field definitions are in [AVG VC Templates](../vc-templates.md).
