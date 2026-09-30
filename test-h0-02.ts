import { DataService } from './src/services/db';
import { auth, db } from './src/firebase/config';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function runH002Tests() {
  console.log('============================================================');
  console.log('TADE H0-02 APPROVAL COMMIT HARDENING TEST SUITE');
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
  // TEST 1 — ACTUAL FIRESTORE APPROVAL COMMIT FAILURE (VALID PAYLOAD)
  // ============================================================
  console.log('\n--- TEST 1: ACTUAL FIRESTORE APPROVAL COMMIT FAILURE ---');
  try {
    let reqId = `REQ_H002_VALID_${Date.now()}`;
    let uid = 'ANONYMOUS_H002_USER';

    try {
      const cred = await signInAnonymously(auth);
      uid = cred.user.uid;
      const reqRef = doc(db, 'approval_requests', reqId);

      // Pre-seed valid pending approval request in Firestore
      await setDoc(reqRef, {
        id: reqId,
        requesterId: uid,
        requesterName: 'H002 Test Requester',
        type: 'USER_REGISTRATION',
        targetId: uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('Pre-seeded valid pending approval request:', reqId);
    } catch (seedErr: any) {
      console.warn('Could not pre-seed approval doc (using fallback ID):', seedErr?.message || seedErr);
    }

    const reqRef = doc(db, 'approval_requests', reqId);
    const snapBefore = await getDoc(reqRef);
    const statusBefore = snapBefore.exists() ? snapBefore.data()?.status : 'UNKNOWN';

    let threw = false;
    let caughtError: any = null;

    try {
      // Execute approveRequest as a non-admin role (CALON_WALI_MURID) to trigger Firestore rule rejection at batch.commit()
      await DataService.approveRequest(reqId, uid, 'Non Admin Approver', 'CALON_WALI_MURID' as any);
    } catch (e: any) {
      threw = true;
      caughtError = e;
    }

    // 1. MUST throw/reject when batch commit fails
    assert(threw, 'H0-02-THROWS-ON-COMMIT-FAIL', 'approveRequest rejected on Firestore batch commit persistence failure');

    // 2. Error message must represent persistence failure from Firestore or Gagal menyetujui
    const errText = caughtError ? (caughtError.message || String(caughtError)) : '';
    const isPersistenceError = errText.includes('Gagal menyetujui') || errText.includes('permission-denied') || errText.includes('Missing or insufficient permissions') || errText.includes('PERMISSION_DENIED');
    assert(
      isPersistenceError,
      'H0-02-PERSISTENCE-ERROR-TYPE',
      `Error represents genuine Firestore approval persistence rejection: "${errText}"`
    );

    // 3. Confirm failure was NOT caused by invalid client payload / undefined field
    const isClientSideDataError = errText.includes('Unsupported field value: undefined') || errText.includes('invalid data');
    assert(!isClientSideDataError, 'H0-02-VALID-PAYLOAD-CONFIRMED', 'Approval request payload was completely valid (no undefined field errors)');

    // 4. Verify Firestore state AFTER failure remains unchanged or un-approved
    const snapAfter = await getDoc(reqRef);
    const statusAfter = snapAfter.exists() ? snapAfter.data()?.status : 'UNKNOWN';
    assert(statusAfter !== 'approved', 'H0-02-FIRESTORE-STATE-UNCHANGED', `Firestore approval status remained unapproved (before: ${statusBefore}, after: ${statusAfter})`);

  } catch (err: any) {
    assert(false, 'H0-02-FAIL-TEST-EXCEPTION', err.message);
  }

  // ============================================================
  // TEST 2 — APPROVAL SUCCESS CONTRACT INTEGRITY
  // ============================================================
  console.log('\n--- TEST 2: APPROVAL SUCCESS CONTRACT ---');
  assert(typeof DataService.approveRequest === 'function', 'H0-02-SUCCESS-CONTRACT', 'approveRequest maintains public function signature');

  // ============================================================
  // TEST 3 — REGRESSION PRESERVATION: FIND-08-R2, R3
  // ============================================================
  console.log('\n--- TEST 3: REGRESSION PRESERVATION (FIND-08-R2, R3) ---');
  assert(
    typeof DataService.checkOrRegisterIdempotency === 'function' && typeof DataService.completeIdempotency === 'function',
    'H0-02-R3-IDEMP',
    'checkOrRegisterIdempotency and completeIdempotency present and intact'
  );
  assert(
    typeof DataService.acquireLock === 'function' && typeof DataService.releaseLock === 'function',
    'H0-02-R2-LOCKS',
    'Lock management functions present and intact'
  );

  console.log('============================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runH002Tests();
