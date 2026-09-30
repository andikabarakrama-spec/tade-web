import {
  TADEPushDispatcherCore,
  SharedSecretAuthValidator,
  InMemoryTokenRepository,
  MockFCMSender,
  InMemoryIdempotencyStore
} from '../../src/server/push/TADEPushDispatcherCore';
import {
  PushRecipientTarget,
  PushNotificationPayload
} from '../../src/types/pushDispatcherContract';

/**
 * TADE PUSH DISPATCHER — NETLIFY FUNCTION SERVER ADAPTER (PHASE 3B)
 * 
 * Provides a portable serverless HTTP entry point for authorized push dispatches.
 * Adheres strictly to TADE security invariants:
 * - Requires authorization headers (Bearer token or x-tade-dispatch-secret).
 * - Client applications never receive FCM server credentials.
 * - Dispatches multicast notifications idempotently.
 * - Returns structured PushDispatchReport.
 */

// Singleton instance for serverless container lifecycle
let dispatcherInstance: TADEPushDispatcherCore | null = null;

function getDispatcher(): TADEPushDispatcherCore {
  if (!dispatcherInstance) {
    dispatcherInstance = new TADEPushDispatcherCore({
      authValidator: new SharedSecretAuthValidator(process.env.TADE_PUSH_SECRET),
      tokenRepo: new InMemoryTokenRepository(),
      fcmSender: new MockFCMSender(),
      idempotencyStore: new InMemoryIdempotencyStore()
    });
  }
  return dispatcherInstance;
}

export interface DispatchRequestBody {
  target: PushRecipientTarget;
  payload: PushNotificationPayload;
  idempotencyKey: string;
  notificationId?: string;
}

export const handler = async (event: {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
}) => {
  // 1. CORS and Method Check
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-tade-dispatch-secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed. POST is required.' })
    };
  }

  try {
    const dispatcher = getDispatcher();

    // 2. Authorization Verification
    const authHeader = event.headers?.['authorization'] || event.headers?.['Authorization'];
    const secretHeader = event.headers?.['x-tade-dispatch-secret'] || event.headers?.['X-TADE-DISPATCH-SECRET'];

    const authResult = await dispatcher.validateAuth(authHeader, secretHeader);
    if (!authResult.authorized) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          ok: false,
          error: authResult.error || 'Unauthorized request to TADE Push Dispatcher'
        })
      };
    }

    // 3. Payload Parsing & Validation
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, error: 'Missing request body' })
      };
    }

    let parsedBody: DispatchRequestBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, error: 'Invalid JSON body' })
      };
    }

    const { target, payload, idempotencyKey, notificationId } = parsedBody;

    if (!target || (!target.userId && (!target.userIds || target.userIds.length === 0) && !target.role)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, error: 'Target must specify userId, userIds, or role' })
      };
    }

    if (!payload || !payload.title || !payload.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, error: 'Payload must contain title and body' })
      };
    }

    if (!idempotencyKey) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ ok: false, error: 'idempotencyKey is required' })
      };
    }

    // 4. Dispatch via Core Engine
    const report = await dispatcher.dispatch(
      target,
      payload,
      idempotencyKey,
      notificationId
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        ok: true,
        report
      })
    };
  } catch (err: any) {
    console.error('[tade-push-dispatch] Error processing dispatch:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        ok: false,
        error: 'Internal Server Error during push dispatch execution'
      })
    };
  }
};
