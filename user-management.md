# user management

One portal serves Zetrix and every registry controller. Zetrix manages all users; a Client Admin manages only their own company's staff and never sees other companies or Zetrix staff.

## Who Can Do What

| Role                    | Scope                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Super Admin, Zetrix Ops | All users: invite, resend or cancel invite, change role, unlock, reset 2FA, deactivate. Ops cannot act on Super Admin accounts. |
| Client Admin            | Own company only.                                                                                                               |
| Maker, Checker, Viewer  | No access.                                                                                                                      |

## Invite Lifecycle

| Step         | Rule                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Invite       | Invitee receives a "Set up your account" link, valid 24 hours and usable once. The page shows their name, email, company and role.                                        |
| Set up       | Invitee sets a password, then sets up 2FA. On success they land on the Dashboard and their status changes from `Invited` to `Active`.                                     |
| Invalid link | Older than 24 hours, used, replaced or cancelled: "This invite link has expired or was already used. Ask your administrator to send a new one." No account details shown. |
| Resend       | New 24-hour link; the old link stops working at once.                                                                                                                     |
| Cancel       | Link stops working and the user is removed, so the email can be invited again. Active users are deactivated instead.                                                      |

## Business Rules

| Rule              | Detail                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email             | Each email can hold only one account.                                                                                                                |
| Same-name warning | If the full name matches an existing user in the company: "A user named \[Full Name] already exists in this company. Invite anyway?" Warning only.   |
| Role limits       | Client Admin gives only client roles in own company. Zetrix roles only for Zetrix staff. Only a Super Admin can give or remove the Super Admin role. |
| Last admin        | A company must always keep at least one active Client Admin.                                                                                         |
| Own account       | A user cannot change their own role or deactivate themselves.                                                                                        |
| Deactivate        | Ends sessions within 1 minute. Records they created stay unchanged. Can be reactivated.                                                              |
| Unlock            | Forces a password reset email (2-hour one-time link).                                                                                                |
| Reset MFA         | Reason mandatory (10 to 500 characters). Sessions end at once; list shows "MFA reset pending"; user emailed.                                         |

## Field Validation

| Field            | Description                                                   | Min | Max | Mandatory |
| ---------------- | ------------------------------------------------------------- | --- | --- | --------- |
| Company          | Dropdown. Zetrix only; fixed to own company for Client Admin. | —   | —   | Yes       |
| Full Name        | Full name.                                                    | 2   | 255 | Yes       |
| Work Email       | Email address. Unique.                                        | 6   | 254 | Yes       |
| Role             | Roles allowed for the company type.                           | —   | —   | Yes       |
| MFA Reset Reason | Free text, no emojis, trimmed.                                | 10  | 500 | Yes       |

## Messages

| Situation                | Message                                                    |
| ------------------------ | ---------------------------------------------------------- |
| Last Client Admin        | "Each company must keep at least one active Client Admin." |
| Duplicate email          | "This email already has an account."                       |
| Reset MFA without reason | "Enter a reason (at least 10 characters)."                 |

## Sequence Diagram
