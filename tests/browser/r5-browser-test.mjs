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

  // Check for Access Denied Container
  const accessDeniedContainer = await page.$('#r5-access-denied-container');
  if (accessDeniedContainer) {
    results.unauthenticatedTest.accessDeniedContainerFound = true;
    console.log('[VERIFIED] #r5-access-denied-container IS PRESENT in DOM');
  } else {
    console.error('[FAILED] #r5-access-denied-container NOT found');
  }

  // Check for Back to SIM button
  const backButton = await page.$('#btn-r5-back-sim');
  if (backButton) {
    results.unauthenticatedTest.backButtonFound = true;
    const href = await backButton.getAttribute('href');
    console.log(`[VERIFIED] #btn-r5-back-sim found with href: ${href}`);
  } else {
    console.error('[FAILED] #btn-r5-back-sim NOT found');
  }

  // PII Leakage Check in DOM
  const pageContent = await page.content();
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

  console.log(`[TEST RESULT] Unauthenticated Security Gate: ${results.unauthenticatedTest.passed ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
  console.log(JSON.stringify(results, null, 2));
}

runBrowserTest().catch(err => {
  console.error('[FATAL RUNTIME TEST ERROR]', err);
  process.exit(1);
});
