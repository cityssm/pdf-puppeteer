import launchPuppeteer from '@cityssm/puppeteer-launch';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { defaultPdfPuppeteerOptions, defaultPuppeteerOptions, htmlNavigationTimeoutMillis, urlNavigationTimeoutMillis } from './defaultOptions.js';
import pageToPdf from './pageToPdf.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
export class PdfPuppeteer {
    #browser;
    #puppeteerOptions;
    #pdfPuppeteerOptions;
    constructor(pdfPuppeteerOptions = {}) {
        this.#pdfPuppeteerOptions = {
            ...defaultPdfPuppeteerOptions,
            ...pdfPuppeteerOptions
        };
    }
    async #initializePage() {
        if (this.#browser === undefined || !this.#browser.connected) {
            this.#puppeteerOptions = {
                ...defaultPuppeteerOptions,
                browser: this.#pdfPuppeteerOptions.browser ?? 'chrome'
            };
            if (this.#pdfPuppeteerOptions.disableSandbox ??
                defaultPdfPuppeteerOptions.disableSandbox) {
                this.#puppeteerOptions.args = [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ];
            }
            let puppeteerLaunchFunction = launchPuppeteer;
            if (this.#pdfPuppeteerOptions.usePackagePuppeteer ??
                defaultPdfPuppeteerOptions.usePackagePuppeteer) {
                const puppeteerPackage = await import('puppeteer');
                puppeteerLaunchFunction = puppeteerPackage.launch;
            }
            this.#browser = await puppeteerLaunchFunction(this.#puppeteerOptions);
        }
        return await this.#browser.newPage();
    }
    async fromHtml(html, pdfOptions = {}, hasRemoteContent = true) {
        if (typeof html !== 'string') {
            throw new TypeError('Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.');
        }
        const page = await this.#initializePage();
        if (hasRemoteContent) {
            debug('Loading HTML with remote content...');
            await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
                timeout: urlNavigationTimeoutMillis,
                waitUntil: this.#puppeteerOptions.browser === 'firefox'
                    ? 'domcontentloaded'
                    : 'networkidle0'
            });
        }
        else {
            debug('Loading HTML...');
            await page.setContent(html, {
                timeout: htmlNavigationTimeoutMillis
            });
        }
        debug('Content loaded.');
        const pdf = await pageToPdf(page, pdfOptions);
        await page.close();
        return pdf;
    }
    async fromUrl(url, pdfOptions = {}) {
        if (typeof url !== 'string') {
            throw new TypeError('Invalid Argument: URL expected as type of string and received a value of a different type. Check your request body and request headers.');
        }
        const page = await this.#initializePage();
        debug('Loading URL...');
        await page.goto(url, {
            timeout: urlNavigationTimeoutMillis,
            waitUntil: this.#puppeteerOptions.browser === 'firefox'
                ? 'domcontentloaded'
                : 'networkidle0'
        });
        debug('Content loaded.');
        const pdf = await pageToPdf(page, pdfOptions);
        await page.close();
        return pdf;
    }
    async close() {
        if (this.#browser !== undefined && this.#browser.connected) {
            debug('Closing browser...');
            await this.#browser.close();
            this.#browser = undefined;
        }
    }
}
export default PdfPuppeteer;
