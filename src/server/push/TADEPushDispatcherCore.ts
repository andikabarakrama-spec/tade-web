import {
  ITADEPushDispatcher,
  PushRecipientTarget,
  PushNotificationPayload,
  PushDispatchReport,
  ResolvedDeviceToken,
  PushTokenFailure,
  PushDeliveryStatus,
  PushIdempotencyEntry,
  FCM_INVALID_TOKEN_ERROR_CODES
} from '../../types/pushDispatcherContract';

/**
 * TADE PUSH DISPATCHER CORE (PHASE 3B)
 * 
 * Modular, provider-independent push notification dispatcher engine.
 * Decoupled from specific hosting runtime (Netlify Functions, Cloud Functions, Cloud Run, Node Express).
 * 
 * Architectural Invariants:
 * 1. ZERO Firebase Admin SDK or service account credentials in client bundles.
 * 2. In-app notification in Firestore remains completely preserved even if push fails.
 * 3. Multicast & multi-device enabled tokens per user are resolved and delivered concurrently.
 * 4. Stale/unregistered tokens are marked enabled: false individually without deleting device history.
 * 5. Strict idempotency prevents duplicate push delivery.
 */

export interface IFCMSenderResult {
  token: string;
  success: boolean;
  messageId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface IFCMSender {
  sendToTokens(
    tokens: ResolvedDeviceToken[],
    payload: PushNotificationPayload
  ): Promise<IFCMSenderResult[]>;
}

export interface ITokenRepository {
  resolveEnabledTokens(target: PushRecipientTarget): Promise<ResolvedDeviceToken[]>;
  disableToken(uid: string, tokenId: string, reason: string): Promise<void>;
}

export interface IIdempotencyStore {
  getEntry(idempotencyKey: string): Promise<PushIdempotencyEntry | null>;
  saveEntry(entry: PushIdempotencyEntry): Promise<void>;
}

export interface IAuthValidator {
  validateAuthorization(authHeader?: string, secretHeader?: string): Promise<{ authorized: boolean; callerId?: string; error?: string }>;
}

export class InMemoryIdempotencyStore implements IIdempotencyStore {
  private store = new Map<string, PushIdempotencyEntry>();

  async getEntry(idempotencyKey: string): Promise<PushIdempotencyEntry | null> {
    return this.store.get(idempotencyKey) || null;
  }

  async saveEntry(entry: PushIdempotencyEntry): Promise<void> {
    this.store.set(entry.idempotencyKey, entry);
  }

  clear(): void {
    this.store.clear();
  }
}

export class InMemoryTokenRepository implements ITokenRepository {
  private tokensByUser = new Map<string, ResolvedDeviceToken[]>();

  setTokensForUser(uid: string, tokens: ResolvedDeviceToken[]): void {
    this.tokensByUser.set(uid, [...tokens]);
  }

  async resolveEnabledTokens(target: PushRecipientTarget): Promise<ResolvedDeviceToken[]> {
    const resolved: ResolvedDeviceToken[] = [];
    const uids: string[] = [];

    if (target.userId) {
      uids.push(target.userId);
    }
    if (target.userIds && Array.isArray(target.userIds)) {
      uids.push(...target.userIds);
    }

    const uniqueUids = Array.from(new Set(uids));
    for (const uid of uniqueUids) {
      const userTokens = this.tokensByUser.get(uid) || [];
      for (const t of userTokens) {
        if (target.filterEnabledOnly !== false) {
          if (t.enabled) {
            resolved.push({ ...t });
          }
        } else {
          resolved.push({ ...t });
        }
      }
    }

    return resolved;
  }

  async disableToken(uid: string, tokenId: string, _reason: string): Promise<void> {
    const userTokens = this.tokensByUser.get(uid) || [];
    const targetToken = userTokens.find(t => t.tokenId === tokenId);
    if (targetToken) {
      targetToken.enabled = false;
    }
  }

  getUserTokens(uid: string): ResolvedDeviceToken[] {
    return this.tokensByUser.get(uid) || [];
  }
}

export class MockFCMSender implements IFCMSender {
  private errorSimulator = new Map<string, { code: string; message: string }>();

  simulateTokenError(token: string, code: string, message: string): void {
    this.errorSimulator.set(token, { code, message });
  }

  clearSimulatedErrors(): void {
    this.errorSimulator.clear();
  }

