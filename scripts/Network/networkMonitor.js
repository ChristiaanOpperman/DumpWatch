const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    let networkData = [];

    page.on('request', request => {
        networkData.push({
            url: request.url(),
            method: request.method(),
            type: request.resourceType(),
            timestamp: new Date().toISOString(),
        });
        request.continue();
    });

    page.on('response', async response => {
        try {
            const request = response.request();
            const headers = response.headers();
            const size = headers['content-length'] || 0; // Response size in bytes

            networkData.push({
                url: request.url(),
                method: request.method(),
                type: request.resourceType(),
                status: response.status(),
                size: parseInt(size, 10) || 'Unknown',
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error capturing response:", error);
        }
    });

    console.log("Opening React App...");
    await page.goto('http://localhost:3000'); 

    console.log("Waiting for requests...");
    await new Promise(resolve => setTimeout(resolve, 10000));

    fs.writeFileSync('networkData.json', JSON.stringify(networkData, null, 2));
    console.log("Network data saved to networkData.json");

    await browser.close();
})();
