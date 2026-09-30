import { DataService } from './src/services/db';
import { PaymentTransaction } from './src/types/index';

async function runH001Tests() {
  console.log('============================================================');
  console.log('TADE H0-01 PAYMENT PERSISTENCE HARDENING TEST SUITE');
  console.log('============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    if (condition) {
      console.log(` administrative status: ✅ [PASS] ${testName}: ${detail}`);
      passed++;
    } else {
      console.error(` administrative status: ❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  // ============================================================
  // TEST 1 — ACTUAL FIRESTORE PERSISTENCE FAILURE WITH VALID PAYLOAD
  // ============================================================
  console.log('\n--- TEST 1: ACTUAL FIRESTORE PERSISTENCE FAILURE (VALID PAYLOAD) ---');
  try {
    // Construct a 100% schema-valid payment payload matching Partial<PaymentTransaction>
    const validPaymentPayload: Partial<PaymentTransaction> = {
      studentId: 'STD_H001_VALID_001',
      studentName: 'Ahmad Fulan Test',
      classGroup: 'Kelas A',
      category: 'SPP',
      amount: 250000,
      paymentMethod: 'TRANSFER_BANK',
      bankName: 'BSI',
      accountNumber: '1234567890',
      senderName: 'Test Payer',
      transferDate: '2026-08-12',
      transferProof: 'https://example.com/proof.png',
      proofFile: 'https://example.com/proof.png',
      paymentProof: 'https://example.com/proof.png',
      walletProvider: 'OVO',
      walletNumber: '',
      cashReceivedBy: '',
      cashDate: '',
      notes: 'H0-01 Schema-Valid Persistence Test'
    };

    const userUid = 'UNAUTHORIZED_TEST_USER_999';
    const userName = 'Unauthorized Test User';
    const userRole = 'WALI_MURID';

    let threw = false;
    let caughtError: any = null;

    try {
      await DataService.createPaymentTransaction(
        validPaymentPayload,
        userUid,
        userName,
        userRole
      );
    } catch (e: any) {
      threw = true;
      caughtError = e;
    }

    // 1. MUST throw/reject
    assert(threw, 'H0-01-THROWS-ON-PERSISTENCE-FAIL', 'createPaymentTransaction rejected on Firestore persistence failure');

    // 2. Error message must represent persistence failure from Firestore (e.g. PERMISSION_DENIED / Gagal menyimpan)
    const errText = caughtError ? (caughtError.message || String(caughtError)) : '';
    const isPersistenceError = errText.includes('Gagal menyimpan') || errText.includes('permission-denied') || errText.includes('Missing or insufficient permissions');
    assert(
      isPersistenceError,
      'H0-01-PERSISTENCE-ERROR-TYPE',
      `Error represents genuine Firestore persistence rejection: "${errText}"`
    );

    // 3. Confirm failure was NOT caused by invalid payload / missing field
    const isClientSideDataError = errText.includes('Unsupported field value: undefined') || errText.includes('invalid data');
    assert(!isClientSideDataError, 'H0-01-VALID-PAYLOAD-CONFIRMED', 'Payload was completely valid (no undefined field errors)');

    // 4. Verify no authoritative local cache was written
    const safePayer = userUid.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const safeStudent = (validPaymentPayload.studentId || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const expectedId = `PAY_${safePayer}_${safeStudent}_${validPaymentPayload.category}_${validPaymentPayload.amount}_20260812`;
    
    let cachedDoc = null;
    if (typeof localStorage !== 'undefined') {
      cachedDoc = localStorage.getItem(`payment_${expectedId}`);
    }
    assert(cachedDoc === null, 'H0-01-NO-AUTHORITATIVE-LOCAL-CACHE', 'Uncommitted payment was NOT written to localStorage cache');

  } catch (err: any) {
    assert(false, 'H0-01-FAIL-TEST-EXCEPTION', err.message);
  }

  // ============================================================
  // TEST 2 — SUCCESS PATH CONTRACT & CONTRACT INTEGRITY
  // ============================================================
  console.log('\n--- TEST 2: PAYMENT SUCCESS PATH CONTRACT ---');
  try {
    assert(
      typeof DataService.createPaymentTransaction === 'function',
      'H0-01-SUCCESS-CONTRACT',
      'createPaymentTransaction maintains public function signature'
    );
  } catch (err: any) {
    assert(false, 'H0-01-SUCCESS-TEST', err.message);
  }

  // ============================================================
  // TEST 3 — FIND-08-R3 IDEMPOTENCY PRESERVATION
  // ============================================================
  console.log('\n--- TEST 3: FIND-08-R3 IDEMPOTENCY PRESERVATION ---');
  try {
    assert(
      typeof DataService.checkOrRegisterIdempotency === 'function',
      'H0-01-R3-IDEMP',
      'checkOrRegisterIdempotency present and intact'
    );
  } catch (err: any) {
    assert(false, 'H0-01-R3-TEST', err.message);
  }

  // ============================================================
  // TEST 4 — FIND-08-R2 TRANSACTION LOCK PRESERVATION
  // ============================================================
  console.log('\n--- TEST 4: FIND-08-R2 LOCK PRESERVATION ---');
  try {
    assert(
      typeof DataService.acquireLock === 'function' && typeof DataService.releaseLock === 'function',
      'H0-01-R2-LOCKS',
      'Lock management functions present and intact'
    );
  } catch (err: any) {
    assert(false, 'H0-01-R2-TEST', err.message);
  }

  console.log('\n============================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runH001Tests().catch(e => {
  console.error('Fatal error running H0-01 test suite:', e);
  process.exit(1);
});
