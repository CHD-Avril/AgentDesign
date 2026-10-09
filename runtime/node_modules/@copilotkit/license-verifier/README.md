# @copilotkit/license-verifier

Public runtime package for offline CopilotKit license verification.

## Public API

The package exports one root entry point:

<!-- prettier-ignore -->
```ts
import {
  LICENSED_FEATURES,
  addRuntimeKeyAttestation,
  clearRuntimeKeys,
  createLicenseChecker,
  getFeatureDisplayName,
  getFeatureLimit,
  getMasterPublicKey,
  getPublicKey,
  isComponentFeature,
  isFeatureEnabled,
  isRuntimeFeature,
  organizationEntitlementSchema,
  parseOrganizationEntitlement,
  verifyKeyAttestation,
  verifyLicense,
  type EntitlementReader,
  type KeyAttestationData,
  type LicenseChecker,
  type LicenseFeatures,
  type LicenseOwner,
  type LicensePayload,
  type LicenseStatus,
  type LicenseTier,
  type OrganizationEntitlement,
} from "@copilotkit/license-verifier";
```

`verifyLicense(token)` parses the signed payload, verifies the Ed25519 signature, checks expiration, and returns a `LicenseStatus`. Signed payloads may contain extra feature keys so older verifiers can still parse newer tokens structurally; helper reads still deny those unknown keys by default.

Feature reads are catalog-gated. `isFeatureEnabled(license, feature)` returns `true` only when `feature` is a known boolean feature in `LICENSED_FEATURES` and the signed payload value is exactly `true`. `getFeatureLimit(license, feature)` returns a number only when `feature` is a known numeric feature and the signed payload value is a non-negative integer. Unknown feature keys and value-kind mismatches deny by default.

`LICENSED_FEATURES` is re-exported from the internal `@cpki/license-catalog`
projection used at build time. The verifier should not define a separate
feature catalog.

`createLicenseChecker(token?)` verifies once, caches the signed payload, and re-evaluates expiration on each `getStatus()` call. `checkFeature(feature)` uses the same catalog-gated boolean feature behavior as `isFeatureEnabled`.

### Organization-entitlement merge

`createLicenseChecker(token?)` returns a `LicenseChecker` whose
`withOrganizationEntitlement(org)` derives a **non-mutating** `EntitlementReader`
that merges a parsed `OrganizationEntitlement` overlay with the deployment base:

- `reader.checkFeature(feature)` — boolean **OR**: granted if the deployment
  (grace-respecting; expired-but-in-grace contributes nothing) OR the active org
  grants it. An inactive org, or an active org with an empty `features` map,
  contributes nothing.
- `reader.getFeatureLimit(feature)` — numeric **most-generous**: `0` means
  unlimited and wins over any finite value; otherwise the larger present value
  wins; `null` only when neither side is present.

The reader is fresh per call, never mutates the base payload, and never stores
overlay state on the checker, so a long-lived multi-tenant process can call it
per request with a different org without leaking entitlements. The reader
deliberately does not expose `getStatus()` — use the base `checker.getStatus()`
for deployment diagnostics. Feed `withOrganizationEntitlement` an
already-`parseOrganizationEntitlement`'d value; overlay values are catalog-gated
the same way as the base, so unknown ids and value-kind mismatches are ignored.

## Online Key Attestation

The package does not export a network client for online verification. Hosts that fetch signing keys from an online endpoint should validate that response outside this package, then call `addRuntimeKeyAttestation({ keyId, publicKey, attestationSig })`. The attestation signature must be over `keyId:publicKey` and signed by the master key baked into the package.

## License

MIT — see [LICENSE](./LICENSE).
