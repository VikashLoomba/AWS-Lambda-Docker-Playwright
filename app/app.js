const {chromium} = require("playwright");
exports.lambdaHandler = async (event) => {
  const url = event['queryStringParameters'].url;
  console.log(event['queryStringParameters']);

  try {
    const browser = await chromium.launch({dumpio: true, args: ['--autoplay-policy=user-gesture-required',
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
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--disk-cache-size=33554432',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
    '--single-process']});
    const context = await browser.newContext();
    const page = await context.newPage();
    if(url) {
      await page.goto(url);
    } else {
      await page.goto('http://whatsmyuseragent.org/');
    }
    const pdfStream = await page.pdf();
    await browser.close();
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        "Content-type": "application/pdf"
      },
      body: pdfStream.toString("base64")
    };
  } catch(e) {
    console.log(e);
    return {
      statusCode: 500
    };
  }
    
};