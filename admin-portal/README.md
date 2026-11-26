# Admin Portal

The Zetrix Registry Admin Portal is the web portal where registry controllers (pilot: telcos such as Omantel and Airtel Africa) onboard and manage services, and where Zetrix oversees every service. It controls which services can verify agents through AVG and which services appear in the Zetrix registry.

{% hint style="info" %}
The portal is a desktop web app (latest two versions of Chrome, Edge and Safari, from 1280 px width and at 200% zoom). There is no mobile app and no self sign-up. Service owners do not log in in Phase 1.
{% endhint %}

## **Functions**

| Function | Description | Page |
| --- | --- | --- |
| Login and account security | Email + password + authenticator code, lockout, password reset, sessions. | [Login and Account Security](login-and-account-security.md) |
| Client accounts | Zetrix creates and suspends registry controller accounts. | [Client Accounts](client-accounts.md) |
| User management | Invite users, change roles, unlock, reset 2FA, deactivate. | [User Management](user-management.md) |
| Service application | Submit a new service or an update to a live service. | [Service Onboarding Application](service-onboarding-application.md) |
| Approval | Maker / checker approval of applications and updates. | [Approve or Reject Application](approve-or-reject-application.md) |
| API keys | Rotate or revoke the AVG API key and signing secret. | [API Keys and Signing Secret](api-keys-and-signing-secret.md) |
| Service lifecycle | Suspend, reactivate or delist a service. | [Suspend, Reactivate or Delist](suspend-reactivate-delist.md) |
| Services and logs | Service list, verification logs and the failed-checks tile. | [Services and Verification Logs](services-and-verification-logs.md) |
| Audit trail | Who did what, when and from where. | [Audit Trail](audit-trail.md) |

## **Common List Behaviour**

Every list (client accounts, users, applications, services, verification logs, API keys, audit trail):

* 20 rows per page by default; choose 10, 20, 50 or 100.
* Total record count and current page shown, with first, previous, next and last controls.
* Filters and sorting are kept when changing page.
* Default sort is newest first.
