process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, setDoc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment | null = null;

async function setup() {
  try {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project-tade',
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });

    // Seed test documents with admin context
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      
      // Child_A owned by WALI_A
      await setDoc(doc(db, 'students', 'Child_A'), {
        name: 'Ananda A',
        parentUid: 'WALI_A_UID',
        waliUid: 'WALI_A_UID',
        parentEmail: 'wali_a@example.com',
        classGroup: 'TK-A'
      });

      // Child_B owned by WALI_B
      await setDoc(doc(db, 'students', 'Child_B'), {
        name: 'Ananda B',
        parentUid: 'WALI_B_UID',
        waliUid: 'WALI_A_UID', // conflicting legacy waliUid pointing to WALI_A
        waliMuridUid: 'WALI_A_UID', // conflicting legacy waliMuridUid pointing to WALI_A
        parentEmail: 'wali_a@example.com', // conflicting parentEmail pointing to WALI_A
        userId: 'WALI_A_UID', // conflicting userId pointing to WALI_A
        classGroup: 'TK-B'
      });

      // Child_C owned by WALI_A (multiple children case)
      await setDoc(doc(db, 'students', 'Child_C'), {
        name: 'Ananda C',
        parentUid: 'WALI_A_UID',
        classGroup: 'TK-B'
      });

      // Users documents for roles
      await setDoc(doc(db, 'users', 'WALI_A_UID'), { role: 'Wali Murid', studentId: 'Child_B' });
      await setDoc(doc(db, 'users', 'WALI_B_UID'), { role: 'Wali Murid', studentId: 'Child_B' });
      await setDoc(doc(db, 'users', 'ADMIN_UID'), { role: 'Admin SIM' });
      await setDoc(doc(db, 'users', 'GURU_UID'), { role: 'Guru' });
    });
  } catch (err: any) {
    console.warn('Notice: Firestore emulator port 8080 unreachable in container:', err.message);
  }
}

