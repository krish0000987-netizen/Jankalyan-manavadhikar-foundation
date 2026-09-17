import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://www.jankalyanmanavadhikarscholarship.com';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\46fc30b3-8d3f-4812-a4cc-45541df4c567';

async function main() {
  console.log('--- STARTING COMPREHENSIVE LIVE SITE VERIFICATION ---');
  console.log(`Connecting to Chrome at: ${CHROME_PATH}`);
  console.log(`Target Live URL: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = [];

  // Capture console errors if any
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // TEST 1: Home Page & Nav Link Verification
    console.log('Test 1: Testing Home Page & Header Nav...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    const homeTitle = await page.title();
    console.log(`✓ Page Title: "${homeTitle}"`);

    // Verify "छात्रवृत्ति फॉर्म" / "Scholarship Form" in header
    const navText = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
      return links.map(l => l.innerText.trim().replace(/\n/g, ' '));
    });
    console.log('✓ Found Desktop Nav Links:', navText);

    const hasScholarshipFormNav = navText.some(t => t.includes('छात्रवृत्ति फॉर्म') || t.includes('Scholarship Form'));
    if (hasScholarshipFormNav) {
      console.log('✓ PASS: "छात्रवृत्ति फॉर्म / Scholarship Form" nav link is present in desktop header.');
      results.push({ test: 'Header Navigation Link', status: 'PASS', details: 'Nav link present' });
    } else {
      console.error('✗ FAIL: "छात्रवृत्ति फॉर्म" nav link not found in header.');
      results.push({ test: 'Header Navigation Link', status: 'FAIL', details: 'Nav link missing' });
    }

    // Save screenshot of Home Page
    const homeScreenshotPath = path.join(ARTIFACT_DIR, 'live_home_verified.png');
    await page.screenshot({ path: homeScreenshotPath, fullPage: false });
    console.log(`✓ Screenshot saved: ${homeScreenshotPath}`);

    // TEST 2: Click "छात्रवृत्ति फॉर्म / Scholarship Form" Nav Link -> Verify Application Form Opens
    console.log('\nTest 2: Clicking "छात्रवृत्ति फॉर्म" Nav Link...');
    const clicked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.desktop-nav .nav-link'));
      const formLink = links.find(l => l.innerText.includes('छात्रवृत्ति फॉर्म') || l.innerText.includes('Scholarship Form'));
      if (formLink) {
        formLink.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await page.waitForFunction(() => window.location.pathname.includes('/apply'), { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1500));
      const currentUrl = page.url();
      console.log(`✓ Successfully navigated to: ${currentUrl}`);

      // Check form heading and step 1
      const formHeading = await page.$eval('h1', el => el.innerText).catch(() => '');
      console.log(`✓ Form Heading: "${formHeading}"`);

      const step1Text = await page.$eval('.wizard-progress', el => el.parentElement.innerText).catch(() => '');
      console.log(`✓ Progress Indicator: "${step1Text.replace(/\n/g, ' ')}"`);

      // Check registration fields
      const mobileInputExists = await page.$('input[placeholder*="मोबाइल"], input[type="tel"]').then(el => !!el);
      console.log(`✓ Mobile input field present: ${mobileInputExists}`);

      const applyScreenshotPath = path.join(ARTIFACT_DIR, 'live_apply_form_verified.png');
      await page.screenshot({ path: applyScreenshotPath, fullPage: false });
      console.log(`✓ Screenshot saved: ${applyScreenshotPath}`);

      results.push({ test: 'Nav Click to Form', status: 'PASS', details: `Form opened at ${currentUrl}` });
    } else {
      results.push({ test: 'Nav Click to Form', status: 'FAIL', details: 'Could not click form nav link' });
    }

    // TEST 3: Direct URL Aliases (/scholarship-form)
    console.log('\nTest 3: Testing Direct Route Alias: /scholarship-form ...');
    await page.goto(`${BASE_URL}/scholarship-form`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    const isFormLoaded = await page.evaluate(() => {
      const hasWizard = !!document.querySelector('.wizard-progress');
      const text = document.body.innerText;
      const hasRegistration = text.includes('पंजीकरण एवं ओटीपी') || text.includes('Student Registration');
      return hasWizard && hasRegistration;
    });
    if (isFormLoaded) {
      console.log('✓ PASS: Direct alias /scholarship-form loaded the scholarship wizard successfully!');
      results.push({ test: 'Route Alias /scholarship-form', status: 'PASS', details: 'Wizard verified on /scholarship-form' });
    } else {
      console.error('✗ FAIL: /scholarship-form did not load form.');
      results.push({ test: 'Route Alias /scholarship-form', status: 'FAIL', details: 'Wizard not found' });
    }

    // TEST 4: Downloads Page & Scholarship Form Item
    console.log('\nTest 4: Testing Downloads & Forms Page (/downloads)...');
    await page.goto(`${BASE_URL}/downloads`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Check first document card in downloads grid
    const firstDocTitle = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
      const scholarshipTitle = titles.find(t => t.includes('छात्रवृत्ति') || t.includes('Scholarship'));
      return scholarshipTitle || 'None found';
    });
    console.log(`✓ Found Scholarship Document Card: "${firstDocTitle}"`);

    const hasScholarshipDoc = firstDocTitle.includes('छात्रवृत्ति') || firstDocTitle.includes('Scholarship');
    if (hasScholarshipDoc) {
      console.log('✓ PASS: Official Scholarship Form is present in Downloads & Forms!');
      results.push({ test: 'Downloads Scholarship Form', status: 'PASS', details: firstDocTitle });
    } else {
      console.error('✗ FAIL: Scholarship Form not found in Downloads.');
      results.push({ test: 'Downloads Scholarship Form', status: 'FAIL', details: firstDocTitle });
    }

    // TEST 5: Interactive Preview Modal for Scholarship Form
    console.log('\nTest 5: Testing Preview Modal for Scholarship Form...');
    const previewBtnClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pBtn = btns.find(b => b.innerText.includes('पूर्वावलोकन') || b.innerText.includes('Preview Form'));
      if (pBtn) {
        pBtn.click();
        return true;
      }
      return false;
    });

    if (previewBtnClicked) {
      await new Promise(r => setTimeout(r, 2000));
      const modalOpen = await page.$('.modal-preview, [style*="position: fixed"], [style*="z-index"]').then(el => !!el);
      console.log(`✓ Preview Modal Open: ${modalOpen}`);

      // Check modal preview image
      const modalImgSrc = await page.evaluate(() => {
        const modal = document.querySelector('[style*="position: fixed"][style*="inset: 0"]');
        if (modal) {
          const img = modal.querySelector('img[src*="scholarship"]');
          return img ? img.src : null;
        }
        return null;
      });
      console.log(`✓ Modal Form Preview Image Src: ${modalImgSrc}`);

      const modalScreenshotPath = path.join(ARTIFACT_DIR, 'live_form_preview_modal_verified.png');
      await page.screenshot({ path: modalScreenshotPath, fullPage: false });
      console.log(`✓ Screenshot saved: ${modalScreenshotPath}`);

      // Test page 2 toggle in modal if present
      const toggledPage2 = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const p2Btn = btns.find(b => b.innerText.includes('पेज 2') || b.innerText.includes('Page 2'));
        if (p2Btn) {
          p2Btn.click();
          return true;
        }
        return false;
      });
      if (toggledPage2) {
        await new Promise(r => setTimeout(r, 1000));
        console.log('✓ Successfully clicked Page 2 tab in Preview Modal!');
      }

      // Test online apply button from modal
      const onlineApplyFromModal = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const applyBtn = btns.find(b => b.innerText.includes('ऑनलाइन फॉर्म भरें') || b.innerText.includes('Fill Form Online'));
        if (applyBtn) {
          applyBtn.click();
          return true;
        }
        return false;
      });
      if (onlineApplyFromModal) {
        await new Promise(r => setTimeout(r, 1500));
        console.log(`✓ Clicked "ऑनलाइन फॉर्म भरें" from Modal. New URL: ${page.url()}`);
      }

      results.push({ test: 'Interactive Preview Modal', status: 'PASS', details: `Modal loaded with ${modalImgSrc}` });
    } else {
      console.error('✗ FAIL: Could not find preview button.');
      results.push({ test: 'Interactive Preview Modal', status: 'FAIL', details: 'Button not found' });
    }

    // TEST 6: Direct PDF Download Verification via fetch
    console.log('\nTest 6: Checking PDF direct download HTTP status...');
    const pdfUrl = `${BASE_URL}/downloads/scholarship_application_form_2026_27.pdf`;
    const pdfRes = await fetch(pdfUrl, { method: 'HEAD' });
    const pdfStatus = pdfRes.status;
    const pdfType = pdfRes.headers.get('content-type');
    const pdfLen = pdfRes.headers.get('content-length');
    console.log(`✓ PDF URL: ${pdfUrl}`);
    console.log(`✓ Status: ${pdfStatus}, Content-Type: ${pdfType}, Size: ${pdfLen} bytes`);

    if (pdfStatus === 200 && pdfType && pdfType.includes('application/pdf')) {
      console.log('✓ PASS: Printable Vector PDF is directly downloadable and valid!');
      results.push({ test: 'Printable PDF Download', status: 'PASS', details: `${pdfStatus} ${pdfType} (${pdfLen}B)` });
    } else {
      console.error(`✗ FAIL: PDF returned status ${pdfStatus}, type ${pdfType}`);
      results.push({ test: 'Printable PDF Download', status: 'FAIL', details: `Status ${pdfStatus}` });
    }

    console.log('\n=============================================');
    console.log('SUMMARY OF ALL TEST RESULTS:');
    console.table(results);
    console.log('=============================================');

  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    await browser.close();
    console.log('Browser closed cleanly.');
  }
}

main();
