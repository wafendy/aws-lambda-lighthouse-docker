const lighthouse = require('lighthouse');
const chromium = require('chrome-aws-lambda');
const log = require('lighthouse-logger');

exports.lambdaHandler = async (event) => {
  let browser;
  let response;
  log.setLevel("error");

  const chromiumArgs = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--disable-web-security',
    '--disk-cache-size=33554432',
    '--hide-scrollbars',
    '--ignore-gpu-blocklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--headless',
    '--disable-gpu',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
    '--window-size=1920,1080',
    '--start-maximized',
    '--remote-debugging-port=9222'
  ]

  try {
    browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--remote-debugging-port=9222"],
      // args: chromiumArgs,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const options = {
      output: "json",
      preset: 'desktop',
      onlyCategories: ["performance", "seo", "accessibility", "best-practices"],
      port: 9222,
    }

    const url = 'https://www.google.com';

    const result = await lighthouse(url, options);
    console.log(`Audited ${url} in ${result.lhr.timing.total} ms.`);

    const report = JSON.parse(result.report);

    console.log('P: ', report['categories']['performance']['score']);
    console.log('A: ', report['categories']['accessibility']['score']);
    console.log('S: ', report['categories']['seo']['score']);
    console.log('B: ', report['categories']['best-practices']['score']);
    
    response = {
      statusCode: 200,
      body: {
        'Perfomance': report['categories']['performance']['score'],
        'Accessibility': report['categories']['accessibility']['score'],
        'SEO': report['categories']['seo']['score'],
        'BestPractices': report['categories']['best-practices']['score'],
        'ErrorMessage': report['audits']['speed-index']['errorMessage']
      }
    }

  } catch (error) {
    console.error(error);

    response = {
      statusCode: 500,
      body: error
    }
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return response;
};