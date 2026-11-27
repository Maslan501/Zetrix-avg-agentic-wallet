# Email Notifications

All Zetrix Registry Admin emails are sent from **Zetrix Registry Admin Portal \<no-reply@zetrix.com\>**, in English, with times in UTC. They never include passwords, authenticator codes, 2FA keys, full API keys, signing secrets or claim values.

| Email | Subject | Trigger | Recipient | Link |
| --- | --- | --- | --- | --- |
| Account invite | You are invited to the Zetrix Registry Admin Portal | Client created; user invited; invite resent. | Invited user | "Set up your account" (once, 24 hours) |
| Password reset | Reset your Zetrix Registry Admin Portal password | Forgot password for an existing account. | Account owner | "Reset password" (once, 2 hours) |
| Account unlocked | Your account was unlocked. Set a new password | Administrator unlocks a permanently locked account; or Send a new link. | Unlocked user | "Set new password" (once, 2 hours) |
| Account locked | Your account is locked | Lock for 15 / 30 / 60 minutes, or until unlocked. | Account owner | None |
| 2FA reset | Your 2FA was reset | Administrator resets the user's 2FA. | The user | "Log in" |
| Waiting for review | Waiting for your review: [Service Name] | New application or update submitted. | Active Checkers and Client Admins of the company, except the submitter | "Review application" |
| Approved / rejected | Approved: [Service Name] / Needs changes: [Service Name] | Application or update decided. | Submitter and last editor | "View application" |
| Service suspended | Service suspended: [Service Name] | Zetrix Super Admin suspends a service. | Active Client Admins of the owning company | "View service" |
