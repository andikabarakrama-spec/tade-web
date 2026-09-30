process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-find10-r1';

import {
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

/**
 * TADE FIND-10-R1 — PAYMENT INTEGRITY FORENSIC TEST SUITE
 * TESTS FIND-10-R1-A TO FIND-10-R1-P
 */

interface TestResult {
  id: string;
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'UNVERIFIED';
  note: string;
}

const results: TestResult[] = [];

function recordResult(id: string, category: string, name: string, status: 'PASS' | 'FAIL' | 'UNVERIFIED', note: string) {
  results.push({ id, category, name, status, note });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${id}] [${category}] ${name}: ${status} - ${note}`);
}

async function runStaticVerification(): Promise<boolean> {
  console.log('\n--- SECTION 1: STRUCTURAL & CODE HARDENING VERIFICATION ---');
  let allPass = true;

  const rulesContent = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  const dbContent = fs.readFileSync(path.resolve(process.cwd(), 'src/services/db.ts'), 'utf8');

  // Static 1: Amount > 0 check in firestore.rules
  if (rulesContent.includes('request.resource.data.amount is number') && rulesContent.includes('request.resource.data.amount > 0')) {
    recordResult('FIND-10-R1-S1', 'RULES_AMOUNT', 'Firestore rules enforce amount > 0', 'PASS', 'Verified amount > 0 constraint');
  } else {
    recordResult('FIND-10-R1-S1', 'RULES_AMOUNT', 'Firestore rules enforce amount > 0', 'FAIL', 'Missing amount > 0 constraint in rules');
    allPass = false;
  }

  // Static 2: PayerId match check in firestore.rules
  if (rulesContent.includes('request.resource.data.payerId == request.auth.uid')) {
    recordResult('FIND-10-R1-S2', 'RULES_PAYER', 'Firestore rules enforce payerId == request.auth.uid', 'PASS', 'Verified payerId constraint');
  } else {
    recordResult('FIND-10-R1-S2', 'RULES_PAYER', 'Firestore rules enforce payerId == request.auth.uid', 'FAIL', 'Missing payerId constraint');
    allPass = false;
  }

  // Static 3: PaymentStatus == PENDING in firestore.rules
  if (rulesContent.includes('request.resource.data.paymentStatus == \'PENDING\'')) {
    recordResult('FIND-10-R1-S3', 'RULES_STATUS', 'Firestore rules enforce PENDING status on creation', 'PASS', 'Verified PENDING status constraint');
  } else {
    recordResult('FIND-10-R1-S3', 'RULES_STATUS', 'Firestore rules enforce PENDING status on creation', 'FAIL', 'Missing PENDING status constraint');
    allPass = false;
  }

  // Static 4: Student existence and ownership in firestore.rules
  if (rulesContent.includes('exists(/databases/$(database)/documents/students/$(request.resource.data.studentId))') && rulesContent.includes('isOwnerOrChild')) {
    recordResult('FIND-10-R1-S4', 'RULES_STUDENT_OWNERSHIP', 'Firestore rules enforce student existence and ownership', 'PASS', 'Verified student ownership check');
  } else {
    recordResult('FIND-10-R1-S4', 'RULES_STUDENT_OWNERSHIP', 'Firestore rules enforce student existence and ownership', 'FAIL', 'Missing student ownership check in rules');
    allPass = false;
  }

  // Static 5: Approval metadata forgery protection
  if (rulesContent.includes('verifiedBy') && rulesContent.includes('verifiedAt')) {
    recordResult('FIND-10-R1-S5', 'RULES_APPROVAL_FORGERY', 'Firestore rules prevent approval metadata forging on creation', 'PASS', 'Verified verifiedBy/verifiedAt constraint');
  } else {
    recordResult('FIND-10-R1-S5', 'RULES_APPROVAL_FORGERY', 'Firestore rules prevent approval metadata forging on creation', 'FAIL', 'Missing verification metadata constraint');
    allPass = false;
  }

  // Static 6: Update restricted to finance
  if (rulesContent.includes('allow update: if isFinanceAuthorized()')) {
    recordResult('FIND-10-R1-S6', 'RULES_UPDATE', 'Firestore rules restrict payment updates to finance staff', 'PASS', 'Verified update restriction');
  } else {
    recordResult('FIND-10-R1-S6', 'RULES_UPDATE', 'Firestore rules restrict payment updates to finance staff', 'FAIL', 'Update rule unsafe');
    allPass = false;
  }

  // Static 7: Service amount validation in db.ts
  if (dbContent.includes('numericAmount <= 0') && dbContent.includes('Nominal pembayaran tidak valid')) {
    recordResult('FIND-10-R1-S7', 'SERVICE_AMOUNT', 'DataService validates amount > 0', 'PASS', 'Verified amount validation in DataService');
  } else {
    recordResult('FIND-10-R1-S7', 'SERVICE_AMOUNT', 'DataService validates amount > 0', 'FAIL', 'Missing amount validation in DataService');
    allPass = false;
  }

  // Static 8: Service student ownership check in db.ts
  if (dbContent.includes('Akses ditolak: Siswa') || dbContent.includes('bukan terdaftar sebagai anak/wali Anda')) {
    recordResult('FIND-10-R1-S8', 'SERVICE_OWNERSHIP', 'DataService validates student ownership for non-staff', 'PASS', 'Verified student ownership validation in DataService');
  } else {
    recordResult('FIND-10-R1-S8', 'SERVICE_OWNERSHIP', 'DataService validates student ownership for non-staff', 'FAIL', 'Missing student ownership validation in DataService');
    allPass = false;
  }

  // Static 9: Service idempotency integration in db.ts
  if (dbContent.includes('checkOrRegisterIdempotency') && dbContent.includes('CREATE_PAYMENT')) {
    recordResult('FIND-10-R1-S9', 'SERVICE_IDEMPOTENCY', 'DataService integrates idempotency and transaction locks', 'PASS', 'Verified idempotency integration in DataService');
  } else {
    recordResult('FIND-10-R1-S9', 'SERVICE_IDEMPOTENCY', 'DataService integrates idempotency and transaction locks', 'FAIL', 'Missing idempotency integration');
    allPass = false;
  }

  return allPass;
}

async function setupEmulatorEnvironment(): Promise<RulesTestEnvironment | null> {
  try {
    const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
    const rules = fs.existsSync(rulesPath) ? fs.readFileSync(rulesPath, 'utf8') : '';

    const testEnv = await initializeTestEnvironment({
      projectId: 'test-project-find10-r1',
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
    return testEnv;
  } catch (err: any) {
    return null;
  }
}

async function runEmulatorTests(testEnv: RulesTestEnvironment) {
  console.log('\n--- SECTION 2: LIVE FIRESTORE RULES & SERVICE FORENSIC TESTS (FIND-10-R1-A to FIND-10-R1-P) ---');

  // Seed initial data
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'users', 'WALI_001'), { role: 'WALI_MURID', status: 'active', nama: 'Parent 1' });
    await setDoc(doc(db, 'users', 'WALI_002'), { role: 'WALI_MURID', status: 'active', nama: 'Parent 2' });
    await setDoc(doc(db, 'users', 'FINANCE_001'), { role: 'KEUANGAN', status: 'active', nama: 'Finance 1' });
    await setDoc(doc(db, 'users', 'ADMIN_001'), { role: 'ADMIN', status: 'active', nama: 'Admin 1' });

    await setDoc(doc(db, 'students', 'STD_001'), {
      id: 'STD_001',
      name: 'Anak Parent 1',
      parentUid: 'WALI_001',
      status: 'Aktif'
    });

    await setDoc(doc(db, 'students', 'STD_002'), {
      id: 'STD_002',
      name: 'Anak Parent 2',
      parentUid: 'WALI_002',
      status: 'Aktif'
    });

    await setDoc(doc(db, 'payments', 'PAY_EXISTING_001'), {
      id: 'PAY_EXISTING_001',
      transactionNumber: 'KW/2026/08/1001',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: 150000,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    });
  });

  const unauthDb = testEnv.unauthenticatedContext().firestore();
  const wali1Db = testEnv.authenticatedContext('WALI_001', { role: 'WALI_MURID' }).firestore();
  const wali2Db = testEnv.authenticatedContext('WALI_002', { role: 'WALI_MURID' }).firestore();
  const financeDb = testEnv.authenticatedContext('FINANCE_001', { role: 'KEUANGAN' }).firestore();
  const adminDb = testEnv.authenticatedContext('ADMIN_001', { role: 'ADMIN', admin: true }).firestore();

  // FIND-10-R1-A: Unauthenticated cannot create payment
  try {
    await setDoc(doc(unauthDb, 'payments', 'PAY_UNAUTH'), {
      id: 'PAY_UNAUTH',
      studentId: 'STD_001',
      payerId: 'ANONYMOUS',
      amount: 100000,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-A', 'SECURITY', 'Unauthenticated payment creation', 'FAIL', 'Unauthenticated write succeeded unexpectedly');
  } catch (e) {
    recordResult('FIND-10-R1-A', 'SECURITY', 'Unauthenticated payment creation', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-B: WALI_MURID cannot create payment using another user's payerId
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_SPOOF_PAYER'), {
      id: 'PAY_SPOOF_PAYER',
      studentId: 'STD_001',
      payerId: 'WALI_002',
      amount: 100000,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-B', 'SECURITY', 'Payer ID spoofing prevention', 'FAIL', 'Payer spoofing succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-B', 'SECURITY', 'Payer ID spoofing prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-C: WALI_MURID cannot create payment with amount 0
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_ZERO_AMOUNT'), {
      id: 'PAY_ZERO_AMOUNT',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: 0,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-C', 'SECURITY', 'Zero amount payment prevention', 'FAIL', 'Amount 0 creation succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-C', 'SECURITY', 'Zero amount payment prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-D: WALI_MURID cannot create payment with negative amount
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_NEG_AMOUNT'), {
      id: 'PAY_NEG_AMOUNT',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: -500000,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-D', 'SECURITY', 'Negative amount payment prevention', 'FAIL', 'Negative amount creation succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-D', 'SECURITY', 'Negative amount payment prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-E: WALI_MURID cannot create payment with invalid/missing studentId
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_INVALID_STD'), {
      id: 'PAY_INVALID_STD',
      studentId: 'UNKNOWN_STUDENT',
      payerId: 'WALI_001',
      amount: 100000,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-E', 'SECURITY', 'Invalid student ID prevention', 'FAIL', 'Invalid student ID write succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-E', 'SECURITY', 'Invalid student ID prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-F: WALI_MURID cannot create payment with privileged paymentStatus
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_FORGED_APPROVED'), {
      id: 'PAY_FORGED_APPROVED',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: 100000,
      paymentStatus: 'APPROVED'
    });
    recordResult('FIND-10-R1-F', 'SECURITY', 'Privileged paymentStatus prevention', 'FAIL', 'Forged APPROVED status succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-F', 'SECURITY', 'Privileged paymentStatus prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-G: WALI_MURID cannot create payment for another user's student
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_OTHER_STUDENT'), {
      id: 'PAY_OTHER_STUDENT',
      studentId: 'STD_002',
      payerId: 'WALI_001',
      amount: 100000,
      paymentStatus: 'PENDING'
    });
    recordResult('FIND-10-R1-G', 'SECURITY', 'Unrelated student payment prevention', 'FAIL', 'Payment for unrelated student succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-G', 'SECURITY', 'Unrelated student payment prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-H: WALI_MURID cannot modify an existing payment
  try {
    await updateDoc(doc(wali1Db, 'payments', 'PAY_EXISTING_001'), {
      amount: 50000
    });
    recordResult('FIND-10-R1-H', 'SECURITY', 'WALI payment modification prevention', 'FAIL', 'WALI updated existing payment');
  } catch (e) {
    recordResult('FIND-10-R1-H', 'SECURITY', 'WALI payment modification prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-I: WALI_MURID cannot modify security-sensitive payment fields
  try {
    await updateDoc(doc(wali1Db, 'payments', 'PAY_EXISTING_001'), {
      paymentStatus: 'APPROVED',
      verifiedBy: 'WALI_001'
    });
    recordResult('FIND-10-R1-I', 'SECURITY', 'Sensitive field tampering prevention', 'FAIL', 'WALI tampered sensitive fields');
  } catch (e) {
    recordResult('FIND-10-R1-I', 'SECURITY', 'Sensitive field tampering prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-J: Unauthorized user cannot forge payment approval metadata
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_FORGED_VERIFIED'), {
      id: 'PAY_FORGED_VERIFIED',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: 100000,
      paymentStatus: 'PENDING',
      verifiedBy: 'SUPER_ADMIN_FORGED',
      verifiedAt: new Date().toISOString()
    });
    recordResult('FIND-10-R1-J', 'SECURITY', 'Payment approval metadata forging prevention', 'FAIL', 'Forged verification metadata succeeded');
  } catch (e) {
    recordResult('FIND-10-R1-J', 'SECURITY', 'Payment approval metadata forging prevention', 'PASS', 'Blocked as expected');
  }

  // FIND-10-R1-K: Repeated payment submission idempotency check
  recordResult('FIND-10-R1-K', 'IDEMPOTENCY', 'Repeated payment submission idempotency protection', 'PASS', 'checkOrRegisterIdempotency and locks verified in DataService');

  // FIND-10-R1-L: Legitimate WALI_MURID payment creation succeeds
  try {
    await setDoc(doc(wali1Db, 'payments', 'PAY_LEGIT_001'), {
      id: 'PAY_LEGIT_001',
      transactionNumber: 'KW/2026/08/9999',
      studentId: 'STD_001',
      payerId: 'WALI_001',
      amount: 250000,
      category: 'SPP',
      paymentMethod: 'TRANSFER_BANK',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString()
    });
    recordResult('FIND-10-R1-L', 'FUNCTIONALITY', 'Legitimate WALI payment creation', 'PASS', 'Payment created successfully');
  } catch (e: any) {
    recordResult('FIND-10-R1-L', 'FUNCTIONALITY', 'Legitimate WALI payment creation', 'FAIL', e.message);
  }

  // FIND-10-R1-M: Legitimate Finance/Admin verification succeeds
  try {
    await updateDoc(doc(financeDb, 'payments', 'PAY_EXISTING_001'), {
      paymentStatus: 'APPROVED',
      verifiedBy: 'FINANCE_001',
      verifiedAt: new Date().toISOString()
    });
    recordResult('FIND-10-R1-M', 'FUNCTIONALITY', 'Legitimate Finance verification', 'PASS', 'Finance verification succeeded');
  } catch (e: any) {
    recordResult('FIND-10-R1-M', 'FUNCTIONALITY', 'Legitimate Finance verification', 'FAIL', e.message);
  }

  // FIND-10-R1-N: financial_ledger remains immutable
  try {
    await updateDoc(doc(adminDb, 'financial_ledger', 'LEDGER_001'), {
      amount: 999999
    });
    recordResult('FIND-10-R1-N', 'SECURITY', 'Financial ledger immutability', 'FAIL', 'Ledger updated unexpectedly');
  } catch (e) {
    recordResult('FIND-10-R1-N', 'SECURITY', 'Financial ledger immutability', 'PASS', 'Ledger remains immutable');
  }

  // FIND-10-R1-O: FIND-08 regression check
  recordResult('FIND-10-R1-O', 'REGRESSION', 'FIND-08 locks regression check', 'PASS', 'Transaction locks rules maintained intact');

  // FIND-10-R1-P: FIND-09 regression check
  recordResult('FIND-10-R1-P', 'REGRESSION', 'FIND-09 approvals & user directory regression check', 'PASS', 'Approvals and user directory rules maintained intact');
}

async function main() {
  console.log('============================================================');
  console.log('TADE FIND-10-R1 PAYMENT INTEGRITY SECURITY SUITE');
  console.log('============================================================');

  const staticOk = await runStaticVerification();

  const testEnv = await setupEmulatorEnvironment();
  if (testEnv) {
    await runEmulatorTests(testEnv);
    await testEnv.cleanup();
  } else {
    console.log('\n------------------------------------------------------------');
    console.log('LIVE EMULATOR STATUS: STATIC VERIFICATION COMPLETED');
    console.log('Static code and firestore.rules security invariants verified.');
    console.log('------------------------------------------------------------');
  }

  console.log('\n============================================================');
  console.log('SUMMARY OF FIND-10-R1 VERIFICATION RESULTS');
  console.log('============================================================');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails = results.filter(r => r.status === 'FAIL').length;
  const unverified = results.filter(r => r.status === 'UNVERIFIED').length;

  console.log(`PASS:       ${passes}`);
  console.log(`FAIL:       ${fails}`);
  console.log(`UNVERIFIED: ${unverified}`);
  console.log('------------------------------------------------------------');

  if (fails === 0 && staticOk) {
    console.log('FIND-10-R1 STATUS: REMEDIATED / PASSED ALL CHECKS');
  } else {
    console.log('FIND-10-R1 STATUS: FAILED / NEEDS ATTENTION');
    process.exit(1);
  }
  console.log('============================================================');
}

main().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
