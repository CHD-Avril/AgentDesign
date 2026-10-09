import { z } from "zod";

//#region src/types.d.ts
interface LicenseOwner {
  /** Canonical organization identifier embedded in the signed payload. */
  org_id: string;
  org_name: string;
  contact_email: string;
}
interface LicenseFeatures {
  "threads.retention_hours"?: number;
  "threads.max_count"?: number;
  "sdk.angular"?: boolean;
  msteams?: boolean;
  [key: string]: boolean | number | undefined;
}
type LicenseTier = "free" | "developer" | "pro" | "team" | "team_self_hosted" | "enterprise";
interface LicensePayload {
  version: number;
  license_id: string;
  key_id: string;
  /**
   * Per-license analytics correlation ID. Runtime emitters (e.g., Scarf) tag
   * outbound events with this value so inbound analytics can be reverse-looked-up
   * to the HubSpot Contact that issued the license.
   */
  telemetry_id: string;
  owner: LicenseOwner;
  issued_at: string;
  expires_at: string;
  tier: LicenseTier;
  catalog_version?: string;
  plan_code?: LicenseTier;
  entitlement_source?: "enterprise_override" | "clerk_subscription" | "clerk_free_default";
  issuer?: string | null;
  supersedes_license_id?: string | null;
  replacement_reason?: string | null;
  seat_limit: number;
  features: LicenseFeatures;
  remove_branding: boolean;
}
interface LicenseStatus {
  valid: boolean;
  license: LicensePayload | null;
  error: "invalid_signature" | "expired" | "unknown_key" | "parse_error" | "key_mismatch" | null;
  graceRemaining?: number;
  warningSeverity: "none" | "info" | "warning" | "critical";
} //#endregion
//#region src/verify.d.ts

//# sourceMappingURL=types.d.ts.map
/**
 * Verify a license token offline using Ed25519 signature.
 * This is a pure function — no caching. Callers should cache the result.
 */
declare function verifyLicense(token: string): LicenseStatus;
/**
 * Check whether a catalog-boolean feature is enabled in a raw features map.
 * Returns false when the feature is unknown, missing, the catalog says the
 * feature is not boolean-valued, or the value is not exactly `true`.
 *
 * @param features - Raw feature map (license payload features or org overlay).
 * @param feature - Candidate feature key.
 * @returns Whether the feature is granted.
 */

/**
 * Check whether a specific feature is enabled in the license.
 * Returns false if the license is null, the feature is unknown, the feature is
 * missing, or the catalog says the feature is not boolean-valued.
 */
declare function isFeatureEnabled(license: LicensePayload | null, feature: string): boolean;
/**
 * Get a numeric feature limit from the license.
 * Returns null if the license is null, the feature is unknown, the feature is
 * missing, or the catalog says the feature is not number-valued.
 */
declare function getFeatureLimit(license: LicensePayload | null, feature: string): number | null; //#endregion
//#region src/keystore.d.ts

//# sourceMappingURL=verify.d.ts.map
/**
 * Master public key — root of trust.
 * Baked in at build time via tsdown `env` (replaces process.env.BAKED_MASTER_PUBLIC_KEY).
 * Not overridable at runtime — this is the root of the trust chain.
 */
declare function getMasterPublicKey(): string | null;
/**
 * Get a public key by key ID.
 * Baked keys take precedence because runtime attestations must not override
 * key IDs compiled into this package.
 */
declare function getPublicKey(keyId: string): string | null;
/**
 * Add a runtime key only after validating its master-key attestation.
 *
 * @param attestation - New key material plus a master-key signature.
 * @returns True when the runtime key was accepted.
 */
declare function addRuntimeKeyAttestation(attestation: KeyAttestationData): boolean;
/** Remove all runtime keys from the in-memory registry. */
declare function clearRuntimeKeys(): void;
interface KeyAttestationData {
  keyId: string;
  publicKey: string;
  attestationSig: string;
}
/**
 * Verify a key attestation against the master public key.
 * The attestation is a signature of `keyId:publicKey` by the master key.
 */
declare function verifyKeyAttestation(attestation: KeyAttestationData): boolean;

//#endregion
//#region ../../libs/license-catalog/src/index.d.ts
//# sourceMappingURL=keystore.d.ts.map
declare const FEATURE_IDS: readonly ["threads.retention_hours", "threads.max_count", "multimodal_storage_gb", "sdk.angular", "deployment_via_helm_chart", "analytics", "self_learning", "msteams"];
type FeatureId = (typeof FEATURE_IDS)[number];
/**
 * Entitlement claim value embedded in license snapshots.
 *
 * Numeric limits use `0` for unlimited.
 */

type FeatureValueKind = 'boolean' | 'number';
interface FeatureDefinition {
  /** Stable feature id embedded in license feature snapshots. */
  readonly id: FeatureId;
  /** Human-readable feature name for admin/runtime UI. */
  readonly displayName: string;
  /** Expected JSON value type for this feature claim. */
  readonly valueKind: FeatureValueKind;
  /** Whether the feature controls client component availability. */
  readonly component: boolean;
  /** Whether the feature controls runtime/server behavior. */
  readonly runtime: boolean;
}
declare const LICENSED_FEATURES: Readonly<Record<FeatureId, FeatureDefinition>>;
/**
 * Resolve a feature's display name from the shared catalog.
 *
 * @param feature - Candidate feature key.
 * @returns Catalog display name, or the original key when unknown.
 */
