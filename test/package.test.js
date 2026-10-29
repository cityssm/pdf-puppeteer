import assert from 'node:assert';
import os from 'node:os';
import { describe, it } from 'node:test';
import { debuglog } from 'node:util';
import isPdf from '@cityssm/is-pdf';
import { DEBUG_NAMESPACE } from '../debug.config.js';
import PdfPuppeteer from '../index.js';
const debug = debuglog(`${DEBUG_NAMESPACE}:test:package`);
debug(`Platform: ${os.platform()}`);
debug(`Release:  ${os.release()}`);
const html = /* html */ `
  <html>
    <head><title>Test</title></head>
    <body><h1>Hello World</h1></body>
  </html>
`;
await describe('pdf-puppeteer/package', async () => {
    await it('Converts HTML to PDF with package Puppeteer', async () => {
        // eslint-disable-next-line no-useless-assignment
        let isValidPdf = false;
        const pdfPuppeteer = new PdfPuppeteer({
            disableSandbox: true,
            usePackagePuppeteer: true
        });
        try {
            const pdf = await pdfPuppeteer.fromHtml(html);
            isValidPdf = isPdf(pdf);
        }
        finally {
            await pdfPuppeteer.closeBrowser();
        }
        assert.ok(isValidPdf, 'PDF should be valid');
    });
});
