# Table of contents

## Zetrix Agentic Wallet with Agent Verification Gateway (AVG)

* [Overview](README.md)
* [Getting Started](getting-started/README.md)
  * [Architecture](getting-started/architecture.md)
  * [End-to-End Flow](getting-started/end-to-end-flow.md)
  * [AVG Flows](getting-started/avg-flows.md)
  * [Service Integration Quickstart](getting-started/integration-quickstart.md)
* [API Specification](api-specification/README.md)
  * [Authentication](api-specification/authentication.md)
  * [Standard Response Format](api-specification/standard-response-format.md)
  * [Signed Verification Result](api-specification/signed-verification-result.md)
  * [Result and Error Codes](api-specification/result-and-error-codes.md)
  * ```yaml
    type: builtin:openapi
    props:
      models: true
      downloadLink: true
      grouping: by-tag
    dependencies:
      spec:
        ref:
          kind: openapi
          spec: Zetrix-avg-agentic-wallet
    ```
* [Agent Wallet](agent-wallet/README.md)
  * [Apply for Verified Agent Cert](agent-wallet/apply-verified-agent-cert.md)
  * [Discover Services](agent-wallet/discover-services.md)
  * [Respond to Proof Request](agent-wallet/respond-to-proof-request.md)
* [Admin Portal](admin-portal/README.md)
  * [Roles and Permissions](admin-portal/roles-and-permissions.md)
  * [Login and Account Security](admin-portal/login-and-account-security.md)
  * [Client Accounts](admin-portal/client-accounts.md)
  * [User Management](admin-portal/user-management.md)
  * [Service Onboarding Application](admin-portal/service-onboarding-application.md)
  * [Approve or Reject Application](admin-portal/approve-or-reject-application.md)
  * [API Keys and Signing Secret](admin-portal/api-keys-and-signing-secret.md)
  * [Suspend, Reactivate or Delist](admin-portal/suspend-reactivate-delist.md)
  * [Services and Verification Logs](admin-portal/services-and-verification-logs.md)
  * [Audit Trail](admin-portal/audit-trail.md)
* [Registry and Service Cert](registry/README.md)
  * [Zetrix Registry and OpenAgenet Mirror](registry/zetrix-registry-and-openagenet.md)
  * [Service Cert](registry/service-cert.md)
* [AVG VC Templates](vc-templates.md)
* [Reference](reference/README.md)
  * [Glossary](reference/glossary.md)
  * [Non-Functional Requirements](reference/non-functional-requirements.md)
  * [Email Notifications](reference/email-notifications.md)
