import { ConstitutionArticle, CompiledValidationRule, ConstitutionDiffItem } from './guardianTypes';

export const CONSTITUTION_ARTICLES_V7: ConstitutionArticle[] = [
  {
    articleId: 'ART-001',
    title: 'Sovereignty & Kernel Isolation (Ring-0)',
    clauseNumber: '1.1',
    clauseText: 'Sistem TADE beroperasi di bawah mandat kedaulatan digital mutlak. Kernel Ring-0 tidak boleh diintervensi oleh modul unprivileged.',
    rationale: 'Menjamin proteksi hak asuh data dan stabilitas fondasi ekosistem pendidikan TK Asy Syifa.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-002',
    title: 'Zero Client Secret Exposure',
    clauseNumber: '1.4',
    clauseText: 'Seluruh kredensial rahasia, master keys, dan token API dilarang keras bocor ke bundle client-side peramban.',
    rationale: 'Mencegah eksploitasi API key dan kebocoran akses kredensial.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-003',
    title: 'Role-Based Access Control (7-Role Isolation)',
    clauseNumber: '2.1',
    clauseText: 'Pemisahan 7 peran secara deterministik. Setiap mutasi tingkat tinggi membutuhkan hak akses eksplisit.',
    rationale: 'Mencegah eskalasi hak istimewa di luar wewenang struktural lembaga.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-004',
    title: 'Hermes Confinement & Dormant State',
    clauseNumber: '3.2',
    clauseText: 'Agen otonom Hermes wajib berada dalam status DORMANT_SAFE pada environment operasional sampai verifikasi Founder.',
    rationale: 'Menjaga kepatuhan keselamatan AI tingkat tinggi dan pencegahan mutasi tanpa pengawasan.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-005',
    title: 'Five-Phase Atomic Disaster Recovery',
    clauseNumber: '4.2',
    clauseText: 'Pemulihan data wajib melalui 5 tahapan atomik: RELOAD -> PRE-VERIFY -> REPLAY -> POST-VERIFY -> COMPLETE.',
    rationale: 'Menjamin zero duplicate execution dan konsistensi status data.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-006',
    title: 'Offline Idempotency & Conflict Quarantine',
    clauseNumber: '5.1',
    clauseText: 'Setiap operasi antrean offline wajib memiliki fingerprint kriptografis SHA-256 dan dilarang auto-merge buta.',
    rationale: 'Mencegah duplikasi data absensi/spp dan melindungi keaslian raport.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  },
  {
    articleId: 'ART-007',
    title: 'Single Source of Truth Mandate',
    clauseNumber: '6.1',
    clauseText: 'Seluruh transaksi data wajib bermuara pada src/services/db.ts sebagai SSoT sentral.',
    rationale: 'Mencegah disparitas state antar komponen frontend.',
    version: '7.0.0',
    status: 'RATIFIED',
    lastUpdated: '2026-08-18'
  }
];

export const CONSTITUTION_PREVIOUS_V6: ConstitutionArticle[] = [
  {
    articleId: 'ART-001',
    title: 'Sovereignty & Kernel Isolation (Ring-0)',
    clauseNumber: '1.1',
    clauseText: 'Sistem TADE beroperasi di bawah mandat kedaulatan digital. Kernel Ring-0 diisolasi.',
    rationale: 'Stabilitas fondasi.',
    version: '6.9.0',
    status: 'AMENDED',
    lastUpdated: '2026-08-10'
  },
  {
    articleId: 'ART-002',
    title: 'Client Secret Protection',
    clauseNumber: '1.4',
    clauseText: 'Kredensial rahasia dijaga di backend.',
    rationale: 'Mencegah kebocoran.',
    version: '6.9.0',
    status: 'AMENDED',
    lastUpdated: '2026-08-10'
  },
  {
    articleId: 'ART-003',
    title: 'Role-Based Access Control',
    clauseNumber: '2.1',
    clauseText: 'Pemisahan 7 peran pengguna.',
    rationale: 'Pemisahan hak akses.',
    version: '6.9.0',
    status: 'AMENDED',
    lastUpdated: '2026-08-10'
  },
  {
    articleId: 'ART-004',
    title: 'Hermes Confinement',
    clauseNumber: '3.2',
    clauseText: 'Agen Hermes dalam status Dormant.',
    rationale: 'Keselamatan AI.',
    version: '6.9.0',
    status: 'AMENDED',
    lastUpdated: '2026-08-10'
  }
];

/**
 * R743 — Constitution Compiler
 * Compiles Constitution legal clauses into executable runtime validator rules.
 */
class ConstitutionCompiler {
  private static instance: ConstitutionCompiler;

  private constructor() {}

  public static getInstance(): ConstitutionCompiler {
    if (!ConstitutionCompiler.instance) {
      ConstitutionCompiler.instance = new ConstitutionCompiler();
    }
    return ConstitutionCompiler.instance;
  }

  public getArticles(): ConstitutionArticle[] {
    return [...CONSTITUTION_ARTICLES_V7];
  }

  /**
   * Compile Constitution articles into machine-executable validation rules.
   */
  public compileConstitution(): {
    compiledRules: CompiledValidationRule[];
    compiledAt: string;
    totalArticles: number;
    compilationHash: string;
    compilerVersion: string;
  } {
    const articles = this.getArticles();
    const compiledRules: CompiledValidationRule[] = articles.map(art => {
      let targetTarget = 'Universal.Guard';
      let validatorCode = 'return true;';
      let category = 'GOVERNANCE' as any;

      if (art.articleId === 'ART-001') {
        targetTarget = 'Guardian.Ring0';
        validatorCode = 'if (ctx.ringLevel > 0 && ctx.modifiesKernel) throw new SecurityError("Ring-0 breach");';
        category = 'SECURITY';
      } else if (art.articleId === 'ART-002') {
        targetTarget = 'Build.SecretScan';
        validatorCode = 'if (ctx.bundle.hasRawApiKey) throw new BuildError("Client secret exposed");';
        category = 'SECURITY';
      } else if (art.articleId === 'ART-003') {
        targetTarget = 'RBAC.Authorization';
        validatorCode = 'if (!ctx.user.roles.includes(ctx.requiredRole)) throw new AuthError("Forbidden");';
        category = 'RBAC';
      } else if (art.articleId === 'ART-004') {
        targetTarget = 'Hermes.ControlPlane';
        validatorCode = 'if (ctx.hermesMode !== "DORMANT_SAFE" && !ctx.founderAuth) throw new AIError("Unauthorized activation");';
        category = 'INTELLIGENCE';
      } else if (art.articleId === 'ART-005') {
        targetTarget = 'Recovery.FivePhase';
        validatorCode = 'if (ctx.phases.length !== 5) throw new RecoveryError("Non-atomic recovery");';
        category = 'RECOVERY';
      } else if (art.articleId === 'ART-006') {
        targetTarget = 'Offline.Queue';
        validatorCode = 'if (!ctx.op.fingerprint || ctx.blindMerge) throw new OfflineError("Collision violation");';
        category = 'OFFLINE';
      } else if (art.articleId === 'ART-007') {
        targetTarget = 'SSoT.DbService';
        validatorCode = 'if (ctx.service !== "DataService") throw new SSoTError("Rogue mutation detected");';
        category = 'GOVERNANCE';
      }

      const raw = `${art.articleId}:${art.version}:${validatorCode}`;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) hash = ((hash << 5) - hash) + raw.charCodeAt(i);

      return {
        ruleId: `CRULE-${art.articleId}`,
        sourcePolicyId: `POL-${category.substring(0, 3)}-${art.clauseNumber.replace('.', '')}`,
        category,
        targetTarget,
        validatorCode,
        isActive: true,
        compiledAt: new Date().toISOString(),
        checksum: `0x${Math.abs(hash).toString(16).padStart(8, '0')}`
      };
    });

    return {
      compiledRules,
      compiledAt: new Date().toISOString(),
      totalArticles: articles.length,
      compilationHash: '0x7C91B4F81A90E2D4',
      compilerVersion: 'v7.0-RC92-COMPILER'
    };
  }

  /**
   * Compare V7 vs V6 Constitution revisions (R748 Constitution Diff).
   */
  public computeDiff(): ConstitutionDiffItem[] {
    const diffs: ConstitutionDiffItem[] = [];
    const v6Map = new Map(CONSTITUTION_PREVIOUS_V6.map(a => [a.articleId, a]));
    const v7Map = new Map(CONSTITUTION_ARTICLES_V7.map(a => [a.articleId, a]));

    for (const [id, v7] of v7Map.entries()) {
      const v6 = v6Map.get(id);
      if (!v6) {
        diffs.push({
          articleId: id,
          type: 'ADDED',
          newText: v7.clauseText,
          diffSummary: `Added new ratified Article ${v7.clauseNumber} (${v7.title}).`
        });
      } else if (v6.clauseText !== v7.clauseText || v6.status !== v7.status) {
        diffs.push({
          articleId: id,
          type: 'CHANGED',
          oldText: v6.clauseText,
          newText: v7.clauseText,
          diffSummary: `Amended and strengthened legal wording in Clause ${v7.clauseNumber}.`
        });
      } else {
        diffs.push({
          articleId: id,
          type: 'UNCHANGED',
          oldText: v6.clauseText,
          newText: v7.clauseText,
          diffSummary: 'No modifications to clause text.'
        });
      }
    }

    for (const [id, v6] of v6Map.entries()) {
      if (!v7Map.has(id)) {
        diffs.push({
          articleId: id,
          type: 'REMOVED',
          oldText: v6.clauseText,
          diffSummary: `Article ${v6.clauseNumber} removed from active codification.`
        });
      }
    }

    return diffs;
  }
}

export const constitutionCompiler = ConstitutionCompiler.getInstance();