declare function getFeatureDisplayName(feature: string): string;
/**
 * Return true when the feature controls client component availability.
 *
 * @param feature - Candidate feature key.
 * @returns Whether the feature is component-scoped.
 */
declare function isComponentFeature(feature: string): boolean;
/**
 * Return true when the feature controls runtime/server behavior.
 *
 * @param feature - Candidate feature key.
 * @returns Whether the feature is runtime-scoped.
 */
declare function isRuntimeFeature(feature: string): boolean;

//#endregion
//#region src/organization-entitlement.d.ts
/**
 * Resolve a feature definition by id.
 *
 * @param feature - Candidate feature key.
 * @returns Feature definition, or null when unknown.
 */
/**
 * Wire contract for an organization's effective entitlement as consumed by the
 * runtime feature checker. This is the published wire DTO for the
 * `@copilotkit/runtime` consumer (Layer 3, in the CopilotKit OSS repo —
 * intentionally NOT this monorepo's `@copilotkit/runtime-enterprise`); the
 * app-api `/api/entitlements/runtime` producer projects its internal
 * `@cpki/ops-contracts` DTO onto this shape and re-validates against it (the
 * shapes are duplicated in spirit, not a single shared definition). `active`
 * means the org has a resolved, non-blocked entitlement; `features` is the
 * catalog-keyed feature snapshot (the OR side of the runtime merge). For
 * inactive entitlements `features` is empty.
 *
 * `planCode` and `source` are opaque, catalog/ops-defined tokens carried for
 * diagnostics; they are deliberately typed as free strings (not closed enums)
 * because this published package must not import the internal catalog, so a
 * Layer 3 consumer must not assume an exhaustive set.
 *
 * NOTE: `features` is intentionally catalog-AGNOSTIC here (no
 * `getFeatureDefinition` check) — this published package must not depend on the
 * internal `@cpki/license-catalog`. Catalog validation (unknown ids, value-kind)
 * happens upstream in ops-api / `@cpki/ops-contracts`; this schema only enforces
 * the structural shape.
 */
declare const organizationEntitlementSchema: z.ZodObject<{
  active: z.ZodBoolean;
  features: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodBoolean, z.ZodNumber]>>;
  planCode: z.ZodOptional<z.ZodString>;
  source: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/** Organization entitlement wire DTO. */
type OrganizationEntitlement = z.infer<typeof organizationEntitlementSchema>;
/**
 * Parse and return a validated organization entitlement.
 *
 * @param value - Unknown payload (e.g. an app-api response body).
 * @returns The validated organization entitlement.
 */
declare function parseOrganizationEntitlement(value: unknown): OrganizationEntitlement;

//#endregion
//#region src/license-check.d.ts
//# sourceMappingURL=organization-entitlement.d.ts.map
/**
 * Merged (base deployment + organization overlay) feature reader.
 *
 * Deliberately does NOT expose `getStatus()`: deployment validity is unrelated
 * to the merged feature view (a hosted-no-token base is `valid: false` while an
 * active overlay still grants features), so a reader `getStatus()` would invite
 * wrongly gating out an active org. Consumers needing deployment diagnostics use
 * the base `checker.getStatus()`.
 */
interface EntitlementReader {
  /** Whether the feature is granted by the deployment OR the organization. */
  checkFeature(feature: string): boolean;
  /** Most-generous numeric limit across deployment and organization; `0` = unlimited. */
  getFeatureLimit(feature: string): number | null;
}
/**
 * Runtime-agnostic license checker that caches verification results
 * and re-evaluates expiration on each access for long-lived processes.
 */
interface LicenseChecker {
  /** Get the current license status, re-evaluating expiration. */
  getStatus(): LicenseStatus;
  /** Check whether a specific feature is enabled by a valid, non-expired license. */
  checkFeature(feature: string): boolean;
  /**
   * Derive a non-mutating reader that merges an organization entitlement with
   * the deployment base. Fresh per call; never mutates the base payload or the
   * shared checker. Safe to call per request with a different org.
   */
  withOrganizationEntitlement(org: OrganizationEntitlement): EntitlementReader;
}
/**
 * Create a license checker that verifies the token once at construction
 * and re-evaluates expiration on each `getStatus()` call.
 *
 * When no token is provided, falls back to `COPILOTKIT_LICENSE_TOKEN` env var.
 * Missing/invalid tokens never enable features; product surfaces own warnings
 * and enforcement decisions outside this package.
 */
declare function createLicenseChecker(licenseToken?: string): LicenseChecker;

//#endregion
//# sourceMappingURL=license-check.d.ts.map

export { EntitlementReader, KeyAttestationData, LICENSED_FEATURES, LicenseChecker, LicenseFeatures, LicenseOwner, LicensePayload, LicenseStatus, LicenseTier, OrganizationEntitlement, addRuntimeKeyAttestation, clearRuntimeKeys, createLicenseChecker, getFeatureDisplayName, getFeatureLimit, getMasterPublicKey, getPublicKey, isComponentFeature, isFeatureEnabled, isRuntimeFeature, organizationEntitlementSchema, parseOrganizationEntitlement, verifyKeyAttestation, verifyLicense };
//# sourceMappingURL=index.d.ts.map