  async sendToTokens(
    tokens: ResolvedDeviceToken[],
    _payload: PushNotificationPayload
  ): Promise<IFCMSenderResult[]> {
    const results: IFCMSenderResult[] = [];

    for (const t of tokens) {
      const simulatedError = this.errorSimulator.get(t.token);
      if (simulatedError) {
        results.push({
          token: t.token,
          success: false,
          errorCode: simulatedError.code,
          errorMessage: simulatedError.message
        });
      } else {
        results.push({
          token: t.token,
          success: true,
          messageId: `projects/tade-app/messages/msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        });
      }
    }

    return results;
  }
}

export class SharedSecretAuthValidator implements IAuthValidator {
  constructor(private expectedSecret?: string) {}

  async validateAuthorization(
    authHeader?: string,
    secretHeader?: string
  ): Promise<{ authorized: boolean; callerId?: string; error?: string }> {
    const secret = process.env.TADE_PUSH_SECRET || this.expectedSecret || 'tade-internal-system-dispatch-key';
    
    // Check Bearer header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token === secret) {
        return { authorized: true, callerId: 'authorized-system-bearer' };
      }
    }

    // Check custom secret header
    if (secretHeader && secretHeader.trim() === secret) {
      return { authorized: true, callerId: 'authorized-system-secret' };
    }

    return {
      authorized: false,
      error: 'Unauthorized: Missing or invalid TADE Push Dispatcher authorization credentials'
    };
  }
}

export class TADEPushDispatcherCore implements ITADEPushDispatcher {
  private tokenRepo: ITokenRepository;
  private fcmSender: IFCMSender;
  private idempotencyStore: IIdempotencyStore;
  private authValidator: IAuthValidator;

  constructor(dependencies?: {
    tokenRepo?: ITokenRepository;
    fcmSender?: IFCMSender;
    idempotencyStore?: IIdempotencyStore;
    authValidator?: IAuthValidator;
  }) {
    this.tokenRepo = dependencies?.tokenRepo || new InMemoryTokenRepository();
    this.fcmSender = dependencies?.fcmSender || new MockFCMSender();
    this.idempotencyStore = dependencies?.idempotencyStore || new InMemoryIdempotencyStore();
    this.authValidator = dependencies?.authValidator || new SharedSecretAuthValidator();
  }

  async validateAuth(authHeader?: string, secretHeader?: string) {
    return this.authValidator.validateAuthorization(authHeader, secretHeader);
  }

  async resolveTokens(target: PushRecipientTarget): Promise<ResolvedDeviceToken[]> {
    return this.tokenRepo.resolveEnabledTokens(target);
  }

  async disableInvalidToken(uid: string, tokenId: string, reason: string): Promise<void> {
    await this.tokenRepo.disableToken(uid, tokenId, reason);
  }

  async dispatch(
    target: PushRecipientTarget,
    payload: PushNotificationPayload,
    idempotencyKey: string,
    notificationId?: string
  ): Promise<PushDispatchReport> {
    const attemptedAt = new Date().toISOString();

    // 1. Check Idempotency
    if (idempotencyKey) {
      const existingEntry = await this.idempotencyStore.getEntry(idempotencyKey);
      if (existingEntry && existingEntry.status === 'COMPLETED' && existingEntry.dispatchReport) {
        return {
          ...existingEntry.dispatchReport,
          status: 'SKIPPED_DUPLICATE'
        };
      }
    }

    // 2. Resolve Tokens
    const tokens = await this.resolveTokens(target);
    const totalRecipients = (target.userId ? 1 : 0) + (target.userIds ? target.userIds.length : 0);

    if (tokens.length === 0) {
      const noTokensReport: PushDispatchReport = {
        idempotencyKey,
        notificationId,
        attemptedAt,
        totalRecipients: totalRecipients || 1,
        totalTokensResolved: 0,
        successCount: 0,
        failureCount: 0,
        status: 'SKIPPED_NO_TOKENS',
        failures: [],
        disabledTokensCount: 0
      };

      if (idempotencyKey) {
        await this.idempotencyStore.saveEntry({
          idempotencyKey,
          notificationId: notificationId || `notif_${Date.now()}`,
          createdAt: attemptedAt,
          status: 'COMPLETED',
          dispatchReport: noTokensReport
        });
      }

      return noTokensReport;
    }

    // 3. Send FCM Payload to Resolved Tokens
    const sendResults = await this.fcmSender.sendToTokens(tokens, payload);

    let successCount = 0;
    let failureCount = 0;
    const failures: PushTokenFailure[] = [];
    let disabledTokensCount = 0;

    for (let i = 0; i < sendResults.length; i++) {
      const res = sendResults[i];
      const deviceToken = tokens[i];

      if (res.success) {
        successCount++;
      } else {
        failureCount++;
        const errorCode = res.errorCode || 'UNKNOWN_ERROR';
        const isInvalidToken = (FCM_INVALID_TOKEN_ERROR_CODES as readonly string[]).includes(errorCode);

        failures.push({
          uid: deviceToken.uid,
          tokenId: deviceToken.tokenId,
          token: deviceToken.token,
          errorCode,
          errorMessage: res.errorMessage || 'Delivery failed',
          shouldDisableToken: isInvalidToken
        });

        // 4. Safely disable invalid token individually without affecting user's other devices
        if (isInvalidToken) {
          try {
            await this.disableInvalidToken(
              deviceToken.uid,
              deviceToken.tokenId,
              `FCM error: ${errorCode} - ${res.errorMessage || 'Invalid registration token'}`
            );
            disabledTokensCount++;
          } catch (disableErr) {
            console.error(`[TADEPushDispatcher] Error disabling token ${deviceToken.tokenId}:`, disableErr);
          }
        }
      }
    }

    // 5. Determine Delivery Status
    let status: PushDeliveryStatus = 'DISPATCHED';
    if (successCount === 0 && failureCount > 0) {
      status = 'FAILED';
    } else if (successCount > 0 && failureCount > 0) {
      status = 'PARTIAL';
    } else {
      status = 'DISPATCHED';
    }

    const report: PushDispatchReport = {
      idempotencyKey,
      notificationId,
      attemptedAt,
      totalRecipients: totalRecipients || 1,
      totalTokensResolved: tokens.length,
      successCount,
      failureCount,
      status,
      failures,
      disabledTokensCount
    };

    // 6. Record idempotency entry
    if (idempotencyKey) {
      await this.idempotencyStore.saveEntry({
        idempotencyKey,
        notificationId: notificationId || `notif_${Date.now()}`,
        createdAt: attemptedAt,
        status: 'COMPLETED',
        dispatchReport: report
      });
    }

    return report;
  }
}
