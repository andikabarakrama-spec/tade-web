import { NotificationCategory } from './notification';
import { UserRole } from './index';

/**
 * TADE PUSH DISPATCHER CONTRACT (PHASE 3A)
 * 
 * Defines the strict, isolated server-side push notification dispatch contract.
 * All FCM Admin SDK calls and privileged dispatch operations MUST adhere to this
 * specification and run exclusively within a privileged server environment
 * (e.g. Firebase Cloud Functions 2nd Gen or secure container runtime).
 * 
 * Client-Side Guard:
 * - NO Firebase Admin SDK imports in client code.
 * - NO Service Account credentials in browser bundles or client-facing envs.
 * - In-app notification storage in Firestore remains completely separate from FCM push delivery.
 */

export type PushPriority = 'normal' | 'high';

export type PushDeliveryStatus = 
  | 'QUEUED'
  | 'DISPATCHED'
  | 'PARTIAL'
  | 'FAILED'
  | 'SKIPPED_NO_TOKENS'
  | 'SKIPPED_DUPLICATE';

export interface PushNotificationPayload {
  title: string;
  body: string;
  category?: NotificationCategory;
  actionTab?: string;
  actionUrl?: string;
  sound?: string;
  badge?: string;
  icon?: string;
  tag?: string;
  priority?: PushPriority;
  data?: Record<string, string>;
}

export interface PushRecipientTarget {
  userId?: string;
  userIds?: string[];
  role?: UserRole;
  filterEnabledOnly?: boolean;
}

export interface ResolvedDeviceToken {
  uid: string;
  tokenId: string;
  token: string;
  platform: string;
  browser: string;
  enabled: boolean;
}

export interface PushTokenFailure {
  uid: string;
  tokenId: string;
  token: string;
  errorCode: string;
  errorMessage?: string;
  shouldDisableToken: boolean;
}

export interface PushDispatchReport {
  idempotencyKey: string;
  notificationId?: string;
  attemptedAt: string;
  totalRecipients: number;
  totalTokensResolved: number;
  successCount: number;
  failureCount: number;
  status: PushDeliveryStatus;
  failures: PushTokenFailure[];
  disabledTokensCount: number;
}

export interface PushIdempotencyEntry {
  idempotencyKey: string;
  notificationId: string;
  createdAt: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  dispatchReport?: PushDispatchReport;
}

/**
 * Known FCM HTTP v1 / Admin SDK error codes that indicate an invalid/expired token.
 * Tokens encountering these errors will be safely disabled in users/{uid}/fcm_tokens/{tokenId}.
 */
export const FCM_INVALID_TOKEN_ERROR_CODES = [
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
  'UNREGISTERED',
  'INVALID_ARGUMENT'
] as const;

/**
 * Abstract Server-Side Dispatcher Interface
 * Implemented ONLY in server runtimes (e.g. Firebase Cloud Functions).
 */
export interface ITADEPushDispatcher {
  /**
   * Dispatches push notification to resolved tokens for specified recipients.
   * Handles idempotency, token resolution, multicast batching, and error cleanup.
   */
  dispatch(
    target: PushRecipientTarget,
    payload: PushNotificationPayload,
    idempotencyKey: string,
    notificationId?: string
  ): Promise<PushDispatchReport>;

  /**
   * Resolves enabled FCM tokens from Firestore path: users/{uid}/fcm_tokens
   */
  resolveTokens(target: PushRecipientTarget): Promise<ResolvedDeviceToken[]>;

  /**
   * Marks a specific token as disabled (enabled: false) for a user without deleting history or affecting other devices.
   */
  disableInvalidToken(uid: string, tokenId: string, reason: string): Promise<void>;
}
