/**
 * TADE RC92 — Guardian Policy Engine & Constitution Compiler Types
 * Definition of types, models, and interfaces for living policies,
 * rule compilation, build gate verification, exception journal, and simulator.
 */

export type PolicyCategory = 
  | 'SECURITY' 
  | 'RBAC' 
  | 'RECOVERY' 
  | 'OFFLINE' 
  | 'INTELLIGENCE' 
  | 'GOVERNANCE';

export type PolicySeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'BLOCKING';

export type EvaluationOutcome = 'PASS' | 'WARNING' | 'BLOCKED';

export type PolicyStatus = 'ACTIVE' | 'ENFORCING' | 'AUDIT_ONLY' | 'DEPRECATED';

export interface GuardianPolicy {
  policyId: string; // e.g. POL-SEC-001
  code: string;
  name: string;
  category: PolicyCategory;
  severity: PolicySeverity;
  status: PolicyStatus;
  description: string;
  constitutionArticleRef: string; // e.g. "Constitution Art. 1.2"
  enforcementScope: 'BUILD' | 'RUNTIME' | 'GATEWAY' | 'UNIVERSAL';
  ruleExpression: string;
  parameters?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface PolicyEvaluationResult {
  policyId: string;
  policyName: string;
  category: PolicyCategory;
  outcome: EvaluationOutcome;
  severity: PolicySeverity;
  score: number; // 0 - 100
  details: string;
  violationCount: number;
  evaluatedAt: string;
  contextData?: Record<string, any>;
}

export interface CompiledValidationRule {
  ruleId: string;
  sourcePolicyId: string;
  category: PolicyCategory;
  targetTarget: string; // e.g. "DataService.write", "Route.guard", "RBAC.token"
  validatorCode: string;
  isActive: boolean;
  compiledAt: string;
  checksum: string;
}

export interface BuildGateCheckItem {
  gateId: string;
  name: string;
  domain: 'RBAC' | 'GUARDIAN' | 'SSOT' | 'CONTRACT' | 'RECOVERY';
  status: 'PASSED' | 'WARNING' | 'BLOCKED';
  mandatory: boolean;
  score: number;
  message: string;
  technicalDetails?: string;
}

export interface BuildGateReport {
  gateExecutionId: string;
  timestamp: string;
  targetVersion: string;
  passed: boolean;
  canDeploy: boolean;
  overallScore: number;
  totalChecks: number;
  passedCount: number;
  warningCount: number;
  blockedCount: number;
  checks: BuildGateCheckItem[];
  blockReasons: string[];
}

export interface GuardianExceptionEntry {
  exceptionId: string;
  policyId: string;
  policyName: string;
  category: PolicyCategory;
  severity: PolicySeverity;
  timestamp: string;
  actor: string;
  role: string;
  targetEntity?: string;
  details: string;
  hash: string;
  previousHash: string;
  blocked: boolean;
}

export interface PolicySimulationRequest {
  scenarioId: string;
  name: string;
  targetPolicies: string[];
  mockContext: Record<string, any>;
  description: string;
}

export interface PolicySimulationResult {
  scenarioId: string;
  executedAt: string;
  totalEvaluated: number;
  passes: number;
  warnings: number;
  blocks: number;
  predictedImpact: string;
  evaluations: PolicyEvaluationResult[];
}

export interface ConstitutionArticle {
  articleId: string;
  title: string;
  clauseNumber: string;
  clauseText: string;
  rationale: string;
  version: string;
  status: 'RATIFIED' | 'AMENDED' | 'DRAFT';
  lastUpdated: string;
}

export interface ConstitutionDiffItem {
  articleId: string;
  type: 'ADDED' | 'CHANGED' | 'REMOVED' | 'UNCHANGED';
  oldText?: string;
  newText?: string;
  diffSummary: string;
}
