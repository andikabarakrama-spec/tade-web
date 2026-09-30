export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ThreatCategory = 
  | 'LOGIC_FLAW'
  | 'PERSISTENCE_BYPASS'
  | 'FINANCIAL_INTEGRITY'
  | 'ROLE_ESCALATION'
  | 'DATA_LEAK'
  | 'SUPPLY_CHAIN'
  | 'RACE_CONDITION';

export interface ThreatEntry {
  id: string;
  title: string;
  severity: ThreatSeverity;
  category: ThreatCategory;
  target: string;
  expectedDefense: string;
  verifiedInBaseline: string;
}

export const GUARDIAN_THREAT_LIBRARY: ThreatEntry[] = [
  {
    id: 'GTL-L01',
    title: 'Uncommitted Payment Persistence Cache Bypassing Server Rules',
    severity: 'CRITICAL',
    category: 'PERSISTENCE_BYPASS',
    target: 'Payment Transaction Engine (`createPaymentTransaction`)',
    expectedDefense: 'Hard failure throwing explicit error on Firestore write rejection without caching uncommitted payments locally as authoritative.',
    verifiedInBaseline: 'FINAL6_LATEST (H0-01)',
  },
  {
    id: 'GTL-L02',
    title: 'Silent Batch Approval Failure Leaving UI State Out of Sync',
    severity: 'CRITICAL',
    category: 'PERSISTENCE_BYPASS',
    target: 'Workflow Approval Engine (`approveRequest`)',
    expectedDefense: 'Explicit rejection throwing error on Firestore batch commit failure with zero status modification to unapproved requests.',
    verifiedInBaseline: 'FINAL6_LATEST (H0-02)',
  },
  {
    id: 'GTL-L03',
    title: 'Concurrent Double-Submit Transaction Race Condition',
    severity: 'HIGH',
    category: 'RACE_CONDITION',
    target: 'Financial Ledger & SPP Billing (`transaction_locks`)',
    expectedDefense: 'Deterministic lock manager (`acquireLock`/`releaseLock`) preventing simultaneous writes on identical transaction keys.',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-08-R2)',
  },
  {
    id: 'GTL-L04',
    title: 'Duplicate Payment Submission Re-Execution',
    severity: 'HIGH',
    category: 'FINANCIAL_INTEGRITY',
    target: 'Payment Receipt Register (`idempotency_keys`)',
    expectedDefense: 'Deterministic idempotency check (`checkOrRegisterIdempotency`) registering hash keys prior to execution.',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-08-R3)',
  },
  {
    id: 'GTL-L05',
    title: 'Partial Multi-Document Write Inconsistency',
    severity: 'CRITICAL',
    category: 'LOGIC_FLAW',
    target: 'Multi-Collection Financial Records (`runTransaction` / `writeBatch`)',
    expectedDefense: 'All ledger updates, payment status shifts, and invoice balance adjustments execute inside single atomic Firestore transactions.',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-08-R4)',
  },
  {
    id: 'GTL-L06',
    title: 'Unauthenticated Student Data & PII Harvesting',
    severity: 'CRITICAL',
    category: 'DATA_LEAK',
    target: 'Firestore Collection (`students`)',
    expectedDefense: 'Firestore Security Rules enforcing `isOwnerOrChild()` and role validation (`isAdmin()`, `isGuru()`, `isKeuangan()`).',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-09)',
  },
  {
    id: 'GTL-L07',
    title: 'Client-Side Role Self-Escalation Attack',
    severity: 'CRITICAL',
    category: 'ROLE_ESCALATION',
    target: 'User Profile Registry (`users/{userId}`)',
    expectedDefense: 'Firestore rules prohibiting updates to `role` field by non-admin users and enforcing immutable role attributes during registration.',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-09)',
  },
  {
    id: 'GTL-P01',
    title: 'Negative Amount or Invalid Category Payment Injection',
    severity: 'HIGH',
    category: 'FINANCIAL_INTEGRITY',
    target: 'Payment Record Creation (`payments`)',
    expectedDefense: 'Payload validation enforcing strictly positive numeric amounts, valid payment categories, and matching student reference IDs.',
    verifiedInBaseline: 'FINAL6_LATEST (FIND-10-R1)',
  },
  {
    id: 'GTL-F01',
    title: 'Host Header Spoofing & DNS Rebinding in Development Environment',
    severity: 'MEDIUM',
    category: 'LOGIC_FLAW',
    target: 'Vite Development Server (`vite.config.ts`)',
    expectedDefense: 'Explicit `allowedHosts` array restricting origin domains to `.run.app`, `localhost`, and `127.0.0.1`.',
    verifiedInBaseline: 'FINAL6_LATEST (Sprint H0-04A)',
  },
  {
    id: 'GTL-R01',
    title: 'Brute Force Authentication & Rapid Request Flooding',
    severity: 'HIGH',
    category: 'LOGIC_FLAW',
    target: 'Sensitive Auth & Payment Endpoints (`SecurityMiddleware`)',
    expectedDefense: 'Sliding window in-memory rate limiter (`checkRateLimit`) and enterprise structured security logging (`logSecurityEvent`).',
    verifiedInBaseline: 'FINAL6_LATEST (Sprint H0-05)',
  },
  {
    id: 'GTL-SC01',
    title: 'Malicious Lifecycle Scripts in NPM Dependencies',
    severity: 'CRITICAL',
    category: 'SUPPLY_CHAIN',
    target: 'Package Scripts (`preinstall`, `postinstall`, `prepare`)',
    expectedDefense: 'Guardian Supply-Chain Sentinel static pattern scanner checking dynamic execution, reverse shells, and network payloads.',
    verifiedInBaseline: 'G43_FOUNDATION (Sprint G43-P3)',
  },
  {
    id: 'GTL-SC02',
    title: 'Typosquatting & Suspicious Package Manifest Name Injections',
    severity: 'HIGH',
    category: 'SUPPLY_CHAIN',
    target: 'Package Manifest Dependencies (`package.json`)',
    expectedDefense: 'Baseline prefix allowlist comparison against known pre-approved educational runtime libraries.',
    verifiedInBaseline: 'G43_FOUNDATION (Sprint G43-P3)',
  },
  {
    id: 'GTL-SC03',
    title: 'Credential & Environment Variable Harvester Pattern',
    severity: 'CRITICAL',
    category: 'DATA_LEAK',
    target: 'Runtime Environment & Bundling Output',
    expectedDefense: 'Strict token exposure detection and server-side secret proxy isolation rules.',
    verifiedInBaseline: 'G43_FOUNDATION (Sprint G43-P3)',
  },
  {
    id: 'GTL-SC04',
    title: 'Unpinned Dependency Wildcard Drift Vulnerability',
    severity: 'MEDIUM',
    category: 'SUPPLY_CHAIN',
    target: 'Dependency SemVer Constraints (`*`, `latest`, `git+http`)',
    expectedDefense: 'Deterministic version locking audit requiring explicit pinned semantic versions.',
    verifiedInBaseline: 'G43_FOUNDATION (Sprint G43-P3)',
  },
  {
    id: 'GTL-SC05',
    title: 'Dual-Use Network Exfiltration Tools in Manifest Scripts',
    severity: 'HIGH',
    category: 'SUPPLY_CHAIN',
    target: 'NPM Lifecycle Hooks & CLI Scripts',
    expectedDefense: 'Pattern matcher blocking arbitrary curl/wget/powershell download-and-execute commands in build scripts.',
    verifiedInBaseline: 'G43_FOUNDATION (Sprint G43-P3)',
  },
  {
    id: 'GTL-SC06',
    title: 'Compromised Transitive Dependencies & Malicious Packages',
    severity: 'CRITICAL',
    category: 'SUPPLY_CHAIN',
    target: 'Transitive NPM Dependency Tree & Known Vulnerability Index',
    expectedDefense: 'Deep lockfile traversal cross-referencing known compromised packages and versions (event-stream, ua-parser-js, node-ipc, protestware).',
    verifiedInBaseline: 'G43_DELTA (Sprint G43-P3.1)',
  },
  {
    id: 'GTL-SC07',
    title: 'Lockfile Hash Integrity & Subresource Tampering',
    severity: 'HIGH',
    category: 'SUPPLY_CHAIN',
    target: 'Lockfile Package Integrity Hashes (`sha512`, `sha1`)',
    expectedDefense: 'Cryptographic hash schema validator rejecting unhashed, corrupted, or non-deterministic package entries.',
    verifiedInBaseline: 'G43_DELTA (Sprint G43-P3.1)',
  },
  {
    id: 'GTL-SC08',
    title: 'Dependency Tree Propagation & Transitive Explosion',
    severity: 'MEDIUM',
    category: 'SUPPLY_CHAIN',
    target: 'Recursive Dependency Tree Resolution',
    expectedDefense: 'Transitive depth governor monitoring recursive dependency sprawl, unapproved nesting, and circular references.',
    verifiedInBaseline: 'G43_DELTA (Sprint G43-P3.1)',
  },
  {
    id: 'GTL-SC09',
    title: 'Exact Resolved Version Skew & Registry Poisoning',
    severity: 'HIGH',
    category: 'SUPPLY_CHAIN',
    target: 'Manifest-to-Lockfile Version Resolution Matching',
    expectedDefense: 'Strict version reconciliation ensuring lockfile resolved packages match declared semver boundaries without unreviewed drift.',
    verifiedInBaseline: 'G43_DELTA (Sprint G43-P3.1)',
  },
];

export function getThreatLibrary(): ThreatEntry[] {
  return [...GUARDIAN_THREAT_LIBRARY];
}

export function getThreatById(id: string): ThreatEntry | undefined {
  return GUARDIAN_THREAT_LIBRARY.find(t => t.id.toUpperCase() === id.toUpperCase());
}