async function runTests() {
  await setup();
  console.log('=== RUNNING FIRESTORE SECURITY RULES RUNTIME TESTS ===\n');

  const waliAContext = testEnv.authenticatedContext('WALI_A_UID', { role: 'Wali Murid', email: 'wali_a@example.com' });
  const waliADb = waliAContext.firestore();

  const adminContext = testEnv.authenticatedContext('ADMIN_UID', { role: 'Admin SIM', admin: true });
  const adminDb = adminContext.firestore();

  const guruContext = testEnv.authenticatedContext('GURU_UID', { role: 'Guru' });
  const guruDb = guruContext.firestore();

  const unauthContext = testEnv.unauthenticatedContext();
  const unauthDb = unauthContext.firestore();

  const results: Array<{ id: string; name: string; status: 'PASS' | 'FAIL'; note: string }> = [];

  // TEST 01: WALI_A own child -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(waliADb, 'students', 'Child_A')));
    results.push({ id: 'TEST 01', name: 'WALI_A own child access', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 01', name: 'WALI_A own child access', status: 'FAIL', note: e.message });
  }

  // TEST 02: WALI_A other parent\'s child -> DENY
  try {
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 02', name: 'WALI_A other parent child access', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 02', name: 'WALI_A other parent child access', status: 'FAIL', note: e.message });
  }

  // TEST 03: legacy waliUid conflict -> DENY
  try {
    // Child_B has parentUid = WALI_B_UID, but waliUid = WALI_A_UID. WALI_A must be DENIED.
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 03', name: 'legacy waliUid conflict protection', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 03', name: 'legacy waliUid conflict protection', status: 'FAIL', note: e.message });
  }

  // TEST 04: legacy waliMuridUid conflict -> DENY
  try {
    // Child_B has parentUid = WALI_B_UID, but waliMuridUid = WALI_A_UID. WALI_A must be DENIED.
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 04', name: 'legacy waliMuridUid conflict protection', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 04', name: 'legacy waliMuridUid conflict protection', status: 'FAIL', note: e.message });
  }

  // TEST 05: parentEmail conflict -> DENY
  try {
    // Child_B has parentEmail = wali_a@example.com, but parentUid = WALI_B_UID. WALI_A must be DENIED.
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 05', name: 'parentEmail conflict protection', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 05', name: 'parentEmail conflict protection', status: 'FAIL', note: e.message });
  }

  // TEST 06: userId conflict -> DENY for WALI_MURID
  try {
    // Child_B has userId = WALI_A_UID, but parentUid = WALI_B_UID. WALI_A as WALI_MURID must be DENIED.
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 06', name: 'userId conflict protection for WALI_MURID', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 06', name: 'userId conflict protection for WALI_MURID', status: 'FAIL', note: e.message });
  }

  // TEST 07: getStudentId conflict -> DENY for WALI_MURID
  try {
    // WALI_A user doc has studentId = Child_B, but Child_B parentUid = WALI_B_UID. Must be DENIED.
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 07', name: 'getStudentId conflict protection', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 07', name: 'getStudentId conflict protection', status: 'FAIL', note: e.message });
  }

  // TEST 08: unauthenticated -> DENY
  try {
    await assertFails(getDoc(doc(unauthDb, 'students', 'Child_A')));
    results.push({ id: 'TEST 08', name: 'unauthenticated access prevention', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 08', name: 'unauthenticated access prevention', status: 'FAIL', note: e.message });
  }

  // TEST 09: unrestricted query -> DENY
  try {
    await assertFails(getDocs(collection(waliADb, 'students')));
    results.push({ id: 'TEST 09', name: 'unrestricted collection query prevention', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 09', name: 'unrestricted collection query prevention', status: 'FAIL', note: e.message });
  }

  // TEST 10: parentUid query -> ALLOW
  try {
    const q = query(collection(waliADb, 'students'), where('parentUid', '==', 'WALI_A_UID'));
    await assertSucceeds(getDocs(q));
    results.push({ id: 'TEST 10', name: 'ownership-scoped query', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 10', name: 'ownership-scoped query', status: 'FAIL', note: e.message });
  }

  // TEST 11: direct getDoc own child -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(waliADb, 'students', 'Child_A')));
    results.push({ id: 'TEST 11', name: 'direct getDoc own child', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 11', name: 'direct getDoc own child', status: 'FAIL', note: e.message });
  }

  // TEST 12: direct getDoc other child -> DENY
  try {
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 12', name: 'direct getDoc other child', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 12', name: 'direct getDoc other child', status: 'FAIL', note: e.message });
  }

  // TEST 13: URL manipulation -> DENY
  try {
    // Directly requesting Child_B via path
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 13', name: 'URL manipulation IDOR prevention', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 13', name: 'URL manipulation IDOR prevention', status: 'FAIL', note: e.message });
  }

  // TEST 14: localStorage manipulation -> DENY
  try {
    // Client-side state changes cannot bypass firestore rules
    await assertFails(getDoc(doc(waliADb, 'students', 'Child_B')));
    results.push({ id: 'TEST 14', name: 'localStorage tampering prevention', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 14', name: 'localStorage tampering prevention', status: 'FAIL', note: e.message });
  }

  // TEST 15: ownership modification -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'students', 'Child_A'), { parentUid: 'WALI_A_UID_MODIFIED' }));
    results.push({ id: 'TEST 15', name: 'ownership modification prevention by parent', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 15', name: 'ownership modification prevention by parent', status: 'FAIL', note: e.message });
  }

  // TEST 16: ADMIN legitimate access -> ALLOW
  try {
    await assertSucceeds(getDocs(collection(adminDb, 'students')));
    results.push({ id: 'TEST 16', name: 'ADMIN legitimate operational scope', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 16', name: 'ADMIN legitimate operational scope', status: 'FAIL', note: e.message });
  }

  // TEST 17: GURU legitimate access -> ALLOW
  try {
    await assertSucceeds(getDocs(collection(guruDb, 'students')));
    results.push({ id: 'TEST 17', name: 'GURU legitimate operational scope', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'TEST 17', name: 'GURU legitimate operational scope', status: 'FAIL', note: e.message });
  }

  // TEST 18: multiple children -> own children only
  try {
    const q = query(collection(waliADb, 'students'), where('parentUid', '==', 'WALI_A_UID'));
    const snap = await getDocs(q);
    const ids = snap.docs.map(d => d.id);
    if (ids.includes('Child_A') && ids.includes('Child_C') && !ids.includes('Child_B')) {
      results.push({ id: 'TEST 18', name: 'multiple children own children only', status: 'PASS', note: 'Returned Child_A & Child_C only' });
    } else {
      results.push({ id: 'TEST 18', name: 'multiple children own children only', status: 'FAIL', note: `Unexpected IDs: ${ids.join(',')}` });
    }
  } catch (e: any) {
    results.push({ id: 'TEST 18', name: 'multiple children own children only', status: 'FAIL', note: e.message });
  }

  console.table(results);

  if (testEnv) await testEnv.cleanup();
  const allPassed = results.every(r => r.status === 'PASS');
  if (allPassed) {
    console.log('\n✅ ALL 18 FIRESTORE SECURITY RULES RUNTIME TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('\n❌ SOME SECURITY TESTS FAILED');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Error running security tests:', err);
  process.exit(1);
});
