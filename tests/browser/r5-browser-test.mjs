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
  const hasSimLoginGate =
    fullBodyText.includes('Login Super Admin') ||
    fullBodyText.includes('Buka Portal') ||
    fullBodyText.includes('Portal SIM') ||
    fullBodyText.includes('SIM TK ASY SYIFA') ||
    pageContent.includes('Portal SIM') ||
    pageContent.includes('Login Super Admin');
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
    await r19Page.waitForFunction(() => document.body.innerText.length > 50 && !document.body.innerText.includes('Memuat Sistem Informasi...'), { timeout: 20000 });
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading state on R19 did not finish in 20s');
  }

  // 1. Check for Access Denied Container (Dual-Defense: either inner container or outer SIM Login gate)
  const r19AccessDenied = await r19Page.$('#r19-access-denied-container');
  const r19PageContent = await r19Page.content();
  const r19BodyText = await r19Page.evaluate(() => document.body.innerText);
  console.log('[R19 BODY AFTER WAIT]', r19BodyText.slice(0, 300).replace(/\n+/g, ' '));
  console.log('[R19 HTML HAS PORTAL]', r19PageContent.includes('Portal SIM Asy-Syifa'), 'HTML length:', r19PageContent.length);
  const hasR19SimLoginGate =
    r19BodyText.includes('Login Super Admin') ||
    r19BodyText.includes('Buka Portal') ||
    r19BodyText.includes('Portal SIM') ||
    r19BodyText.includes('SIM TK ASY SYIFA') ||
    r19PageContent.includes('Portal SIM') ||
    r19PageContent.includes('Login Super Admin');
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

  // ==========================================
  // P1-84: R18 BROWSER RUNTIME VERIFICATION
  // ==========================================
  console.log('\n=== STARTING TADE P1-84 R18 BROWSER RUNTIME VERIFICATION ===');
  results.r18UnauthenticatedTest = {
    route: '/sim?tab=r18',
    accessDeniedContainerFound: false,
    backButtonFound: false,
    inventoryContainerLeakFound: false,
    inventorySearchLeakFound: false,
    mutationFormLeakFound: false,
    consoleErrors: [],
    pageErrors: [],
    passed: false
  };

  const r18Page = await context.newPage();

  r18Page.on('console', msg => {
    if (msg.type() === 'error') {
      results.r18UnauthenticatedTest.consoleErrors.push(msg.text());
    }
  });

  r18Page.on('pageerror', err => {
    results.r18UnauthenticatedTest.pageErrors.push(err.message);
  });

  await r18Page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r18');
    localStorage.setItem('tade_sim_tab', 'r18');
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r18 ...');
  await r18Page.goto('http://localhost:3000/sim?tab=r18', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading state on R18...');
  try {
    await r18Page.waitForFunction(() => document.body.innerText.length > 50 && !document.body.innerText.includes('Memuat Sistem Informasi...'), { timeout: 20000 });
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading state on R18 did not finish in 20s');
  }

  // 1. Check for Access Denied Container (Dual-Defense: either inner container or outer SIM Login gate)
  const r18AccessDenied = await r18Page.$('#r18-access-denied-container');
  const r18PageContent = await r18Page.content();
  const r18BodyText = await r18Page.evaluate(() => document.body.innerText);
  console.log('[R18 BODY AFTER WAIT]', r18BodyText.slice(0, 300).replace(/\n+/g, ' '));
  console.log('[R18 HTML HAS PORTAL]', r18PageContent.includes('Portal SIM Asy-Syifa'), 'HTML length:', r18PageContent.length);
  const hasR18SimLoginGate =
    r18BodyText.includes('Login Super Admin') ||
    r18BodyText.includes('Buka Portal') ||
    r18BodyText.includes('Portal SIM') ||
    r18BodyText.includes('SIM TK ASY SYIFA') ||
    r18PageContent.includes('Portal SIM') ||
    r18PageContent.includes('Login Super Admin');
  const hasR18AccessDenied = !!r18AccessDenied || r18BodyText.includes('Akses Terbatas — Otorisasi Diperlukan');

  if (hasR18SimLoginGate || hasR18AccessDenied) {
    results.r18UnauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R18 Security Boundary Active (Inner: ${hasR18AccessDenied}, Outer SIM: ${hasR18SimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r18-access-denied-container nor SIM Login Gate found');
  }

  // 2. Check for Back Button or Login Trigger
  const r18BackButton = await r18Page.$('#btn-r18-back-sim');
  const r18LoginButton = await r18Page.$('button:has-text("Masuk ke Sistem"), button:has-text("Login")');
  if (r18BackButton || r18LoginButton || hasR18SimLoginGate) {
    results.r18UnauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM for R18 (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found for R18');
  }

  // 3. Check for Inventory Container Absence
  const r18Container = await r18Page.$('#r18-inventaris-sarpras-container');
  if (r18Container) {
    results.r18UnauthenticatedTest.inventoryContainerLeakFound = true;
    console.error('[LEAK DETECTED] #r18-inventaris-sarpras-container rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r18-inventaris-sarpras-container IS NOT in DOM (PASS)');
  }

  // 4. Check for Inventory Search Absence
  const r18Search = await r18Page.$('#input-search-inventory');
  if (r18Search) {
    results.r18UnauthenticatedTest.inventorySearchLeakFound = true;
    console.error('[LEAK DETECTED] #input-search-inventory rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #input-search-inventory IS NOT in DOM (PASS)');
  }

  // 5. Check for Mutation Form Absence
  const r18Form = await r18Page.$('#modal-inventory-form-container');
  if (r18Form) {
    results.r18UnauthenticatedTest.mutationFormLeakFound = true;
    console.error('[LEAK DETECTED] Modal inventory form rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Operational mutation form IS NOT in DOM (PASS)');
  }

  // Screenshot capture for R18
  const r18ScreenshotPath = path.join(screenshotDir, 'p1-84-r18-unauthenticated-access-denied.png');
  await r18Page.screenshot({ path: r18ScreenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${r18ScreenshotPath}`);

  results.r18UnauthenticatedTest.passed =
    results.r18UnauthenticatedTest.accessDeniedContainerFound &&
    results.r18UnauthenticatedTest.backButtonFound &&
    !results.r18UnauthenticatedTest.inventoryContainerLeakFound &&
    !results.r18UnauthenticatedTest.inventorySearchLeakFound &&
    !results.r18UnauthenticatedTest.mutationFormLeakFound &&
    results.r18UnauthenticatedTest.pageErrors.length === 0;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R18: ${results.r18UnauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  // ==========================================
  // P1-85: R21 BROWSER RUNTIME VERIFICATION
  // ==========================================
  console.log('\n=== STARTING TADE P1-85 R21 BROWSER RUNTIME VERIFICATION ===');
  results.r21UnauthenticatedTest = {
    route: '/sim?tab=r21',
    accessDeniedContainerFound: false,
    backButtonFound: false,
    ekstrakurikulerContainerLeakFound: false,
    rosterModeToggleLeakFound: false,
    studentPiiLeakFound: false,
    consoleErrors: [],
    pageErrors: [],
    passed: false
  };

  const r21Page = await context.newPage();

  r21Page.on('console', msg => {
    if (msg.type() === 'error') {
      results.r21UnauthenticatedTest.consoleErrors.push(msg.text());
    }
  });

  r21Page.on('pageerror', err => {
    results.r21UnauthenticatedTest.pageErrors.push(err.message);
  });

  await r21Page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r21');
    localStorage.setItem('tade_sim_tab', 'r21');
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r21 ...');
  await r21Page.goto('http://localhost:3000/sim?tab=r21', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading state on R21...');
  try {
    await r21Page.waitForFunction(() => document.body.innerText.length > 50 && !document.body.innerText.includes('Memuat Sistem Informasi...'), { timeout: 20000 });
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading spinner did not finish within 20s for R21');
  }

  const r21BodyText = await r21Page.evaluate(() => document.body.innerText);
  const r21PageContent = await r21Page.content();
  console.log('[R21 BODY AFTER WAIT]', r21BodyText.slice(0, 300).replace(/\n+/g, ' '));

  // 1. Check for Access Denied Boundary
  const r21AccessDenied = await r21Page.$('#r21-access-denied-container');
  const hasR21SimLoginGate =
    r21BodyText.includes('Login Super Admin') ||
    r21BodyText.includes('Buka Portal') ||
    r21BodyText.includes('Portal SIM') ||
    r21PageContent.includes('Portal SIM') ||
    r21PageContent.includes('Login Super Admin');
  const hasR21AccessDenied = !!r21AccessDenied || r21BodyText.includes('Akses Terbatas — Otorisasi Diperlukan');

  if (hasR21SimLoginGate || hasR21AccessDenied) {
    results.r21UnauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R21 Security Boundary Active (Inner: ${hasR21AccessDenied}, Outer SIM: ${hasR21SimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r21-access-denied-container nor SIM Login Gate found');
  }

  // 2. Check for Back Button or Login Trigger
  const r21BackButton = await r21Page.$('#btn-r21-back-sim');
  const r21LoginButton = await r21Page.$('button:has-text("Masuk ke Sistem"), button:has-text("Login")');
  if (r21BackButton || r21LoginButton || hasR21SimLoginGate) {
    results.r21UnauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM for R21 (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found for R21');
  }

  // 3. Check for Ekstrakurikuler Container Absence
  const r21Container = await r21Page.$('#r21-ekstrakurikuler-container');
  if (r21Container) {
    results.r21UnauthenticatedTest.ekstrakurikulerContainerLeakFound = true;
    console.error('[LEAK DETECTED] #r21-ekstrakurikuler-container rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r21-ekstrakurikuler-container IS NOT in DOM (PASS)');
  }

  // 4. Check for Roster View Toggle Absence
  const r21RosterToggle = await r21Page.$('#r21-view-mode-roster');
  if (r21RosterToggle) {
    results.r21UnauthenticatedTest.rosterModeToggleLeakFound = true;
    console.error('[LEAK DETECTED] #r21-view-mode-roster rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r21-view-mode-roster IS NOT in DOM (PASS)');
  }

  // 5. Check for Student PII in DOM
  const hasR21StudentPii =
    r21PageContent.includes('No. Induk (NIS)') ||
    r21PageContent.includes('Nama Lengkap Siswa') ||
    r21PageContent.includes('Nama Orang Tua') ||
    r21PageContent.includes('Daftar Siswa Aktif Terhubung SSOT');

  if (hasR21StudentPii) {
    results.r21UnauthenticatedTest.studentPiiLeakFound = true;
    console.error('[LEAK DETECTED] Student PII detected in DOM for R21');
  } else {
    console.log('[VERIFIED] Zero Student / Parent PII in DOM for R21 (PASS)');
  }

  // Screenshot capture for R21
  const r21ScreenshotPath = path.join(screenshotDir, 'p1-85-r21-unauthenticated-access-denied.png');
  await r21Page.screenshot({ path: r21ScreenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${r21ScreenshotPath}`);

  results.r21UnauthenticatedTest.passed =
    results.r21UnauthenticatedTest.accessDeniedContainerFound &&
    results.r21UnauthenticatedTest.backButtonFound &&
    !results.r21UnauthenticatedTest.ekstrakurikulerContainerLeakFound &&
    !results.r21UnauthenticatedTest.rosterModeToggleLeakFound &&
    !results.r21UnauthenticatedTest.studentPiiLeakFound &&
    results.r21UnauthenticatedTest.pageErrors.length === 0;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R21: ${results.r21UnauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  // ==========================================
  // P1-86: R29 BROWSER RUNTIME VERIFICATION
  // ==========================================
  console.log('\n=== STARTING TADE P1-86 R29 BROWSER RUNTIME VERIFICATION ===');
  results.r29UnauthenticatedTest = {
    route: '/sim?tab=r29',
    accessDeniedContainerFound: false,
    backButtonFound: false,
    portalContainerLeakFound: false,
    childSelectorLeakFound: false,
    childDataLeakFound: false,
    consoleErrors: [],
    pageErrors: [],
    passed: false
  };

  const r29Page = await context.newPage();

  r29Page.on('console', msg => {
    if (msg.type() === 'error') {
      results.r29UnauthenticatedTest.consoleErrors.push(msg.text());
    }
  });

  r29Page.on('pageerror', err => {
    results.r29UnauthenticatedTest.pageErrors.push(err.message);
  });

  await r29Page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r29');
    localStorage.setItem('tade_sim_tab', 'r29');
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r29 ...');
  await r29Page.goto('http://localhost:3000/sim?tab=r29', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading state on R29...');
  try {
    await r29Page.waitForFunction(
      () => document.body.innerText.length > 50 && !document.body.innerText.includes('Memuat Sistem Informasi...'),
      { timeout: 20000 }
    );
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading spinner did not finish within 20s for R29');
  }

  const r29BodyText = await r29Page.evaluate(() => document.body.innerText);
  const r29PageContent = await r29Page.content();
  console.log('[R29 BODY AFTER WAIT]', r29BodyText.slice(0, 300).replace(/\n+/g, ' '));

  // 1. Check for Access Denied Boundary
  const r29AccessDenied = await r29Page.$('#r29-access-denied-container');
  const hasR29SimLoginGate =
    r29BodyText.includes('Login Super Admin') ||
    r29BodyText.includes('Buka Portal') ||
    r29BodyText.includes('Portal SIM') ||
    r29PageContent.includes('Portal SIM') ||
    r29PageContent.includes('Login Super Admin');
  const hasR29AccessDenied = !!r29AccessDenied || r29BodyText.includes('Akses Terbatas — Portal Khusus Wali Murid');

  if (hasR29SimLoginGate || hasR29AccessDenied) {
    results.r29UnauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R29 Security Boundary Active (Inner: ${hasR29AccessDenied}, Outer SIM: ${hasR29SimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r29-access-denied-container nor SIM Login Gate found');
  }

  // 2. Check for Back Button or Login Trigger
  const r29BackButton = await r29Page.$('#btn-r29-back-sim');
  const r29LoginButton = await r29Page.$('button:has-text("Masuk ke Sistem"), button:has-text("Login")');
  if (r29BackButton || r29LoginButton || hasR29SimLoginGate) {
    results.r29UnauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM for R29 (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found for R29');
  }

  // 3. Check for Portal Container Absence
  const r29Container = await r29Page.$('#r29-portal-wali-container');
  if (r29Container) {
    results.r29UnauthenticatedTest.portalContainerLeakFound = true;
    console.error('[LEAK DETECTED] #r29-portal-wali-container rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r29-portal-wali-container IS NOT in DOM (PASS)');
  }

  // 4. Check for Child Selector Absence
  const hasChildSelector =
    r29PageContent.includes('Ananda Terdaftar') ||
    r29PageContent.includes('Pilih Ananda:');
  if (hasChildSelector) {
    results.r29UnauthenticatedTest.childSelectorLeakFound = true;
    console.error('[LEAK DETECTED] Child Selector rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Child Selector IS NOT in DOM (PASS)');
  }

  // 5. Check for Student PII in DOM
  const hasR29ChildData =
    r29PageContent.includes('Lihat E-Rapor PAUD') ||
    r29PageContent.includes('Presensi Ananda') ||
    r29PageContent.includes('Buku Penghubung') ||
    r29PageContent.includes('Status SPP Bulanan');

  if (hasR29ChildData) {
    results.r29UnauthenticatedTest.childDataLeakFound = true;
    console.error('[LEAK DETECTED] Child action links detected in DOM for R29 unauthenticated session');
  } else {
    console.log('[VERIFIED] Zero Child action links / PII in DOM for R29 (PASS)');
  }

  // Screenshot capture for R29
  const r29ScreenshotPath = path.join(screenshotDir, 'p1-86-r29-unauthenticated-access-denied.png');
  await r29Page.screenshot({ path: r29ScreenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${r29ScreenshotPath}`);

  results.r29UnauthenticatedTest.passed =
    results.r29UnauthenticatedTest.accessDeniedContainerFound &&
    results.r29UnauthenticatedTest.backButtonFound &&
    !results.r29UnauthenticatedTest.portalContainerLeakFound &&
    !results.r29UnauthenticatedTest.childSelectorLeakFound &&
    !results.r29UnauthenticatedTest.childDataLeakFound &&
    results.r29UnauthenticatedTest.pageErrors.length === 0;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R29: ${results.r29UnauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  // ==========================================
  // P1-88: R22 CMS WEBSITE BROWSER RUNTIME VERIFICATION
  // ==========================================
  console.log('\n=== STARTING TADE P1-88 R22 BROWSER RUNTIME VERIFICATION ===');
  results.r22UnauthenticatedTest = {
    route: '/sim?tab=r22',
    accessDeniedContainerFound: false,
    backButtonFound: false,
    cmsContainerLeakFound: false,
    addArticleLeakFound: false,
    addEventLeakFound: false,
    saveHomepageLeakFound: false,
    consoleErrors: [],
    pageErrors: []
  };

  const r22Page = await context.newPage();

  r22Page.on('console', msg => {
    if (msg.type() === 'error') {
      results.r22UnauthenticatedTest.consoleErrors.push(msg.text());
    }
  });

  r22Page.on('pageerror', err => {
    results.r22UnauthenticatedTest.pageErrors.push(err.message);
  });

  await r22Page.addInitScript(() => {
    sessionStorage.setItem('tade_splash_shown_v971', 'true');
    sessionStorage.setItem('tade_opening_seen', 'true');
    sessionStorage.setItem('tade_sim_tab', 'r22');
    localStorage.setItem('tade_sim_tab', 'r22');
  });

  console.log('[NAVIGATING] http://localhost:3000/sim?tab=r22 ...');
  await r22Page.goto('http://localhost:3000/sim?tab=r22', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('[WAITING] Waiting for auth loading state on R22...');
  try {
    await r22Page.waitForFunction(
      () => document.body.innerText.length > 50 && !document.body.innerText.includes('Memuat Sistem Informasi...'),
      { timeout: 20000 }
    );
  } catch (e) {
    console.warn('[AUTH TIMEOUT] Loading spinner did not finish within 20s for R22');
  }

  const r22BodyText = await r22Page.evaluate(() => document.body.innerText);
  const r22PageContent = await r22Page.content();
  console.log('[R22 BODY AFTER WAIT]', r22BodyText.slice(0, 300).replace(/\n+/g, ' '));

  // 1. Check for Access Denied Boundary
  const r22AccessDenied = await r22Page.$('#r22-access-denied-container');
  const hasR22SimLoginGate =
    r22BodyText.includes('Login Super Admin') ||
    r22BodyText.includes('Buka Portal') ||
    r22BodyText.includes('Portal SIM') ||
    r22PageContent.includes('Portal SIM') ||
    r22PageContent.includes('Login Super Admin');
  const hasR22AccessDenied = !!r22AccessDenied || r22BodyText.includes('Akses Terbatas — CMS Website Resmi');

  if (hasR22SimLoginGate || hasR22AccessDenied) {
    results.r22UnauthenticatedTest.accessDeniedContainerFound = true;
    console.log(`[VERIFIED] R22 Security Boundary Active (Inner: ${hasR22AccessDenied}, Outer SIM: ${hasR22SimLoginGate}) (PASS)`);
  } else {
    console.error('[FAILED] Neither #r22-access-denied-container nor SIM Login Gate found');
  }

  // 2. Check for Safe Navigation
  const r22BackBtn = await r22Page.$('#btn-r22-back-sim');
  const hasR22LoginTrigger =
    !!r22BackBtn ||
    (await r22Page.$('button:has-text("Login")')) ||
    (await r22Page.$('button:has-text("Portal")')) ||
    (await r22Page.$('button:has-text("Masuk")'));

  if (hasR22LoginTrigger) {
    results.r22UnauthenticatedTest.backButtonFound = true;
    console.log('[VERIFIED] Safe navigation / Login trigger found in DOM for R22 (PASS)');
  } else {
    console.error('[FAILED] Safe navigation trigger NOT found for R22');
  }

  // 3. Check for CMS Container Absence
  const r22CmsContainer = await r22Page.$('#r22-cms-container');
  if (r22CmsContainer) {
    results.r22UnauthenticatedTest.cmsContainerLeakFound = true;
    console.error('[LEAK DETECTED] #r22-cms-container rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] #r22-cms-container IS NOT in DOM (PASS)');
  }

  // 4. Check for Add Article Button Absence
  const r22AddArticle = await r22Page.$('#btn-r22-add-article');
  if (r22AddArticle || r22BodyText.includes('Tulis Berita Baru')) {
    results.r22UnauthenticatedTest.addArticleLeakFound = true;
    console.error('[LEAK DETECTED] Add Article button rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Add Article button IS NOT in DOM (PASS)');
  }

  // 5. Check for Add Event Button Absence
  const r22AddEvent = await r22Page.$('#btn-r22-add-event');
  if (r22AddEvent || r22BodyText.includes('Tambah Agenda Baru')) {
    results.r22UnauthenticatedTest.addEventLeakFound = true;
    console.error('[LEAK DETECTED] Add Event button rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Add Event button IS NOT in DOM (PASS)');
  }

  // 6. Check for Save Homepage Button Absence
  const r22SaveHomepage = await r22Page.$('#btn-r22-save-homepage');
  if (r22SaveHomepage || r22BodyText.includes('Simpan Perubahan Hero Homepage')) {
    results.r22UnauthenticatedTest.saveHomepageLeakFound = true;
    console.error('[LEAK DETECTED] Save Homepage button rendered for unauthenticated session');
  } else {
    console.log('[VERIFIED] Save Homepage button IS NOT in DOM (PASS)');
  }

  // Screenshot capture for R22
  const r22ScreenshotPath = path.join(screenshotDir, 'p1-88-r22-unauthenticated-access-denied.png');
  await r22Page.screenshot({ path: r22ScreenshotPath, fullPage: true });
  console.log(`[SCREENSHOT CAPTURED] ${r22ScreenshotPath}`);

  results.r22UnauthenticatedTest.passed =
    results.r22UnauthenticatedTest.accessDeniedContainerFound &&
    results.r22UnauthenticatedTest.backButtonFound &&
    !results.r22UnauthenticatedTest.cmsContainerLeakFound &&
    !results.r22UnauthenticatedTest.addArticleLeakFound &&
    !results.r22UnauthenticatedTest.addEventLeakFound &&
    !results.r22UnauthenticatedTest.saveHomepageLeakFound &&
    results.r22UnauthenticatedTest.pageErrors.length === 0;

  console.log(`[TEST RESULT] Unauthenticated Security Gate R22: ${results.r22UnauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
  console.log(JSON.stringify(results, null, 2));
}

runBrowserTest().catch(err => {
  console.error('[FATAL RUNTIME TEST ERROR]', err);
  process.exit(1);
});
