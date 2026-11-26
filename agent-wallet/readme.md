# README

The calling agent uses the **Zetrix Agentic Wallet** (MCP) to hold its Agent Cert, find services, and answer proof requests. Agent private keys never leave the Wallet BE HSM; the wallet only requests signatures.

| Page                                                                                    | Flow steps | Description                                                                                                                   |
| --------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [Apply for Verified Agent Cert](/broken/pages/57f0078a3972716fdc9d693215219dfc4eab31f0) | 1a, 2      | Get a Verified Agent Cert through ZVG / MyDigital ID.                                                                         |
| [Discover Services](/broken/pages/8aba8cc5442b25d020678269fb3a04c2ab20d739)             | —          | Search the Zetrix registry for approved services.                                                                             |
| [Respond to Proof Request](/broken/pages/75651828e5e837a062b9649d89490a67ee55c9ba)      | 5 to 8b    | Check the proof request, get owner consent, create a selective-disclosure VP, submit it to AVG and forward the signed result. |

## Agent Cert Types

| Agent Cert          | Owner check                               | Claims held                                                                                                                                                                                        |
| ------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic Agent Cert    | None (self-declared)                      | `agentName`, `agentPurpose`                                                                                                                                                                        |
| Verified Agent Cert | Owner verified through ZVG / MyDigital ID | `agentName`, `agentPurpose`, `ownerVerified`, `evidenceProvider`, `evidenceAssuranceLevel`, `evidenceDate`, `ownerName`, `ownerId` (+ `ownerIdType`), `dob`, `countryOfOrigin`, `ownerPhoneNumber` |

Full field definitions are in [AVG VC Templates](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/vc-templates.md).
