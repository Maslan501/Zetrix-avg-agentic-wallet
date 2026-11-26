# README

The Zetrix Registry Admin Portal is the web portal where registry controllers (pilot: telcos such as Omantel and Airtel Africa) onboard and manage services, and where Zetrix oversees every service. It controls which services can verify agents through AVG and which services appear in the Zetrix registry.

{% hint style="info" %}
The portal is a desktop web app (latest two versions of Chrome, Edge and Safari, from 1280 px width and at 200% zoom). There is no mobile app and no self sign-up. Service owners do not log in in Phase 1.
{% endhint %}

## Functions

| Function                   | Description                                                               | Page                                                                                     |
| -------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Login and account security | Email + password + authenticator code, lockout, password reset, sessions. | [Login and Account Security](/broken/pages/59587a2a3d3e136d897491983300ce554973ab6f)     |
| Client accounts            | Zetrix creates and suspends registry controller accounts.                 | [Client Accounts](/broken/pages/772340684016640ee5b5c7fa8b9326fdc444dd79)                |
| User management            | Invite users, change roles, unlock, reset 2FA, deactivate.                | [User Management](/broken/pages/1ddc4fe8fe5fae0b4d6b49f3ac464a4ecc5b710f)                |
| Service application        | Submit a new service or an update to a live service.                      | [Service Onboarding Application](/broken/pages/e46da5665081daea7d7d997493525413b2efd3d8) |
| Approval                   | Maker / checker approval of applications and updates.                     | [Approve or Reject Application](/broken/pages/edfe192a720e2bd621c22356321165526f798eb6)  |
| API keys                   | Rotate or revoke the AVG API key and signing secret.                      | [API Keys and Signing Secret](/broken/pages/dbf5e0b0fdb9b74fa0dd923c943bac5f3ac6b35e)    |
| Service lifecycle          | Suspend, reactivate or delist a service.                                  | [Suspend, Reactivate or Delist](/broken/pages/a7c9d7a6e52144484411c77502049481a55caefe)  |
| Services and logs          | Service list, verification logs and the failed-checks tile.               | [Services and Verification Logs](/broken/pages/2e83703b8d2ca95b437f94ffbd89578775a78685) |
| Audit trail                | Who did what, when and from where.                                        | [Audit Trail](/broken/pages/27851119220cdad0bc688f921129a54d7c51fd5b)                    |

## Common List Behaviour

Every list (client accounts, users, applications, services, verification logs, API keys, audit trail):

* 20 rows per page by default; choose 10, 20, 50 or 100.
* Total record count and current page shown, with first, previous, next and last controls.
* Filters and sorting are kept when changing page.
* Default sort is newest first.
