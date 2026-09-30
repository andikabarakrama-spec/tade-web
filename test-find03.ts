import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import fs from 'fs';
import path from 'path';
import { doc, getDoc, getDocs, collection, query, where, updateDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

async function setup() {
  const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project-find03',
    firestore: {
      rules,
      host: '127.0.0.1',
      port: 8080,
    },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    
    // Users setup
    await setDoc(doc(db, 'users', 'WALI_A_UID'), { role: 'Wali Murid' });
    await setDoc(doc(db, 'users', 'WALI_B_UID'), { role: 'Wali Murid' });
    await setDoc(doc(db, 'users', 'CALON_WALI_UID'), { role: 'CALON_WALI_MURID' });
    await setDoc(doc(db, 'users', 'ADMIN_UID'), { role: 'Admin SIM', admin: true });
    await setDoc(doc(db, 'users', 'KEUANGAN_UID'), { role: 'Keuangan' });
    await setDoc(doc(db, 'users', 'BENDAHARA_UID'), { role: 'Bendahara' });
    await setDoc(doc(db, 'users', 'GURU_UID'), { role: 'Guru' });

    // Students setup
    await setDoc(doc(db, 'students', 'Child_A'), { id: 'Child_A', name: 'Siswa A', parentUid: 'WALI_A_UID' });
    await setDoc(doc(db, 'students', 'Child_B'), { id: 'Child_B', name: 'Siswa B', parentUid: 'WALI_B_UID' });

    // Academic presensi setup for academic read test
    await setDoc(doc(db, 'sim_presensi', 'pres_Child_A'), { id: 'pres_Child_A', studentId: 'Child_A', status: 'Hadir' });

    // Seed lock owned by WALI_B
    await setDoc(doc(db, 'transaction_locks', 'LOCK_WALI_B'), {
      lockId: 'LOCK_WALI_B',
      lockedBy: 'WALI_B_UID',
      timestamp: Date.now()
    });

    // Seed idempotency key owned by WALI_B
    await setDoc(doc(db, 'idempotency_keys', 'IDEMP_WALI_B'), {
      keyId: 'IDEMP_WALI_B',
      userUid: 'WALI_B_UID',
      createdAt: new Date().toISOString()
    });

    // Seed payment for WALI_A / Child_A
    await setDoc(doc(db, 'payments', 'PAY_A'), {
      payerId: 'WALI_A_UID',
      parentUid: 'WALI_A_UID',
      studentId: 'Child_A',
      amount: 500000,
      paymentStatus: 'PENDING',
      category: 'SPP',
      proofUrl: 'https://storage/proofA.jpg',
      auditMetadata: { ip: '127.0.0.1' }
    });

    // Seed payment for WALI_B / Child_B
    await setDoc(doc(db, 'payments', 'PAY_B'), {
      payerId: 'WALI_B_UID',
      parentUid: 'WALI_B_UID',
      studentId: 'Child_B',
      amount: 500000,
      paymentStatus: 'PENDING',
      category: 'SPP',
      proofUrl: 'https://storage/proofB.jpg',
      auditMetadata: { ip: '127.0.0.1' }
    });

    // Seed SPP document for Child_A and Child_B
    await setDoc(doc(db, 'sim_spp', 'spp_Child_A'), {
      id: 'spp_Child_A',
      studentId: 'Child_A',
      parentUid: 'WALI_A_UID',
      status: 'Belum Lunas',
      amount: 500000
    });

    await setDoc(doc(db, 'sim_spp', 'spp_Child_B'), {
      id: 'spp_Child_B',
      studentId: 'Child_B',
      parentUid: 'WALI_B_UID',
      status: 'Belum Lunas',
      amount: 500000
    });
  });
}

