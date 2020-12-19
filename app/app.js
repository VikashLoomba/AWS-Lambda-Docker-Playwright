const {chromium} = require("playwright");
exports.lambdaHandler = async (event) => {
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
    console.log("launched")
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36' });
    const page = await context.newPage();
    const promises = get_commands(event['queryStringParameters'].script, page);
    console.log("Promises Array: ", promises);
    const resolved = await Promise.all(promises);

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

function get_commands(script, page) {
  const script_string = JSON.parse(script);
  const promises = [];
  if(script_string.length > 0) {
    script_string.forEach((command_object) => {
      const parsed_command = build_promise(command_object, page)
      promises.push(parsed_command);
    })
  }
  return promises;
}

function build_promise(command_object, page) {
  const {action, url, selector, timeout, value} = command_object;
  switch (action) {
    case "goto": {
      const p = new Promise((resolve, reject) => {
        resolve(page.goto(url))
      });
      return p
    }
    case "click": {
      const p = new Promise((resolve, reject) => {
        resolve(page.click(selector));
      });
      return p
    }
    case "fill": {
      const p = new Promise((resolve, reject) => {
        resolve(page.fill(selector, value));
      });
      return p
    }
    case "waitFor": {
      const p = new Promise((resolve, reject) => {
        resolve(page.waitFor(timeout));
      });
      return p
    }
  }
}
