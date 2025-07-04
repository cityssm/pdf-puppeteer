import launchPuppeteer from '@cityssm/puppeteer-launch';
import Debug from 'debug';
import exitHook from 'exit-hook';
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
        exitHook(() => {
            debug('Exit hook triggered. Closing browser...');
            void this.closeBrowser();
        });
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
    /**
     * Converts HTML content to a PDF document.
     * This method can handle both local HTML content and remote resources.
     * If the HTML contains remote content, it will fetch those resources.
     * If `hasRemoteContent` is `false`, it will load the HTML without fetching remote resources.
     * @param html - The HTML content to convert to PDF.
     * @param pdfOptions - Options for the PDF generation.
     * The options can include:
     * - `format`: The paper format (e.g., 'Letter', 'A4').
     * - `width` and `height`: Custom dimensions for the PDF.
     * @param hasRemoteContent - If the HTML contains remote content (like images or stylesheets).
     * If `false`, the HTML will be loaded without fetching remote resources.
     * @returns A Promise that resolves to a Uint8Array containing the PDF data.
     * @throws {TypeError} If the `html` parameter is not a string.
     * @throws {Error} If there is an issue with loading the HTML or generating the PDF.
     */
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
    /**
     * Converts a URL to a PDF document.
     * This method loads the content of the URL and generates a PDF from it.
     * @param url - The URL to convert to PDF.
     * It should be a valid URL string.
     * @throws {TypeError} If the `url` parameter is not a string.
     * @param pdfOptions - Options for the PDF generation.
     * The options can include:
     * - `format`: The paper format (e.g., 'Letter', 'A4').
     * - `width` and `height`: Custom dimensions for the PDF.
     * @throws {Error} If there is an issue with loading the URL or generating the PDF.
     * @returns A Promise that resolves to a Uint8Array containing the PDF data.
     */
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
    /**
     * Closes the Puppeteer browser instance.
     * This method ensures that the browser is closed properly.
     */
    async closeBrowser() {
        if (this.#browser !== undefined && this.#browser.connected) {
            debug('Closing browser...');
            await this.#browser.close();
            this.#browser = undefined;
        }
    }
}
export default PdfPuppeteer;
