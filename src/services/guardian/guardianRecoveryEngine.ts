export type RecoveryCodeStatus = 'AVAILABLE' | 'USED';

export interface RecoveryCode {
  id: string;
  codeHash: string;
  status: RecoveryCodeStatus;
  createdAt: string;
  usedAt?: string;
}

export interface RecoveryVaultMetadata {
  recoveryId: string;
  status: 'ACTIVE' | 'EXHAUSTED' | 'REVOKED';
  totalCodes: number;
  availableCount: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
  actorUid: string;
  deviceInfo?: {
    userAgent?: string;
    ipAddress?: string;
    platform?: string;
  };
}

export interface GeneratedRecoverySet {
  vaultMetadata: RecoveryVaultMetadata;
  hashedCodes: RecoveryCode[];
  plainTextCodesForEnvelope: string[]; // Output ONCE for printing/envelope generation only
}

/**
 * Simple deterministic SHA-256 style helper for local code hashing.
 */
export async function hashRecoveryCode(code: string): Promise<string> {
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const msgUint8 = new TextEncoder().encode(`GER_SALT_V1_${normalized}`);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple hash for non-subtle environments
  let hash = 0;
  for (let i = 0; i < msgUint8.length; i++) {
    hash = ((hash << 5) - hash) + msgUint8[i];
    hash |= 0;
  }
  return `GER_FALLBACK_HASH_${Math.abs(hash).toString(16)}`;
}

/**
 * Generates a set of 10 One-Time Emergency Recovery Codes.
 * Plaintext codes are returned ONLY in plainTextCodesForEnvelope for immediate printing / envelope creation.
 * Plaintext codes MUST NEVER be stored in state or database after generation.
 */
export async function generateRecoverySet(
  actorUid: string,
  deviceInfo?: RecoveryVaultMetadata['deviceInfo']
): Promise<GeneratedRecoverySet> {
  const recoveryId = `GER_VAULT_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const now = new Date().toISOString();
  
  const plainTextCodesForEnvelope: string[] = [];
  const hashedCodes: RecoveryCode[] = [];

  for (let i = 1; i <= 10; i++) {
    // Generate 12-char alphanumeric code grouped as XXXX-XXXX-XXXX
    const rawPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const rawPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const rawPart3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const formattedCode = `${rawPart1}-${rawPart2}-${rawPart3}`;
    
    plainTextCodesForEnvelope.push(formattedCode);

    const codeHash = await hashRecoveryCode(formattedCode);
    hashedCodes.push({
      id: `${recoveryId}_CODE_${i.toString().padStart(2, '0')}`,
      codeHash,
      status: 'AVAILABLE',
      createdAt: now,
    });
  }

  const vaultMetadata: RecoveryVaultMetadata = {
    recoveryId,
    status: 'ACTIVE',
    totalCodes: 10,
    availableCount: 10,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
    actorUid,
    deviceInfo,
  };

  return {
    vaultMetadata,
    hashedCodes,
    plainTextCodesForEnvelope,
  };
}

/**
 * Verifies and consumes a recovery code against hashed vault codes.
 * Returns updated code list and metadata.
 * Permanently sets consumed code status to 'USED'.
 */
export async function consumeRecoveryCode(
  rawInputCode: string,
  currentVault: RecoveryVaultMetadata,
  currentHashedCodes: RecoveryCode[],
  actorUid: string
): Promise<{ success: boolean; message: string; updatedVault?: RecoveryVaultMetadata; updatedCodes?: RecoveryCode[] }> {
  if (currentVault.status !== 'ACTIVE') {
    return { success: false, message: 'Recovery vault is inactive or exhausted.' };
  }

  const inputHash = await hashRecoveryCode(rawInputCode);
  const targetCodeIndex = currentHashedCodes.findIndex(
    c => c.codeHash === inputHash && c.status === 'AVAILABLE'
  );

  if (targetCodeIndex === -1) {
    return { success: false, message: 'Invalid or previously used recovery code.' };
  }

  const now = new Date().toISOString();
  const updatedCodes = [...currentHashedCodes];
  updatedCodes[targetCodeIndex] = {
    ...updatedCodes[targetCodeIndex],
    status: 'USED',
    usedAt: now,
  };

  const availableCount = updatedCodes.filter(c => c.status === 'AVAILABLE').length;
  const usedCount = updatedCodes.filter(c => c.status === 'USED').length;

  const updatedVault: RecoveryVaultMetadata = {
    ...currentVault,
    availableCount,
    usedCount,
    status: availableCount === 0 ? 'EXHAUSTED' : 'ACTIVE',
    updatedAt: now,
    actorUid,
  };

  return {
    success: true,
    message: 'Recovery code verified and consumed successfully.',
    updatedVault,
    updatedCodes,
  };
}
