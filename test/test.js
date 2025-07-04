import assert from 'node:assert';
import os from 'node:os';
import { describe, it } from 'node:test';
import isPdf from '@cityssm/is-pdf';
import Debug from 'debug';
import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js';
import PdfPuppeteer from '../index.js';
Debug.enable(DEBUG_ENABLE_NAMESPACES);
const debug = Debug('pdf-puppeteer:test');
debug(`Platform: ${os.platform()}`);
debug(`Release:  ${os.release()}`);
const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`;
await describe('pdf-puppeteer', async () => {
    await it('Converts HTML to PDF', async () => {
        let isValidPdf = false;
        let pdfPuppeteer;
        try {
            pdfPuppeteer = new PdfPuppeteer({
                disableSandbox: true
            });
            const pdf = await pdfPuppeteer.fromHtml(html);
            isValidPdf = isPdf(pdf);
        }
        finally {
            await pdfPuppeteer?.close();
        }
        assert.ok(isValidPdf, 'PDF should be valid');
    });
    await it('Converts remote HTML to PDF with Puppeteer options', async () => {
        let isValidPdf = false;
        let pdfPuppeteer;
        try {
            pdfPuppeteer = new PdfPuppeteer({
                disableSandbox: true
            });
            const pdf = await pdfPuppeteer.fromHtml(html, {
                format: 'Legal'
            }, true);
            isValidPdf = isPdf(pdf);
        }
        finally {
            await pdfPuppeteer?.close();
        }
        assert.ok(isValidPdf, 'PDF should be valid');
    });
    await it('Converts a website to PDF', async () => {
        let isValidPdf = false;
        let pdfPuppeteer;
        try {
            pdfPuppeteer = new PdfPuppeteer({
                disableSandbox: true
            });
            const pdf = await pdfPuppeteer.fromUrl('https://cityssm.github.io/', {
                format: 'Letter'
            });
            isValidPdf = isPdf(pdf);
        }
        finally {
            await pdfPuppeteer?.close();
        }
        assert.ok(isValidPdf, 'PDF should be valid');
    });
});
