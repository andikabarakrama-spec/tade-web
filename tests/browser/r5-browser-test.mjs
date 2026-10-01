import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function runBrowserTest() {
  console.log('=== STARTING TADE P1-80 BROWSER RUNTIME VERIFICATION ===');
  const results = {
    browserVersion: '',
    unauthenticatedTest: {
      route: '/sim?tab=r5',
      accessDeniedContainerFound: false,
      backButtonFound: false,
      studentDataLeakFound: false,
      parentPhoneLeakFound: false,
      rombelTableLeakFound: false,
      consoleErrors: [],
      networkErrors: [],
      passed: false
    }
  };

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  results.browserVersion = browser.version();
  console.log(`[BROWSER LAUNCHED] Chromium version: ${results.browserVersion}`);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Set initial storage flags to bypass splash screen and intro animation
  await page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r5');
    localStorage.setItem('tade_sim_tab', 'r5');
  });

  // Listen to all console events
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[PAGE UNCAUGHT ERROR] ${err.message}`);
    results.unauthenticatedTest.consoleErrors.push(err.message);
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r5 ...');
  await page.goto('http://localhost:3000/sim?tab=r5', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading spinner to disappear...');
  try {
    await page.waitForFunction(() => !document.body.innerText.includes('Memuat Sistem Informasi...'), { timeout: 20000 });
    console.log('[AUTH RESOLVED] Loading spinner finished');
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading spinner did not finish within 20s');
  }

  const currentBody = await page.evaluate(() => document.body.innerText.slice(0, 600));
  console.log('[BODY AFTER WAIT]', currentBody.replace(/\n+/g, ' '));

  // Check for Access Denied Container (Dual-Defense: either inner container or outer SIM Login gate)
  const accessDeniedContainer = await page.$('#r5-access-denied-container');
  const pageContent = await page.content();
  const fullBodyText = await page.evaluate(() => document.body.innerText);
  const hasSimLoginGate = fullBodyText.includes('Portal SIM Asy-Syifa') || pageContent.includes('Portal SIM Asy-Syifa');
  const hasR5AccessDenied = !!accessDeniedContainer || fullBodyText.includes('Akses Data Kelompok Belajar Dibatasi');

  if (hasSimLoginGate || hasR5AccessDenied) {
    results.unauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R5 Security Boundary Active (Inner: ${hasR5AccessDenied}, Outer SIM: ${hasSimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r5-access-denied-container nor SIM Login Gate found');
  }

  // Check for Back to SIM button or Login button
  const backButton = await page.$('#btn-r5-back-sim');
  const loginButton = await page.$('button:has-text("Masuk ke Sistem"), button:has-text("Login")');
  if (backButton || loginButton || hasSimLoginGate) {
    results.unauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found');
  }

  // PII Leakage Check in DOM
  const hasRombelContainer = await page.$('#r5-rombel-container');
  const hasStudentTable = pageContent.includes('Daftar Seluruh Siswa') || pageContent.includes('Daftar Siswa —');
  const hasParentPhone = pageContent.includes('Kontak Wali') || pageContent.includes('0812') || pageContent.includes('0813');
  const hasNisRoster = pageContent.includes('Nama Lengkap & Panggilan');

  if (hasRombelContainer) {
    console.error('[LEAK DETECTED] #r5-rombel-container rendered for unauthenticated session');
    results.unauthenticatedTest.rombelTableLeakFound = true;
  } else {
    console.log('[VERIFIED] #r5-rombel-container IS NOT in DOM');
  }

  if (hasStudentTable || hasNisRoster) {
    console.error('[LEAK DETECTED] Student roster rendered for unauthenticated session');
    results.unauthenticatedTest.studentDataLeakFound = true;
  } else {
    console.log('[VERIFIED] Zero student roster in DOM');
  }

  if (hasParentPhone) {
    console.error('[LEAK DETECTED] Parent phone / contact rendered for unauthenticated session');
    results.unauthenticatedTest.parentPhoneLeakFound = true;
  } else {
    console.log('[VERIFIED] Zero parent contact / phone numbers in DOM');
  }

  // Screenshot capture as tangible evidence
  const screenshotDir = path.resolve('tests/browser');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  const screenshotPath = path.join(screenshotDir, 'p1-80-r5-unauthenticated-access-denied.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${screenshotPath}`);

  // Test overall verdict for unauthenticated gate
  results.unauthenticatedTest.passed =
    results.unauthenticatedTest.accessDeniedContainerFound &&
    results.unauthenticatedTest.backButtonFound &&
    !results.unauthenticatedTest.rombelTableLeakFound &&
    !results.unauthenticatedTest.studentDataLeakFound &&
    !results.unauthenticatedTest.parentPhoneLeakFound;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R5: ${results.unauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  // ==========================================
  // P1-83: R19 BROWSER RUNTIME VERIFICATION
  // ==========================================
  console.log('\n=== STARTING TADE P1-83 R19 BROWSER RUNTIME VERIFICATION ===');
  results.r19UnauthenticatedTest = {
    route: '/sim?tab=r19',
    accessDeniedContainerFound: false,
    backButtonFound: false,
    collectionGridLeakFound: false,
    collectionTableLeakFound: false,
    mutationFormLeakFound: false,
    studentPiiLeakFound: false,
    consoleErrors: [],
    pageErrors: [],
    passed: false
  };

  const r19Page = await context.newPage();

  r19Page.on('console', msg => {
    if (msg.type() === 'error') {
      results.r19UnauthenticatedTest.consoleErrors.push(msg.text());
    }
  });

  r19Page.on('pageerror', err => {
    results.r19UnauthenticatedTest.pageErrors.push(err.message);
  });

  // Track network requests to verify no sensitive student endpoints queried
  const interceptedRequests = [];
  r19Page.on('request', req => {
    interceptedRequests.push(req.url());
  });

  await r19Page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r19');
    localStorage.setItem('tade_sim_tab', 'r19');
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r19 ...');
  await r19Page.goto('http://localhost:3000/sim?tab=r19', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading state on R19...');
  try {
    await r19Page.waitForFunction(() => !document.body.innerText.includes('Memuat Sistem Informasi...'), { timeout: 20000 });
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading state on R19 did not finish in 20s');
  }

  // 1. Check for Access Denied Container (Dual-Defense: either inner container or outer SIM Login gate)
  const r19AccessDenied = await r19Page.$('#r19-access-denied-container');
  const r19PageContent = await r19Page.content();
  const r19BodyText = await r19Page.evaluate(() => document.body.innerText);
  const hasR19SimLoginGate = r19BodyText.includes('Portal SIM Asy-Syifa') || r19PageContent.includes('Portal SIM Asy-Syifa');
  const hasR19AccessDenied = !!r19AccessDenied || r19BodyText.includes('Akses Terbatas — Otorisasi Diperlukan');

  if (hasR19SimLoginGate || hasR19AccessDenied) {
    results.r19UnauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R19 Security Boundary Active (Inner: ${hasR19AccessDenied}, Outer SIM: ${hasR19SimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r19-access-denied-container nor SIM Login Gate found');
  }

  // 2. Check for Back Button or Login Trigger
  const r19BackButton = await r19Page.$('#btn-r19-back-sim');
  const r19LoginButton = await r19Page.$('button:has-text("Masuk ke Sistem"), button:has-text("Login")');
  if (r19BackButton || r19LoginButton || hasR19SimLoginGate) {
    results.r19UnauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM for R19 (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found for R19');
  }

  // 3. Check for Collection Grid Absence
  const r19Grid = await r19Page.$('#r19-collection-grid');
  if (r19Grid) {
    results.r19UnauthenticatedTest.collectionGridLeakFound = true;
    console.error('[LEAK DETECTED] #r19-collection-grid rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r19-collection-grid IS NOT in DOM (PASS)');
  }

  // 4. Check for Collection Table Absence
  const r19Table = await r19Page.$('#r19-collection-table');
  if (r19Table) {
    results.r19UnauthenticatedTest.collectionTableLeakFound = true;
    console.error('[LEAK DETECTED] #r19-collection-table rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r19-collection-table IS NOT in DOM (PASS)');
  }

  // 5. Check for Mutation Form Absence
  const r19Form = await r19Page.$('#r19-modal-form');
  if (r19Form) {
    results.r19UnauthenticatedTest.mutationFormLeakFound = true;
    console.error('[LEAK DETECTED] Mutation form rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Operational mutation form IS NOT in DOM (PASS)');
  }

  // 6. Check for Student PII in DOM
  const hasStudentPii =
    r19PageContent.includes('NISN') ||
    r19PageContent.includes('NIK Siswa') ||
    r19PageContent.includes('Nama Lengkap & Panggilan') ||
    r19PageContent.includes('Kontak Wali');

  if (hasStudentPii) {
    results.r19UnauthenticatedTest.studentPiiLeakFound = true;
    console.error('[LEAK DETECTED] Student PII detected in DOM for R19');
  } else {
    console.log('[VERIFIED] Zero Student PII in DOM (PASS)');
  }

  // Screenshot capture for R19
  const r19ScreenshotPath = path.join(screenshotDir, 'p1-83-r19-unauthenticated-access-denied.png');
  await r19Page.screenshot({ path: r19ScreenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${r19ScreenshotPath}`);

  results.r19UnauthenticatedTest.passed =
    results.r19UnauthenticatedTest.accessDeniedContainerFound &&
    results.r19UnauthenticatedTest.backButtonFound &&
    !results.r19UnauthenticatedTest.collectionGridLeakFound &&
    !results.r19UnauthenticatedTest.collectionTableLeakFound &&
    !results.r19UnauthenticatedTest.mutationFormLeakFound &&
    !results.r19UnauthenticatedTest.studentPiiLeakFound &&
    results.r19UnauthenticatedTest.pageErrors.length === 0;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R19: ${results.r19UnauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
  console.log(JSON.stringify(results, null, 2));
}

runBrowserTest().catch(err => {
  console.error('[FATAL RUNTIME TEST ERROR]', err);
  process.exit(1);
});
