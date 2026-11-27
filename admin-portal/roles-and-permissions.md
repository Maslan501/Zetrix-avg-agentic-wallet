---
hidden: true
---

# Roles and Permissions

Each user has exactly one role and belongs to exactly one company (Zetrix or one registry controller). Role-based access and organisation scope are enforced on the backend for every API call, not only hidden in the UI.

## **User Matrix**

| Role | Belongs to | Account created by | Data visible | 2FA | Approval limits |
| --- | --- | --- | --- | --- | --- |
| Zetrix Super Admin | Zetrix | Super Admin | All companies | Required | — |
| Zetrix Ops | Zetrix | Super Admin or Zetrix Ops | All companies | Required | — |
| Client Admin | Registry controller | Super Admin or Zetrix Ops (first one), or Client Admin | Own company | Required | Cannot approve own submission |
| Maker | Registry controller | Client Admin, Super Admin or Zetrix Ops | Own company | Required | — |
| Checker | Registry controller | Client Admin, Super Admin or Zetrix Ops | Own company | Required | Cannot approve own submission |
| Viewer | Registry controller | Client Admin, Super Admin or Zetrix Ops | Own company | Required | — |

## **Role Descriptions**

* **Zetrix Super Admin:** Full access, including suspending, reactivating or delisting any service.
* **Zetrix Ops:** Manages client accounts and all users (except Super Admin accounts and the Super Admin role); views all services, logs and audit records. Cannot suspend, reactivate or delist services.
* **Client Admin:** Everything a Maker and a Checker can do, plus managing their own company's staff.
* **Maker:** Prepares and submits service applications.
* **Checker:** Approves applications and manages services.
* **Viewer:** Read only.

## **Permission Table**

| Module | Function | Super Admin | Zetrix Ops | Client Admin | Maker | Checker | Viewer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account | Log in, log out, forgot password | Yes | Yes | Yes | Yes | Yes | Yes |
| Account | Change own password / authenticator | Yes | Yes | Yes | Yes | Yes | Yes |
| Client accounts | Create, edit, suspend client | Yes | Yes | — | — | — | — |
| User management | Invite, resend or cancel invite, change role, deactivate | All | All \*\* | Own | — | — | — |
| User management | Unlock user, reset 2FA | All | All \*\* | Own | — | — | — |
| Applications | Create, edit, submit (new or update) | View | View | Own | Own | View | View |
| Applications | Approve, reject (new or update) | View | View | Own \* | — | Own \* | View |
| Applications | View / download documents | All | All | Own | Own | Own | Own |
| Services | View services | All | All | Own | Own | Own | Own |
| Services | Rotate / revoke API key and signing secret | All | — | Own | — | Own | — |
| Services | Suspend, reactivate | All | — | Own | — | Own | — |
| Services | Delist | All | — | Own | — | Own | — |
| Services | Retry registry / Service Cert sync | Yes | — | — | — | — | — |
| Verification logs | View logs | All | All | Own | Own | Own | Own |
| Audit trail | View | All | All | Own | — | — | — |

**Legend:** Yes = allowed · All = every company · Own = own company only · View = read only · — = no access · \* = not for an application they created or last edited · \*\* = Zetrix Ops cannot give the Super Admin role, or change, deactivate, unlock or reset 2FA for a Super Admin account.

## **Safety Rules**

Role permissions are stored as settings (not hard-coded) so an approved change can be made without a code release. These safety rules stay in code and cannot be switched off:

* No self-approval: an application must be approved by a different user from the one who created or last edited it.
* Client roles cannot get Zetrix-only actions.
* Zetrix Ops cannot act on Super Admin accounts.
* Cross-tenant access returns `403` and is logged.
