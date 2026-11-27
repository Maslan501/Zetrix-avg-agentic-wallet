# AVG Flows

Every flow that touches the Agent Verification Gateway. The flows fall into two groups: the **main AVG flow** that runs on every agent call, and the **Zetrix Registry Admin to AVG** flows that set up and control a service.

## **Flow Index**

| Diagram                                                                        | Group        | What it shows                                                            |
| ------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------ |
| [AVG-01](avg-flows.md#avg-01-create-proof-request)                             | Main         | AVG creates the proof request (x401 challenge).                          |
| [AVG-02](avg-flows.md#avg-02-wallet-responds-with-selective-disclosure-vp)     | Main         | The wallet checks the request, gets consent and submits the VP to AVG.   |
| [AVG-03](avg-flows.md#avg-03-avg-verifies-vp-and-delivers-the-signed-result)   | Main         | AVG checks the agent's VP, signs the result and sends it to the service. |
| [AVG-04](avg-flows.md#avg-04-approve-application-and-register-service-in-avg)  | Admin to AVG | Registers a service in AVG and returns the API key and HMAC secret.      |
| [AVG-05](avg-flows.md#avg-05-update-a-live-service-in-avg)                     | Admin to AVG | Updates a live service in AVG.                                           |
| [AVG-06](avg-flows.md#avg-06-rotate-and-revoke-api-keys-and-signing-secret)    | Admin to AVG | Rotates and revokes API keys and the signing secret.                     |
| [AVG-07](avg-flows.md#avg-07-suspend-reactivate-or-delist-a-service)           | Admin to AVG | Suspends, reactivates or delists a service.                              |
| [AVG-08](avg-flows.md#avg-08-update-avg-first-then-publish-listing-and-mirror) | Admin to AVG | Updates the service status in AVG before publishing the listing.         |
| [AVG-09](avg-flows.md#avg-09-issue-and-revoke-service-cert)                    | Admin to AVG | If cert revoke fails, the service stays blocked in AVG.                  |
| [AVG-10](avg-flows.md#avg-10-read-avg-verification-logs)                       | Admin to AVG | Reads the AVG verification logs.                                         |

***

## Main AVG Flow

### AVG-01 Create Proof Request

The service asks AVG, with its API key, for a single-use proof request. AVG validates the key, service status, rate limit and requested claims, then returns an OID4VP proof request with a 5-minute x401 challenge. See **Proof Requests** under [API Specification](../api-specification/README.md).

<figure><img src="../.gitbook/assets/avg-01-create-proof-request.svg" alt="AVG-01 Create proof request"><figcaption><p>AVG-01 Create proof request (x401 challenge)</p></figcaption></figure>

### AVG-02 Wallet Responds with Selective-Disclosure VP

The wallet trusts the proof request only if the service is in the Zetrix registry and the submit URL matches the AVG URL on its service card. It asks the owner before sharing any non-default claim, has MBI build the VP, and submits it to AVG. See [Respond to Proof Request](../agent-wallet/respond-to-proof-request.md).

<figure><img src="../.gitbook/assets/avg-02-respond-proof-request.svg" alt="AVG-02 Wallet responds with selective-disclosure VP"><figcaption><p>AVG-02 Wallet responds with selective-disclosure VP</p></figcaption></figure>

### AVG-03 AVG Verifies VP and Delivers the Signed Result

AVG verifies the VP against the Zetrix chain (MBI is not called), signs the result with the service's HMAC secret, returns it to the agent and posts the same result to the service's callback. See **Agent Endpoints** under [API Specification](../api-specification/README.md) and [Signed Verification Result](../api-specification/signed-verification-result.md).

<figure><img src="../.gitbook/assets/avg-03-verify-vp.svg" alt="AVG-03 AVG verifies VP and delivers signed result"><figcaption><p>AVG-03 AVG verifies VP (OID4VP) and delivers a signed result</p></figcaption></figure>

***

## Zetrix Registry Admin to AVG (Setup and Control)

### AVG-04 Approve Application and Register Service in AVG

On approval the Zetrix Registry Admin registers the service in AVG, which returns the API key and HMAC signing secret (shown once). Zetrix creates the service DIDs in the HSM, SSIVC has MBI issue the Service Cert, and the listing is published.

<figure><img src="../.gitbook/assets/avg-04-approve-register.svg" alt="AVG-04 Approve application and register service in AVG"><figcaption><p>AVG-04 Approve application and register service in AVG</p></figcaption></figure>

### AVG-05 Update a Live Service in AVG

An approved update changes the AVG registration while keeping the API key, secret and DIDs. A new Service Cert is issued only if the name or endpoint domain changed.

<figure><img src="../.gitbook/assets/avg-05-update-live-service.svg" alt="AVG-05 Update a live service in AVG"><figcaption><p>AVG-05 Update a live service in AVG</p></figcaption></figure>

### AVG-06 Rotate and Revoke API Keys and Signing Secret

Key and secret rotation keep the old value working for 24 hours; revocation takes effect in AVG within 60 seconds.

<figure><img src="../.gitbook/assets/avg-06-api-keys-secret.svg" alt="AVG-06 Rotate and revoke API keys and signing secret"><figcaption><p>AVG-06 Rotate and revoke API keys and signing secret</p></figcaption></figure>

### AVG-07 Suspend, Reactivate or Delist a Service

AVG is always updated first, so a suspended or delisted service is blocked even if the Service Cert or registry update fails.

<figure><img src="../.gitbook/assets/avg-07-suspend-reactivate-delist.svg" alt="AVG-07 Suspend, reactivate or delist a service"><figcaption><p>AVG-07 Suspend, reactivate or delist a service</p></figcaption></figure>

### AVG-08 Update AVG First, Then Publish Listing and Mirror

Every listing change updates the service status in AVG before the Zetrix registry and the OpenAgenet mirror. See [Zetrix Registry and OpenAgenet Mirror](../registry/zetrix-registry-and-openagenet.md).

<figure><img src="../.gitbook/assets/avg-08-registry-sync.svg" alt="AVG-08 Update AVG first, then publish listing and mirror"><figcaption><p>AVG-08 Update AVG first, then publish listing and mirror</p></figcaption></figure>

### AVG-09 Issue and Revoke Service Cert

Service Certs are issued through SSIVC and MBI. If a revoke fails, the service stays blocked in AVG and the portal shows Retry. See [Service Cert](../registry/service-cert.md).

<figure><img src="../.gitbook/assets/avg-09-service-cert.svg" alt="AVG-09 Issue and revoke Service Cert"><figcaption><p>AVG-09 Issue and revoke Service Cert</p></figcaption></figure>

### AVG-10 Read AVG Verification Logs

Zetrix Registry Admin users read logs within their organisation scope; services read their own logs through the AVG log API. Claim values are never stored. See **Logs** under [API Specification](../api-specification/README.md).

<figure><img src="../.gitbook/assets/avg-10-verification-logs.svg" alt="AVG-10 Read AVG verification logs"><figcaption><p>AVG-10 Read AVG verification logs</p></figcaption></figure>
