import assert from 'node:assert';
import os from 'node:os';
import { describe, it } from 'node:test';
import isPdf from '@cityssm/is-pdf';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js';
import PdfPuppeteer from '../index.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug(`${DEBUG_NAMESPACE}:test:package`);
debug(`Platform: ${os.platform()}`);
debug(`Release:  ${os.release()}`);
const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`;
await describe('pdf-puppeteer/package', async () => {
    await it('Converts HTML to PDF with package Puppeteer', async () => {
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
