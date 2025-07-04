import assert from 'node:assert';
import fs from 'node:fs/promises';
import os from 'node:os';
import { describe, it } from 'node:test';
import isPdf from '@cityssm/is-pdf';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import PdfPuppeteer from '../index.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug('pdf-puppeteer:test:firefox');
debug(`Platform: ${os.platform()}`);
debug(`Release:  ${os.release()}`);
const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`;
await describe('pdf-puppeteer/firefox', async () => {
    await it('Converts HTML to PDF with a Firefox browser', async () => {
        let isValidPdf = false;
        let pdfPuppeteer;
        try {
            pdfPuppeteer = new PdfPuppeteer({
                browser: 'firefox',
                disableSandbox: true
            });
            const pdf = await pdfPuppeteer.fromHtml(html);
            await fs.writeFile('./test/output/htmlFirefox.pdf', pdf);
            isValidPdf = isPdf(pdf);
        }
        finally {
            await pdfPuppeteer?.close();
        }
        assert.ok(isValidPdf, 'PDF should be valid');
    });
});
