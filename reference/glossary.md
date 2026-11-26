# Glossary

| Term | Definition |
| --- | --- |
| Owner | The person who owns an AI agent. |
| Calling Agent | The owner's personal agent (e.g. running in AvatarClaw) that calls other services, using the Zetrix Agentic Wallet MCP. |
| Service | A third-party agent, website, API or MCP server that an agent calls and that checks the agent's identity through AVG. |
| Agent Cert | The agent's identity credential (also AgentCert). Basic = self-declared, no owner check. Verified = owner checked by an identity source. |
| VC / VP | Verifiable Credential (issued, held in the wallet) / Verifiable Presentation (created from a VC to show selected claims with proof). |
| AVG | Agent Verification Gateway. The gateway services integrate with using an API key. Issues proof requests and verifies agent VPs itself, using issuer keys and VC status on the Zetrix chain. |
| MBI | Malaysia Blockchain Infrastructure VC Service. Zetrix issuer of all Agent Certs and Service Certs; also creates VPs for the agent. Does not verify VPs. |
| Zetrix Issuer Platform | Zetrix's issuer portal where VC templates are set up and where Zetrix revokes an Agent Cert when needed. |
| SSIVC | The VC issuer backend (myid backend). Runs the owner session with ZVG, asks MBI to issue the Verified Agent Cert, and issues / revokes Service Certs for the Admin Portal. |
| ZVG | Zetrix Verification Gateway. Identity provider only: checks the human owner (Phase 1: MyDigital ID). |
| Admin Portal | Web portal where registry controllers onboard and manage services and Zetrix oversees them. |
| Registry controller (client) | An organisation that onboards services into the Zetrix registry and takes responsibility for them. Pilot: telcos. |
| OpenAgenet (OAN) | Agent and service discovery network owned by CAICT. Zetrix runs its own registry, mirrored on OpenAgenet. |
| CAICT | China Academy of Information and Communications Technology. Partner; owns OpenAgenet. |
| Proof request | A short-lived, single-use request from AVG telling the agent which credential and claims to show, with a one-time nonce to sign. |
| Nonce / x401 challenge | A random one-time value (at least 128-bit) the agent signs so a copied VP cannot be reused. |
| x401 | Header-based challenge / result exchange between agent and service used for identity proof. |
| x402 | Payment-required handling used for Agent Cert fees (zero-value in Phase 1). |
| OID4VP | OpenID for Verifiable Presentations: the protocol AVG uses as verifier. |
| HMAC | Hash-based message authentication code. AVG signs results with the service's secret; the service recomputes it to detect tampering. |
| did:zid | Zetrix DID method (blockchain-based identifier, resolved on the Zetrix chain). |
| did:oan | OpenAgenet DID method: `did:oan:<routing code>:<suffix>`. |
| Service Cert | A did:zid VC issued by MBI to an approved service, naming the registry controller as approver. |
| Service DID vs Service Cert | Service DID (did:zid) is the service identity. Service Cert is a VC showing it was approved by a registry controller. |
| Required credential | Which Agent Cert a service accepts: Basic only, Verified only, or Basic or Verified. Set at onboarding. |
| Assurance level | How strong the owner identity check was. Set by Zetrix per identity source. MyDigital ID = HIGH. |
| Client Admin / Maker / Checker / Viewer | Registry controller roles in the Admin Portal. |
| Zetrix Super Admin / Zetrix Ops | Zetrix roles in the Admin Portal. |