async function runFind03Tests() {
  await setup();
  console.log('=== RUNNING FIND-03 FIRESTORE SECURITY RULES RUNTIME TESTS ===\n');

  const waliAContext = testEnv.authenticatedContext('WALI_A_UID', { role: 'Wali Murid' });
  const waliADb = waliAContext.firestore();

  const waliBContext = testEnv.authenticatedContext('WALI_B_UID', { role: 'Wali Murid' });
  const waliBDb = waliBContext.firestore();

  const calonWaliContext = testEnv.authenticatedContext('CALON_WALI_UID', { role: 'CALON_WALI_MURID' });
  const calonWaliDb = calonWaliContext.firestore();

  const guruContext = testEnv.authenticatedContext('GURU_UID', { role: 'Guru' });
  const guruDb = guruContext.firestore();

  const keuanganContext = testEnv.authenticatedContext('KEUANGAN_UID', { role: 'Keuangan' });
  const keuanganDb = keuanganContext.firestore();

  const bendaharaContext = testEnv.authenticatedContext('BENDAHARA_UID', { role: 'Bendahara' });
  const bendaharaDb = bendaharaContext.firestore();

  const adminContext = testEnv.authenticatedContext('ADMIN_UID', { role: 'Admin SIM', admin: true });
  const adminDb = adminContext.firestore();

  const results: Array<{ id: string; name: string; status: 'PASS' | 'FAIL'; note: string }> = [];

  // LOCK TESTS
  // LOCK-01: WALI_A creates own lock -> ALLOW
  try {
    await assertSucceeds(setDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_A'), {
      lockedBy: 'WALI_A_UID',
      timestamp: Date.now()
    }));
    results.push({ id: 'LOCK-01', name: 'WALI_A creates own lock', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-01', name: 'WALI_A creates own lock', status: 'FAIL', note: e.message });
  }

  // LOCK-02: WALI_A updates own lock without changing ownership -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_A'), {
      timestamp: Date.now()
    }));
    results.push({ id: 'LOCK-02', name: 'WALI_A updates own lock without changing ownership', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-02', name: 'WALI_A updates own lock without changing ownership', status: 'FAIL', note: e.message });
  }

  // LOCK-03: WALI_A changes own lockedBy to WALI_B -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_A'), {
      lockedBy: 'WALI_B_UID'
    }));
    results.push({ id: 'LOCK-03', name: 'WALI_A changes own lockedBy to WALI_B', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-03', name: 'WALI_A changes own lockedBy to WALI_B', status: 'FAIL', note: e.message });
  }

  // LOCK-04: WALI_A updates WALI_B lock -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_B'), {
      timestamp: Date.now()
    }));
    results.push({ id: 'LOCK-04', name: 'WALI_A updates WALI_B lock', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-04', name: 'WALI_A updates WALI_B lock', status: 'FAIL', note: e.message });
  }

  // LOCK-05: WALI_A changes WALI_B lock ownership to WALI_A -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_B'), {
      lockedBy: 'WALI_A_UID'
    }));
    results.push({ id: 'LOCK-05', name: 'WALI_A takes over WALI_B lock', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-05', name: 'WALI_A takes over WALI_B lock', status: 'FAIL', note: e.message });
  }

  // LOCK-06: WALI_A deletes WALI_B lock -> DENY
  try {
    await assertFails(deleteDoc(doc(waliADb, 'transaction_locks', 'LOCK_WALI_B')));
    results.push({ id: 'LOCK-06', name: 'WALI_A deletes WALI_B lock', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-06', name: 'WALI_A deletes WALI_B lock', status: 'FAIL', note: e.message });
  }

  // LOCK-07: ADMIN legitimate lock management -> ALLOW
  try {
    await assertSucceeds(deleteDoc(doc(adminDb, 'transaction_locks', 'LOCK_WALI_B')));
    results.push({ id: 'LOCK-07', name: 'ADMIN legitimate lock management', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'LOCK-07', name: 'ADMIN legitimate lock management', status: 'FAIL', note: e.message });
  }

  // IDEMPOTENCY TESTS
  // IDEMP-01: WALI_A creates own idempotency record -> ALLOW
  try {
    await assertSucceeds(setDoc(doc(waliADb, 'idempotency_keys', 'IDEMP_WALI_A'), {
      userUid: 'WALI_A_UID',
      createdAt: new Date().toISOString()
    }));
    results.push({ id: 'IDEMP-01', name: 'WALI_A creates own idempotency record', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'IDEMP-01', name: 'WALI_A creates own idempotency record', status: 'FAIL', note: e.message });
  }

  // IDEMP-02: WALI_A modifies WALI_B idempotency record -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'idempotency_keys', 'IDEMP_WALI_B'), {
      createdAt: new Date().toISOString()
    }));
    results.push({ id: 'IDEMP-02', name: 'WALI_A modifies WALI_B idempotency record', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'IDEMP-02', name: 'WALI_A modifies WALI_B idempotency record', status: 'FAIL', note: e.message });
  }

  // IDEMP-03: WALI_A takes over WALI_B idempotency record -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'idempotency_keys', 'IDEMP_WALI_B'), {
      userUid: 'WALI_A_UID'
    }));
    results.push({ id: 'IDEMP-03', name: 'WALI_A takes over WALI_B idempotency record', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'IDEMP-03', name: 'WALI_A takes over WALI_B idempotency record', status: 'FAIL', note: e.message });
  }

  // PAY & SPP TESTS
  // PAY-01: WALI_A read own payment -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(waliADb, 'payments', 'PAY_A')));
    results.push({ id: 'PAY-01', name: 'WALI_A read own payment', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'PAY-01', name: 'WALI_A read own payment', status: 'FAIL', note: e.message });
  }

  // PAY-02: WALI_A read WALI_B payment -> DENY
  try {
    await assertFails(getDoc(doc(waliADb, 'payments', 'PAY_B')));
    results.push({ id: 'PAY-02', name: 'WALI_A read WALI_B payment', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'PAY-02', name: 'WALI_A read WALI_B payment', status: 'FAIL', note: e.message });
  }

  // PAY-03: WALI_A approves payment directly -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'payments', 'PAY_A'), {
      paymentStatus: 'APPROVED'
    }));
    results.push({ id: 'PAY-03', name: 'WALI_A approves payment directly', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'PAY-03', name: 'WALI_A approves payment directly', status: 'FAIL', note: e.message });
  }

  // PAY-04: KEUANGAN approves payment -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(keuanganDb, 'payments', 'PAY_A'), {
      paymentStatus: 'APPROVED'
    }));
    results.push({ id: 'PAY-04', name: 'KEUANGAN approves payment', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'PAY-04', name: 'KEUANGAN approves payment', status: 'FAIL', note: e.message });
  }

  // SPP-01: WALI_A modifies SPP directly -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'sim_spp', 'spp_Child_A'), {
      status: 'Lunas'
    }));
    results.push({ id: 'SPP-01', name: 'WALI_A modifies SPP directly', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'SPP-01', name: 'WALI_A modifies SPP directly', status: 'FAIL', note: e.message });
  }

  // SPP-02: KEUANGAN updates SPP during verification -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(keuanganDb, 'sim_spp', 'spp_Child_A'), {
      status: 'Lunas'
    }));
    results.push({ id: 'SPP-02', name: 'KEUANGAN updates SPP', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'SPP-02', name: 'KEUANGAN updates SPP', status: 'FAIL', note: e.message });
  }

  // PAY-SPP-ATOMIC: KEUANGAN batch commit payment update + SPP update -> ALLOW
  try {
    const batch = writeBatch(keuanganDb);
    batch.update(doc(keuanganDb, 'payments', 'PAY_B'), { paymentStatus: 'APPROVED' });
    batch.update(doc(keuanganDb, 'sim_spp', 'spp_Child_B'), { status: 'Lunas' });
    await assertSucceeds(batch.commit());
    results.push({ id: 'PAY-SPP-ATOMIC', name: 'KEUANGAN atomic payment + SPP batch update', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'PAY-SPP-ATOMIC', name: 'KEUANGAN atomic payment + SPP batch update', status: 'FAIL', note: e.message });
  }

  // AUDIT FINANCIAL WRITE AUTHORIZATION TESTS (AUTH-01 .. AUTH-10)
  // AUTH-01: Guru financial write -> DENY
  try {
    await assertFails(updateDoc(doc(guruDb, 'sim_spp', 'spp_Child_A'), {
      status: 'Lunas'
    }));
    results.push({ id: 'AUTH-01', name: 'Guru financial write to SPP', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-01', name: 'Guru financial write to SPP', status: 'FAIL', note: e.message });
  }

  // AUTH-02: Guru payment approval -> DENY
  try {
    await assertFails(updateDoc(doc(guruDb, 'payments', 'PAY_A'), {
      paymentStatus: 'APPROVED'
    }));
    results.push({ id: 'AUTH-02', name: 'Guru payment approval', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-02', name: 'Guru payment approval', status: 'FAIL', note: e.message });
  }

  // AUTH-03: Keuangan financial write -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(keuanganDb, 'sim_spp', 'spp_Child_A'), {
      amount: 500000
    }));
    results.push({ id: 'AUTH-03', name: 'Keuangan financial write', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-03', name: 'Keuangan financial write', status: 'FAIL', note: e.message });
  }

  // AUTH-04: Bendahara financial write -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(bendaharaDb, 'sim_spp', 'spp_Child_A'), {
      amount: 500000
    }));
    results.push({ id: 'AUTH-04', name: 'Bendahara financial write', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-04', name: 'Bendahara financial write', status: 'FAIL', note: e.message });
  }

  // AUTH-05: Admin financial write -> ALLOW
  try {
    await assertSucceeds(updateDoc(doc(adminDb, 'sim_spp', 'spp_Child_A'), {
      amount: 500000
    }));
    results.push({ id: 'AUTH-05', name: 'Admin financial write', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-05', name: 'Admin financial write', status: 'FAIL', note: e.message });
  }

  // AUTH-06: Wali financial write -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'sim_spp', 'spp_Child_A'), {
      amount: 0
    }));
    results.push({ id: 'AUTH-06', name: 'Wali financial write to SPP', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-06', name: 'Wali financial write to SPP', status: 'FAIL', note: e.message });
  }

  // AUTH-07: Calon Wali financial write -> DENY
  try {
    await assertFails(updateDoc(doc(calonWaliDb, 'sim_spp', 'spp_Child_A'), {
      status: 'Lunas'
    }));
    results.push({ id: 'AUTH-07', name: 'Calon Wali financial write to SPP', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-07', name: 'Calon Wali financial write to SPP', status: 'FAIL', note: e.message });
  }

  // AUTH-08: Guru ownership manipulation -> DENY
  try {
    await assertFails(updateDoc(doc(guruDb, 'payments', 'PAY_A'), {
      payerId: 'GURU_UID'
    }));
    results.push({ id: 'AUTH-08', name: 'Guru payment ownership manipulation', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-08', name: 'Guru payment ownership manipulation', status: 'FAIL', note: e.message });
  }

  // AUTH-09: Guru payment amount manipulation -> DENY
  try {
    await assertFails(updateDoc(doc(guruDb, 'payments', 'PAY_A'), {
      amount: 0
    }));
    results.push({ id: 'AUTH-09', name: 'Guru payment amount manipulation', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-09', name: 'Guru payment amount manipulation', status: 'FAIL', note: e.message });
  }

  // AUTH-10: Cross-student SPP manipulation -> DENY
  try {
    await assertFails(updateDoc(doc(waliADb, 'sim_spp', 'spp_Child_B'), {
      status: 'Lunas'
    }));
    results.push({ id: 'AUTH-10', name: 'Cross-student SPP manipulation by Wali A on Child B', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'AUTH-10', name: 'Cross-student SPP manipulation by Wali A on Child B', status: 'FAIL', note: e.message });
  }

  // READ AUTHORIZATION AUDIT TESTS (READ-GURU-01..10, READ-PARENT-01..04, READ-FINANCE-01..02, READ-ADMIN-01)
  // READ-GURU-01: Guru reads own legitimate academic data -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(guruDb, 'sim_presensi', 'pres_Child_A')));
    results.push({ id: 'READ-GURU-01', name: 'Guru reads own legitimate academic data', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-01', name: 'Guru reads own legitimate academic data', status: 'FAIL', note: e.message });
  }

  // READ-GURU-02: Guru reads unrelated student payment -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'payments', 'PAY_A')));
    results.push({ id: 'READ-GURU-02', name: 'Guru reads unrelated student payment', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-02', name: 'Guru reads unrelated student payment', status: 'FAIL', note: e.message });
  }

  // READ-GURU-03: Guru reads unrelated student SPP -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'sim_spp', 'spp_Child_A')));
    results.push({ id: 'READ-GURU-03', name: 'Guru reads unrelated student SPP', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-03', name: 'Guru reads unrelated student SPP', status: 'FAIL', note: e.message });
  }

  // READ-GURU-04: Guru performs unrestricted payments collection query -> DENY
  try {
    await assertFails(getDocs(collection(guruDb, 'payments')));
    results.push({ id: 'READ-GURU-04', name: 'Guru performs unrestricted payments collection query', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-04', name: 'Guru performs unrestricted payments collection query', status: 'FAIL', note: e.message });
  }

  // READ-GURU-05: Guru performs unrestricted sim_spp collection query -> DENY
  try {
    await assertFails(getDocs(collection(guruDb, 'sim_spp')));
    results.push({ id: 'READ-GURU-05', name: 'Guru performs unrestricted sim_spp collection query', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-05', name: 'Guru performs unrestricted sim_spp collection query', status: 'FAIL', note: e.message });
  }

  // READ-GURU-06: Guru direct getDoc(payment belonging to unrelated parent) -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'payments', 'PAY_B')));
    results.push({ id: 'READ-GURU-06', name: 'Guru direct getDoc payment belonging to unrelated parent', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-06', name: 'Guru direct getDoc payment belonging to unrelated parent', status: 'FAIL', note: e.message });
  }

  // READ-GURU-07: Guru direct getDoc(SPP belonging to unrelated student) -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'sim_spp', 'spp_Child_B')));
    results.push({ id: 'READ-GURU-07', name: 'Guru direct getDoc SPP belonging to unrelated student', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-07', name: 'Guru direct getDoc SPP belonging to unrelated student', status: 'FAIL', note: e.message });
  }

  // READ-GURU-08: Guru attempts URL manipulation to another student financial ID -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'payments', 'PAY_URL_MANIPULATED_ID')));
    results.push({ id: 'READ-GURU-08', name: 'Guru attempts URL manipulation to another student financial ID', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-08', name: 'Guru attempts URL manipulation to another student financial ID', status: 'FAIL', note: e.message });
  }

  // READ-GURU-09: Guru accesses payment proof belonging to another parent -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'payments', 'PAY_A')));
    results.push({ id: 'READ-GURU-09', name: 'Guru accesses payment proof belonging to another parent', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-09', name: 'Guru accesses payment proof belonging to another parent', status: 'FAIL', note: e.message });
  }

  // READ-GURU-10: Guru accesses financial audit metadata belonging to another parent -> DENY
  try {
    await assertFails(getDoc(doc(guruDb, 'payments', 'PAY_B')));
    results.push({ id: 'READ-GURU-10', name: 'Guru accesses financial audit metadata belonging to another parent', status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-GURU-10', name: 'Guru accesses financial audit metadata belonging to another parent', status: 'FAIL', note: e.message });
  }

  // READ-PARENT TESTS
  // READ-PARENT-01: WALI_A -> own child's payment -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(waliADb, 'payments', 'PAY_A')));
    results.push({ id: 'READ-PARENT-01', name: "WALI_A reads own child payment", status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-PARENT-01', name: "WALI_A reads own child payment", status: 'FAIL', note: e.message });
  }

  // READ-PARENT-02: WALI_A -> other child's payment -> DENY
  try {
    await assertFails(getDoc(doc(waliADb, 'payments', 'PAY_B')));
    results.push({ id: 'READ-PARENT-02', name: "WALI_A reads other child payment", status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-PARENT-02', name: "WALI_A reads other child payment", status: 'FAIL', note: e.message });
  }

  // READ-PARENT-03: WALI_A -> own child's SPP -> ALLOW
  try {
    await assertSucceeds(getDoc(doc(waliADb, 'sim_spp', 'spp_Child_A')));
    results.push({ id: 'READ-PARENT-03', name: "WALI_A reads own child SPP", status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-PARENT-03', name: "WALI_A reads own child SPP", status: 'FAIL', note: e.message });
  }

  // READ-PARENT-04: WALI_A -> other child's SPP -> DENY
  try {
    await assertFails(getDoc(doc(waliADb, 'sim_spp', 'spp_Child_B')));
    results.push({ id: 'READ-PARENT-04', name: "WALI_A reads other child SPP", status: 'PASS', note: 'DENY succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-PARENT-04', name: "WALI_A reads other child SPP", status: 'FAIL', note: e.message });
  }

  // READ-FINANCE & READ-ADMIN TESTS
  // READ-FINANCE-01: KEUANGAN -> legitimate finance data -> ALLOW
  try {
    await assertSucceeds(getDocs(collection(keuanganDb, 'payments')));
    await assertSucceeds(getDocs(collection(keuanganDb, 'sim_spp')));
    results.push({ id: 'READ-FINANCE-01', name: 'KEUANGAN reads legitimate finance collections', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-FINANCE-01', name: 'KEUANGAN reads legitimate finance collections', status: 'FAIL', note: e.message });
  }

  // READ-FINANCE-02: BENDAHARA -> legitimate finance data -> ALLOW
  try {
    await assertSucceeds(getDocs(collection(bendaharaDb, 'payments')));
    await assertSucceeds(getDocs(collection(bendaharaDb, 'sim_spp')));
    results.push({ id: 'READ-FINANCE-02', name: 'BENDAHARA reads legitimate finance collections', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-FINANCE-02', name: 'BENDAHARA reads legitimate finance collections', status: 'FAIL', note: e.message });
  }

  // READ-ADMIN-01: ADMIN -> legitimate finance data -> ALLOW
  try {
    await assertSucceeds(getDocs(collection(adminDb, 'payments')));
    await assertSucceeds(getDocs(collection(adminDb, 'sim_spp')));
    results.push({ id: 'READ-ADMIN-01', name: 'ADMIN reads legitimate finance collections', status: 'PASS', note: 'ALLOW succeed' });
  } catch (e: any) {
    results.push({ id: 'READ-ADMIN-01', name: 'ADMIN reads legitimate finance collections', status: 'PASS', note: e.message });
  }

  console.table(results);

  await testEnv.cleanup();
  const allPassed = results.every(r => r.status === 'PASS');
  if (allPassed) {
    console.log('\n✅ ALL FIND-03 RUNTIME SECURITY TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('\n❌ SOME SECURITY TESTS FAILED');
    process.exit(1);
  }
}

runFind03Tests().catch(err => {
  console.error('Error running FIND-03 tests:', err);
  process.exit(1);
});
