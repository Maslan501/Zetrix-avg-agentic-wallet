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
| **Agent endpoints** (Registry Public API) | API reference for searching the registry and reading agent cards, generated from the Zetrix Registry OpenAPI specification. |

***

## **Registry Public API**

Agents find services through the Zetrix Registry Public API. It is open: no API key and no login. The full reference, with schemas, code samples and **Test it**, is generated from the Zetrix Registry OpenAPI specification and listed under this section as **Agent endpoints**, with **Models** and **Download OpenAPI spec**.

| Environment | Base URL |
| --- | --- |
| Production | `https://agent-registry.zetrix.com` |
| UAT (development and testing) | `https://agent-registry.myegdev2.com` |

| Method | URL | Description |
| --- | --- | --- |
| GET | `/v1/entries` | List and search `Listed` entries. Filter with `type`, search with `q` (2 to 100 characters), page with `limit` (1 to 50, default 10) and `offset`. |
| GET | `/v1/entries/{id}/agent-card.json` | The entry's agent card: the ERC-8004 registration file plus a `zetrix` block. Send `If-None-Match` to get `304` while the card is unchanged. |
| GET | `/health` | Liveness and database reachability. |

**How an agent uses it**

1. Search the list (`GET /v1/entries`) and pick a service.
2. Read that service's agent card from its `agentCardUrl`.
3. Check the card: `active` is `true`, `supportedTrust` contains `Service Cert`, and `zetrix.requiredCredential` / `zetrix.allowedClaims` show which Agent Cert and claims the service may ask for.
4. Call the service endpoint in `services[0]` directly. The service answers with its own x401 / AVG flow; the registry is not part of that call.
5. Re-read the card later with `If-None-Match`.

| Entry state | List | Agent card |
| --- | --- | --- |
| Listed | Shown | `200`, `active: true` |
| Suspended | Not shown | `200`, `active: false`. Do not call the service. |
| Removed, pending or unknown | Not shown | `404` |

**Limits:** 120 requests a minute per client address over all calls together. Over it: `429` with `Retry-After` (seconds).

{% hint style="info" %}
In UAT nothing is sent to OpenAgenet, so cards have no `didOan` and `agentRegistry` uses the testnet chain. A missing `didOan` in UAT is not an error.
{% endhint %}
