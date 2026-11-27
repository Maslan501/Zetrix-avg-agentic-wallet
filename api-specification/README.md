# API Specification

AVG exposes a REST API used by two callers. The full endpoint reference, with request and response schemas, code samples and **Test it**, is generated from the AVG OpenAPI specification and listed under this section: **Proof Requests**, **Agent Endpoints**, **Logs**, the callback webhook page and **Models**. You can also download the specification from **Download OpenAPI spec**.

| Caller | Authenticates with | Reference pages |
| --- | --- | --- |
| Service | AVG API key, `Authorization: Bearer <key>` | **Proof Requests**, **Logs** |
| Calling agent (Zetrix Agentic Wallet) | No API key. The request id, the signed nonce and the holder binding in the VP. | **Agent Endpoints** |

AVG also calls the service: it posts every signed result to the service's registered callback URL. See [Signed Verification Result](signed-verification-result.md).

## **Base URL**

| Environment | Base URL |
| --- | --- |
| Production | `https://avg.zetrix.com` |
| UAT (development and testing) | `https://avg.myegdev2.com` |

In Phase 1, Zetrix hosts one AVG for every service. The AVG URL is also published on each service card in the Zetrix registry, and the agent wallet only submits proofs to that URL.

## **Endpoint Summary**

| Method | URL | Caller | Description |
| --- | --- | --- | --- |
| POST | `/v1/proof-requests` | Service | Create a one-time proof request, naming the credential and claims for this request. |
| POST | `/v1/verification/request` | Service | Create a proof request using the service's default rules (compatible response shape). |
| GET | `/v1/presentation/{id}` | Agent | Fetch what is being asked: credential query, nonce, state, submit and abort URLs. |
| POST | `/v1/presentation/submit` | Agent | Submit the proof (VP) and receive the signed result. |
| POST | `/v1/presentation/abort` | Agent | Cancel a request (needs the `state` from the definition). |
| GET | `/health` | Anyone | Server health, including the Zetrix chain state: `up`, `down` or `trial`. |
| GET | `/v1/logs` | Service | Read the service's own verification records from the last 30 days. |
| POST | `{callbackUrl}` | AVG to service | Webhook: the signed result, sent after every check. |

## **The Flow**

1. An agent calls your service.
2. Your service asks AVG for a proof request with its API key (`POST /v1/proof-requests`).
3. Your service sends the proof request to the agent in an `x401` answer (HTTP 401).
4. The agent fetches the request from AVG, builds its proof and submits it to AVG. Your service does not call these endpoints.
5. AVG checks the proof, returns a signed result to the agent, and also posts it to your callback URL. The agent hands the result to you in the `PROOF-RESPONSE` header.
6. Your service checks the signature with its signing secret and decides.

## **Limits**

| Limit | Rule |
| --- | --- |
| Per service | At most 60 proof requests a minute (sliding window). Over it: `429 RATE_LIMITED` with `Retry-After`. A wrong API key does not use up the service's allowance. |
| Agent endpoints | 120 requests a minute per client address on each of the three agent endpoints. |
| Zetrix chain down | After three failed chain reads in a row, AVG refuses **new** proof requests with `503 VERIFIER_UNAVAILABLE` and `Retry-After`. Open requests are kept, and their checks fail closed. After 30 seconds AVG lets new requests through again as a trial. |

## **Conventions**

* All traffic is HTTPS only (TLS 1.3 preferred, TLS 1.2 permitted).
* Request and response bodies are JSON (`Content-Type: application/json`).
* Timestamps are ISO 8601 in UTC.
* Claim keys use the attribute names of the [AVG VC Templates](../vc-templates.md), for example `agentName`, `ownerVerified`, `evidenceProvider`.
