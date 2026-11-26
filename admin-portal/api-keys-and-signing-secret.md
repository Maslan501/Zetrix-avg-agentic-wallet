# api keys and signing secret

The API key identifies which service is calling AVG. The signing secret lets the service verify AVG's results. Both can be replaced without downtime and blocked in an emergency.

## Who

* Checker and Client Admin for their own company's services
* Super Admin for any service

## Key List

Shows:

* Key ID
* Prefix and last 4 characters
* Status: `Active`, `Expiring`, or `Revoked`
* Created date
* Created by
* Last used time

## Actions

| Action        | Effect                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Rotate key    | Creates a new key, shown once, and sets the old key to `Expiring`. The expiring key works for 24 hours, then is revoked automatically. |
| Revoke key    | Stops the key at once; AVG rejects it within 60 seconds. A reason is mandatory.                                                        |
| Rotate secret | Creates a new secret, shown once. AVG signs with the new secret; the old secret stays valid for 24 hours.                              |
| Revoke secret | Stops the secret at once.                                                                                                              |

## Rules

| Rule         | Detail                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Maximum keys | 2 non-revoked keys per service.                                                                                                                         |
| Last key     | Revoking the only active key shows a warning that the service will stop working until a new key is created. The key is revoked only after confirmation. |
| Storage      | Only a hash of the key is stored. The full key is never logged or shown again.                                                                          |
| No fresh 2FA | Rotating or revoking does not ask for an extra authenticator code.                                                                                      |

## Field Validation

| Field                                | Description                      | Min | Max | Mandatory |
| ------------------------------------ | -------------------------------- | --- | --- | --------- |
| Action                               | Rotate / Revoke.                 | —   | —   | Yes       |
| Revocation Reason                    | Mandatory for Revoke. No emojis. | 10  | 500 | No        |
| Key ID / Prefix / Status / Last Used | Read-only.                       | —   | —   | Yes       |

## Messages

{% hint style="warning" %}
**Maximum keys reached:** "Revoke the expiring key before rotating again."
{% endhint %}

## Sequence Diagram
