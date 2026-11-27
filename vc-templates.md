# AVG VC Templates

The three VC templates in the Zetrix Issuer Platform used in Phase 1. Template IDs are kept in backend configuration. The claims a service can pick at onboarding must match the keys below.

* **Mandatory:** set on the template.
* **Visibility:** only affects the certificate card. A hidden field can still be shared in a VP with owner consent.
* **Verified Agent Cert:** only fields every identity source gives are mandatory. SSIVC checks the required fields per source before issue. MyDigital ID must give `ownerName`, `ownerId`, `ownerIdType`, `dob` and `countryOfOrigin`.

## **Template Settings**

| Template | Version | Repeat Issue | Renewal by Owner | VC Unique |
| --- | --- | --- | --- | --- |
| Basic Agent Cert | 1.0.0 | Yes | No | No |
| Verified Agent Cert | 1.1.0 | Yes | Yes | Yes |
| Service Cert | 1.0.0 | Yes | No | No |

Template Expiry is `No` for all three; VC expiry is set per VC at issue. For the Verified Agent Cert, *VC Unique* refuses a new cert while an active one exists with the same `id` value, even in another wallet.

***

## Basic Agent Cert

| Key (attribute name) | Description | Template rules |
| --- | --- | --- |
| `credentialSubject.id` *(VC field)* | The agent's own DID (did:zid). Not a person's ID. | Set by MBI at issue. |
| `validUntil` *(VC field)* | Issue date + 12 months. | Set by SSIVC at issue. |
| `agentName` (Agent Name) | The agent's unique name, chosen by the owner. MBI checks it is free. | Mandatory: Yes · Visibility: Show · **Default claim** |
| `agentPurpose` (Agent Purpose) | What the agent is for, in the owner's words. Owner-declared, not checked. | Mandatory: No · Visibility: Show · Extra claim, needs owner consent |

***

## Verified Agent Cert

| Key (attribute name) | Description | Template rules |
| --- | --- | --- |
| `credentialSubject.id` *(VC field)* | The agent's own DID (did:zid). | Set by MBI at issue. |
| `validUntil` *(VC field)* | Follows the validity the identity source returns. | Set by SSIVC at issue. |
| `id` *(added by Issuer Platform)* | Value the VC Unique check compares. Filled by SSIVC at issue. | Mandatory: Yes (fixed) · Not offered as a claim |
| `agentName` (Agent Name) | The agent's unique name. | Mandatory: Yes · Visibility: Show · **Default claim** |
| `agentPurpose` (Agent Purpose) | What the agent is for. Owner-declared. | Mandatory: No · Visibility: Show · Extra claim, needs consent |
| `ownerType` (Owner Type) | Individual or Organisation. Always Individual in Phase 1. | Mandatory: No · Visibility: Hide · Not offered as a claim |
| `ownerVerified` (Owner Verified) | `true` when the owner passed the identity check. | Mandatory: Yes · Visibility: Show · **Default claim** |
| `ownerConsent` (Owner Consent) | `true` when the owner agreed to issuance. | Mandatory: No · Visibility: Hide · Not offered as a claim |
| `ownerName` (Owner Name) | Owner's legal name. | Mandatory: No · Visibility: Hide · Extra, **personal**: justification + consent |
| `ownerId` (Owner ID Number) | Owner's full ID number, e.g. IC number. Read with `ownerIdType`. | Mandatory: No · Visibility: Hide · Extra, **personal** · Not disclosed by default |
| `ownerIdType` (Owner ID Type) | `NRIC` or `PASSPORT`. Always `NRIC` in Phase 1. | Mandatory: No · Visibility: Hide · Shared together with `ownerId` |
| `ownerPhoneNumber` (Owner Phone Number) | Only when the identity source gives a verified one. Not from MyDigital ID in Phase 1. | Mandatory: No · Visibility: Hide · Extra, **personal** · Not disclosed by default |
| `dob` (Date Of Birth) | Owner's date of birth. | Mandatory: No · Visibility: Hide · Extra, **personal** · Not disclosed by default |
| `countryOfOrigin` (Country Of Origin) | Two-letter code of the country that issued the owner's verified ID, e.g. `MY`. | Mandatory: No · Visibility: Hide · Extra, **personal** · Not disclosed by default |
| `evidenceProvider` (Evidence Provider) | Who did the identity check, e.g. `mydigitalid`. | Mandatory: Yes · Visibility: Show · **Default claim** |
| `evidenceMethod` (Evidence Method) | How the check was done, e.g. `eKYC-SSO`. | Mandatory: No · Visibility: Hide · Not offered as a claim |
| `evidenceAssuranceLevel` (Evidence Assurance Level) | Strength of the identity check, set by Zetrix per source. Always `HIGH` in Phase 1. | Mandatory: No · Visibility: Show · Extra claim |
| `evidenceDate` (Evidence Verification Date) | Date and time the owner passed the check. | Mandatory: Yes · Visibility: Show · Extra claim |

***

## Service Cert

| Key (attribute name) | Description | Template rules |
| --- | --- | --- |
| `credentialSubject.id` *(VC field)* | The service's did:zid, created when a registry controller appointed by Zetrix approves the service. | Set by MBI at issue. |
| `validUntil` *(VC field)* | Issue date + 12 months; renewed 30 days before expiry while Active. | Set by SSIVC at issue. |
| `serviceDidOan` (Service DID OAN) | The service's did:oan. | Mandatory: Yes · Visibility: Show |
| `serviceName` (Service Name) | From the approved application. | Mandatory: Yes · Visibility: Show |
| `endpointDomain` (Endpoint Domain) | e.g. `api.quickquote.com`. | Mandatory: Yes · Visibility: Show |
| `serviceType` (Service Type) | Category picked on the application. | Mandatory: Yes · Visibility: Show |
| `approverName` (Approver Name) | Registry controller that approved the service. | Mandatory: Yes · Visibility: Show |
| `approvalDate` (Approval Date) | Date the service was approved. | Mandatory: Yes · Visibility: Show |

***

## Claim Key Reference

Mapping between the onboarding labels and the claim keys used in the API.

| Label | Claim key | Basic | Verified | Type |
| --- | --- | --- | --- | --- |
| agent name | `agentName` | Yes | Yes | Default |
| owner-verified flag | `ownerVerified` | — | Yes | Default (Verified) |
| evidence provider | `evidenceProvider` | — | Yes | Default (Verified) |
| agent purpose | `agentPurpose` | Yes | Yes | Extra |
| assurance level | `evidenceAssuranceLevel` | — | Yes | Extra |
| evidence date | `evidenceDate` | — | Yes | Extra |
| owner name | `ownerName` | — | Yes | Extra, personal |
| owner ID number | `ownerId` (+ `ownerIdType`) | — | Yes | Extra, personal |
| date of birth | `dob` | — | Yes | Extra, personal |
| country of origin | `countryOfOrigin` | — | Yes | Extra, personal |
| owner phone number | `ownerPhoneNumber` | — | Yes | Extra, personal |
