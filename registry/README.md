# Registry and Service Cert

Every approved service gets two identifiers and a credential, all created by Zetrix on approval:

| Item | What it is | Analogy |
| --- | --- | --- |
| Service **did:zid** | The service's identity on Zetrix. Key of the Zetrix registry and subject of the Service Cert. | IC number |
| Service **did:oan** | The service's identity on OpenAgenet: `did:oan:<routing code>:<suffix>`. | Passport for OpenAgenet |
| **Service Cert** | A VC issued by MBI to the did:zid, naming the registry controller that approved the service. | Licence |

Zetrix is the controller of both DIDs. Their private keys are created and kept in the Zetrix HSM and never leave it. The registry controller itself has no DID.

| Page | Description |
| --- | --- |
| [Zetrix Registry and OpenAgenet Mirror](zetrix-registry-and-openagenet.md) | How listings are created, hidden, shown, removed and mirrored. |
| [Service Cert](service-cert.md) | How Service Certs are issued, renewed and revoked. |
