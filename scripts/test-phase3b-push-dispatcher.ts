import {
  TADEPushDispatcherCore,
  InMemoryTokenRepository,
  MockFCMSender,
  InMemoryIdempotencyStore,
  SharedSecretAuthValidator
} from '../src/server/push/TADEPushDispatcherCore';
import { handler } from '../netlify/functions/tade-push-dispatch';
import { ResolvedDeviceToken } from '../src/types/pushDispatcherContract';

interface TestResult {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL';
  details: string;
}

const results: TestResult[] = [];

async function runPhase3BTests() {
  console.log('============================================================');
  console.log('TADE PHASE 3B — PORTABLE PUSH DISPATCHER VERIFICATION SUITE');
  console.log('============================================================');
  console.log('Mode: Isolated Mock Execution (Zero production FCM/Admin credentials)');

  // -------------------------------------------------------------
  // TEST 1: Single Device Token Dispatch
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const idempStore = new InMemoryIdempotencyStore();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender, idempotencyStore: idempStore });

    const user1Tokens: ResolvedDeviceToken[] = [
      {
        uid: 'USER_WALI_01',
        tokenId: 'TOKEN_DEV_ANDROID_01',
        token: 'fcm_valid_token_android_01',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      }
    ];
    tokenRepo.setTokensForUser('USER_WALI_01', user1Tokens);

    const report = await dispatcher.dispatch(
      { userId: 'USER_WALI_01' },
      { title: 'Pengumuman Sekolah', body: 'Besok libur nasional', category: 'pengumuman' },
      'IDEMP_TEST_001',
      'NOTIF_001'
    );

    if (
      report.status === 'DISPATCHED' &&
      report.totalTokensResolved === 1 &&
      report.successCount === 1 &&
      report.failureCount === 0 &&
      report.disabledTokensCount === 0
    ) {
      results.push({
        id: 'TEST-1',
        name: 'Single Token Dispatch',
        status: 'PASS',
        details: 'Successfully resolved 1 enabled token and dispatched without error.'
      });
    } else {
      results.push({
        id: 'TEST-1',
        name: 'Single Token Dispatch',
        status: 'FAIL',
        details: `Unexpected report: ${JSON.stringify(report)}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-1', name: 'Single Token Dispatch', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 2: Multi-Device Token Dispatch (Phone, Tablet, Desktop)
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const idempStore = new InMemoryIdempotencyStore();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender, idempotencyStore: idempStore });

    const userMultiTokens: ResolvedDeviceToken[] = [
      {
        uid: 'USER_GURU_01',
        tokenId: 'TOKEN_PHONE_01',
        token: 'fcm_phone_guru_token',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      },
      {
        uid: 'USER_GURU_01',
        tokenId: 'TOKEN_TABLET_01',
        token: 'fcm_tablet_guru_token',
        platform: 'Android',
        browser: 'Samsung Internet',
        enabled: true
      },
      {
        uid: 'USER_GURU_01',
        tokenId: 'TOKEN_DESKTOP_01',
        token: 'fcm_desktop_guru_token',
        platform: 'Windows',
        browser: 'Chrome',
        enabled: true
      }
    ];
    tokenRepo.setTokensForUser('USER_GURU_01', userMultiTokens);

    const report = await dispatcher.dispatch(
      { userId: 'USER_GURU_01' },
      { title: 'Agenda Rapat Guru', body: 'Rapat guru jam 13:00 WIB', category: 'agenda' },
      'IDEMP_TEST_002',
      'NOTIF_002'
    );

    if (
      report.status === 'DISPATCHED' &&
      report.totalTokensResolved === 3 &&
      report.successCount === 3 &&
      report.failureCount === 0
    ) {
      results.push({
        id: 'TEST-2',
        name: 'Multi-Device Token Dispatch',
        status: 'PASS',
        details: 'All 3 user devices (phone, tablet, desktop) resolved and dispatched concurrently.'
      });
    } else {
      results.push({
        id: 'TEST-2',
        name: 'Multi-Device Token Dispatch',
        status: 'FAIL',
        details: `Unexpected report: ${JSON.stringify(report)}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-2', name: 'Multi-Device Token Dispatch', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 3: Invalid/Unregistered Token Handling & Partial Delivery
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const idempStore = new InMemoryIdempotencyStore();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender, idempotencyStore: idempStore });

    const userMixedTokens: ResolvedDeviceToken[] = [
      {
        uid: 'USER_WALI_02',
        tokenId: 'TOKEN_VALID_02',
        token: 'fcm_token_valid_02',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      },
      {
        uid: 'USER_WALI_02',
        tokenId: 'TOKEN_EXPIRED_02',
        token: 'fcm_token_expired_02',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      }
    ];
    tokenRepo.setTokensForUser('USER_WALI_02', userMixedTokens);

    // Simulate unregistered token error for the second token
    fcmSender.simulateTokenError(
      'fcm_token_expired_02',
      'messaging/registration-token-not-registered',
      'Requested entity was not found.'
    );

    const report = await dispatcher.dispatch(
      { userId: 'USER_WALI_02' },
      { title: 'Infaq Masuk', body: 'Terima kasih atas infaq Anda', category: 'infaq_spp' },
      'IDEMP_TEST_003',
      'NOTIF_003'
    );

    const updatedTokens = tokenRepo.getUserTokens('USER_WALI_02');
    const validToken = updatedTokens.find(t => t.tokenId === 'TOKEN_VALID_02');
    const expiredToken = updatedTokens.find(t => t.tokenId === 'TOKEN_EXPIRED_02');

    if (
      report.status === 'PARTIAL' &&
      report.totalTokensResolved === 2 &&
      report.successCount === 1 &&
      report.failureCount === 1 &&
      report.disabledTokensCount === 1 &&
      report.failures[0].shouldDisableToken === true &&
      validToken?.enabled === true &&
      expiredToken?.enabled === false
    ) {
      results.push({
        id: 'TEST-3',
        name: 'Invalid Token Error Handling & Isolation',
        status: 'PASS',
        details: 'Unregistered token was disabled individually; valid token delivered and remained enabled.'
      });
    } else {
      results.push({
        id: 'TEST-3',
        name: 'Invalid Token Error Handling & Isolation',
        status: 'FAIL',
        details: `Unexpected outcome: ${JSON.stringify(report)}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-3', name: 'Invalid Token Error Handling & Isolation', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 4: Disabled Token Resolution Filtering
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender });

    tokenRepo.setTokensForUser('USER_WALI_03', [
      {
        uid: 'USER_WALI_03',
        tokenId: 'TOKEN_ACTIVE_03',
        token: 'fcm_token_active_03',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      },
      {
        uid: 'USER_WALI_03',
        tokenId: 'TOKEN_DISABLED_03',
        token: 'fcm_token_disabled_03',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: false
      }
    ]);

    const resolved = await dispatcher.resolveTokens({ userId: 'USER_WALI_03' });

    if (resolved.length === 1 && resolved[0].tokenId === 'TOKEN_ACTIVE_03') {
      results.push({
        id: 'TEST-4',
        name: 'Disabled Token Filtering',
        status: 'PASS',
        details: 'Disabled token (enabled: false) successfully excluded from resolution.'
      });
    } else {
      results.push({
        id: 'TEST-4',
        name: 'Disabled Token Filtering',
        status: 'FAIL',
        details: `Expected 1 active token, got ${resolved.length}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-4', name: 'Disabled Token Filtering', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 5: Idempotency Protection
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const idempStore = new InMemoryIdempotencyStore();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender, idempotencyStore: idempStore });

    tokenRepo.setTokensForUser('USER_ADMIN_01', [
      {
        uid: 'USER_ADMIN_01',
        tokenId: 'TOKEN_ADMIN_01',
        token: 'fcm_token_admin_01',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      }
    ]);

    // Dispatch 1
    const report1 = await dispatcher.dispatch(
      { userId: 'USER_ADMIN_01' },
      { title: 'Test Idempotency', body: 'Check repeat' },
      'IDEMP_DUPLICATE_KEY_01',
      'NOTIF_IDEMP_01'
    );

    // Dispatch 2 (Identical Idempotency Key)
    const report2 = await dispatcher.dispatch(
      { userId: 'USER_ADMIN_01' },
      { title: 'Test Idempotency', body: 'Check repeat' },
      'IDEMP_DUPLICATE_KEY_01',
      'NOTIF_IDEMP_01'
    );

    if (report1.status === 'DISPATCHED' && report2.status === 'SKIPPED_DUPLICATE') {
      results.push({
        id: 'TEST-5',
        name: 'Idempotency Protection',
        status: 'PASS',
        details: 'Second attempt with identical idempotencyKey was skipped (SKIPPED_DUPLICATE).'
      });
    } else {
      results.push({
        id: 'TEST-5',
        name: 'Idempotency Protection',
        status: 'FAIL',
        details: `Report 1: ${report1.status}, Report 2: ${report2.status}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-5', name: 'Idempotency Protection', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 6: Zero Tokens Resolution
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo });

    const report = await dispatcher.dispatch(
      { userId: 'USER_NO_TOKENS' },
      { title: 'Notification with no tokens', body: 'Content' },
      'IDEMP_ZERO_TOKENS',
      'NOTIF_ZERO'
    );

    if (report.status === 'SKIPPED_NO_TOKENS' && report.totalTokensResolved === 0) {
      results.push({
        id: 'TEST-6',
        name: 'Zero Tokens Handling',
        status: 'PASS',
        details: 'Correctly returned SKIPPED_NO_TOKENS when target has no registered device tokens.'
      });
    } else {
      results.push({
        id: 'TEST-6',
        name: 'Zero Tokens Handling',
        status: 'FAIL',
        details: `Unexpected report: ${JSON.stringify(report)}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-6', name: 'Zero Tokens Handling', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 7: Netlify Function HTTP Server Adapter Authorization & Payload
  // -------------------------------------------------------------
  try {
    // 7A: Unauthorized request (missing auth)
    const resUnauthorized = await handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({
        target: { userId: 'USER_01' },
        payload: { title: 'T', body: 'B' },
        idempotencyKey: 'IDEMP_UNAUTH'
      })
    });

    // 7B: Authorized request
    const resAuthorized = await handler({
      httpMethod: 'POST',
      headers: {
        'x-tade-dispatch-secret': 'tade-internal-system-dispatch-key'
      },
      body: JSON.stringify({
        target: { userId: 'USER_01' },
        payload: { title: 'Valid Title', body: 'Valid Body' },
        idempotencyKey: 'IDEMP_AUTH_TEST_01'
      })
    });

    const bodyAuth = JSON.parse(resAuthorized.body);

    if (resUnauthorized.statusCode === 401 && resAuthorized.statusCode === 200 && bodyAuth.ok === true) {
      results.push({
        id: 'TEST-7',
        name: 'Server Adapter Authorization Gate',
        status: 'PASS',
        details: 'Unauthorized request returned 401; authorized request with secret returned 200.'
      });
    } else {
      results.push({
        id: 'TEST-7',
        name: 'Server Adapter Authorization Gate',
        status: 'FAIL',
        details: `Unauthorized status: ${resUnauthorized.statusCode}, Authorized status: ${resAuthorized.statusCode}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-7', name: 'Server Adapter Authorization Gate', status: 'FAIL', details: err.message });
  }

  // -------------------------------------------------------------
  // TEST 8: Full FCM Failure Reporting
  // -------------------------------------------------------------
  try {
    const tokenRepo = new InMemoryTokenRepository();
    const fcmSender = new MockFCMSender();
    const dispatcher = new TADEPushDispatcherCore({ tokenRepo, fcmSender });

    tokenRepo.setTokensForUser('USER_FAIL_01', [
      {
        uid: 'USER_FAIL_01',
        tokenId: 'TOKEN_FAIL_01',
        token: 'fcm_token_fail_network',
        platform: 'Android',
        browser: 'Chrome Mobile',
        enabled: true
      }
    ]);

    fcmSender.simulateTokenError(
      'fcm_token_fail_network',
      'messaging/internal-error',
      'FCM Gateway connection timeout'
    );

    const report = await dispatcher.dispatch(
      { userId: 'USER_FAIL_01' },
      { title: 'Network Fail', body: 'Body' },
      'IDEMP_FAIL_01',
      'NOTIF_FAIL'
    );

    if (report.status === 'FAILED' && report.failureCount === 1 && report.successCount === 0) {
      results.push({
        id: 'TEST-8',
        name: 'Full Delivery Failure Reporting',
        status: 'PASS',
        details: 'Returned status FAILED with failure details preserved in report.'
      });
    } else {
      results.push({
        id: 'TEST-8',
        name: 'Full Delivery Failure Reporting',
        status: 'FAIL',
        details: `Unexpected report: ${JSON.stringify(report)}`
      });
    }
  } catch (err: any) {
    results.push({ id: 'TEST-8', name: 'Full Delivery Failure Reporting', status: 'FAIL', details: err.message });
  }

  console.log('\n============================================================');
  console.log('SUMMARY OF PHASE 3B PUSH DISPATCHER TESTS');
  console.log('============================================================');
  console.table(results);

  const allPassed = results.every(r => r.status === 'PASS');
  if (!allPassed) {
    console.error('\nOne or more Phase 3B tests failed!');
    process.exit(1);
  } else {
    console.log('\nALL 8 PHASE 3B TESTS PASSED SUCCESSFULLY!');
  }
}

runPhase3BTests().catch(err => {
  console.error('Fatal error running Phase 3B tests:', err);
  process.exit(1);
});
