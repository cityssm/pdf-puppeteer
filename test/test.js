import assert from 'node:assert';
import * as pdfPuppeteer from '../index.js';
const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`;
const toStringResult = '[object Uint8Array]';
describe('pdf-puppeteer', () => {
    after(async () => {
        await pdfPuppeteer.closeCachedBrowser();
    });
    it('Converts HTML to PDF with a new browser', async () => {
        const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, undefined, {
            cacheBrowser: false,
            remoteContent: false
        });
        assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
    });
    it('Converts HTML to PDF with a cached browser', async () => {
        const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, {
            cacheBrowser: true,
            remoteContent: false
        });
        assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
    });
    it('Converts remote HTML to PDF with Puppeteer options', async () => {
        const pdf = await pdfPuppeteer.convertHTMLToPDF(html, { format: 'Letter' }, {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, {
            cacheBrowser: true,
            remoteContent: true
        });
        assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
    });
    it('Converts HTML to PDF with Puppeteer options', async () => {
        const pdf = await pdfPuppeteer.convertHTMLToPDF(html, { format: 'A4' }, {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }, {
            cacheBrowser: true
        });
        assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
    });
    it('Converts a website to PDF with different Puppeteer options', async () => {
        const pdf = await pdfPuppeteer.convertHTMLToPDF('https://cityssm.github.io/', undefined, {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            env: {
                environment: 'pdf-puppeteer'
            }
        }, {
            cacheBrowser: true,
            remoteContent: false,
            htmlIsUrl: true
        });
        assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
    });
    it('Throws an error if the html parameter is not a string', async () => {
        try {
            await pdfPuppeteer.convertHTMLToPDF(123_456_789);
            assert.fail('No error thrown.');
        }
        catch {
            assert.ok('Error thrown');
        }
    });
    it('Closes cached browsers', async () => {
        if (pdfPuppeteer.hasCachedBrowser()) {
            await pdfPuppeteer.closeCachedBrowser();
        }
        assert.strictEqual(pdfPuppeteer.hasCachedBrowser(), false);
    });
});
describe('pdf-puppeteer - firefox', () => {
    it('Converts HTML to PDF with the system browser', async () => {
        try {
            const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
                product: 'firefox',
                executablePath: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
            }, {
                cacheBrowser: false,
                remoteContent: false
            });
            assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
        }
        catch {
            console.log('Firefox not found.');
            assert.ok(true);
        }
    });
});
describe('pdf-puppeteer - system chrome browser', () => {
    it('Converts HTML to PDF with the system browser', async () => {
        try {
            const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
                product: 'chrome',
                executablePath: 'INVALID_PATH'
            }, {
                cacheBrowser: false,
                remoteContent: false
            });
            assert.strictEqual(Object.prototype.toString.call(pdf), toStringResult);
        }
        catch {
            console.log('System browser not found.');
            assert.ok(true);
        }
    });
});
