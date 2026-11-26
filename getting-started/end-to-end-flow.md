# end to end flow

The Phase 1 happy path: an owner gets a Verified Agent Cert, a service is onboarded, and the agent is verified when it calls the service.

{% stepper %}
{% step %}
## Owner Gets a Verified Agent Cert

The owner asks their agent for a Verified Agent Cert, confirms ownership in the MyDigital ID app through ZVG, and MBI issues the cert to the agent's public key.

See [Apply for Verified Agent Cert](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/agent-wallet/apply-verified-agent-cert.md).
{% endstep %}

{% step %}
## Service Onboarding to Go-Live

A registry controller Maker submits the service with domain proof and documents. A different Checker or Client Admin approves it. On approval the service is registered in AVG, receives its API key, signing secret and Service Cert, and is listed in the Zetrix registry and mirrored on OpenAgenet.

See [Service Onboarding Application](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/admin-portal/service-onboarding-application.md) and [Approve or Reject Application](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/admin-portal/approve-or-reject-application.md).
{% endstep %}

{% step %}
## Agent Calls a Service

The agent calls the service. The service gets a proof request from AVG and passes it to the agent. The agent creates a selective-disclosure VP, submits it to AVG and forwards AVG's signed result to the service, which checks the signature and serves the call.

See [Proof Request](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/api-specification/proof-request.md), [Verifiable Presentation Submission](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/api-specification/vp-submission.md) and [Signed Verification Result](file:///k4fkDGZOCkMU11nbXFaC/3d8632a6-bae0-468e-a90a-3c8bb642fc65/api-specification/signed-verification-result.md).
{% endstep %}
{% endstepper %}
