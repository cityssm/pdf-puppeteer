import os from 'node:os';
import { getPaperSize } from '@cityssm/paper-sizes';
import launchPuppeteer, { puppeteer } from '@cityssm/puppeteer-launch';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions, htmlNavigationTimeoutMillis, urlNavigationTimeoutMillis } from './defaultOptions.js';
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
const isOldWindows = os.platform() === 'win32' && os.release().startsWith('6.');
if (isOldWindows) {
    debug('Older Windows detected. May not work as expected.');
}
let cachedBrowser;
/**
 * Converts HTML or a webpage into HTML using Puppeteer.
 * @param html - An HTML string, or a URL.
 * @param instancePdfOptions - PDF options for Puppeteer.
 * @param instancePdfPuppeteerOptions - pdf-puppeteer options.
 * @returns A Buffer of PDF data.
 */
// eslint-disable-next-line complexity
export async function convertHTMLToPDF(html, instancePdfOptions = {}, instancePdfPuppeteerOptions = {}) {
    if (typeof html !== 'string') {
        throw new TypeError('Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.');
    }
    const pdfPuppeteerOptions = {
        ...defaultPdfPuppeteerOptions,
        ...instancePdfPuppeteerOptions
    };
    /*
     * Initialize browser
     */
    const puppeteerOptions = { ...defaultPuppeteerOptions };
    puppeteerOptions.browser = pdfPuppeteerOptions.browser ?? 'chrome';
    puppeteerOptions.protocol =
        puppeteerOptions.browser === 'firefox' && isOldWindows
            ? 'cdp'
            : 'webDriverBiDi';
    if (pdfPuppeteerOptions.disableSandbox) {
        puppeteerOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
    }
    let browser;
    let doCloseBrowser = false;
    let isRunningPdfGeneration = false;
    try {
        if (pdfPuppeteerOptions.cacheBrowser) {
            cachedBrowser ??= isOldWindows
                ? await puppeteer.launch(puppeteerOptions)
                : await launchPuppeteer(puppeteerOptions);
            browser = cachedBrowser;
        }
        else {
            doCloseBrowser = true;
            browser = isOldWindows
                ? await puppeteer.launch(puppeteerOptions)
                : await launchPuppeteer(puppeteerOptions);
        }
        const browserVersion = await browser.version();
        debug(`Browser: ${browserVersion}`);
        const browserIsFirefox = browserVersion.toLowerCase().includes('firefox');
        /*
         * Initialize page
         */
        const page = await browser.newPage();
        const remoteContent = pdfPuppeteerOptions.remoteContent;
        if (pdfPuppeteerOptions.htmlIsUrl) {
            debug('Loading URL...');
            await page.goto(html, {
                waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
                timeout: urlNavigationTimeoutMillis
            });
        }
        else if (remoteContent) {
            debug('Loading HTML with remote content...');
            await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
                waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
                timeout: urlNavigationTimeoutMillis
            });
        }
        else {
            debug('Loading HTML...');
            await page.setContent(html, {
                timeout: htmlNavigationTimeoutMillis
            });
        }
        debug('Content loaded.');
        const pdfOptions = { ...defaultPdfOptions, ...instancePdfOptions };
        // Fix "format" issue
        if (pdfOptions.format !== undefined) {
            const size = getPaperSize(pdfOptions.format);
            // eslint-disable-next-line sonarjs/different-types-comparison, @typescript-eslint/no-unnecessary-condition
            if (size !== undefined) {
                delete pdfOptions.format;
                pdfOptions.width = `${size.width}${size.unit}`;
                pdfOptions.height = `${size.height}${size.unit}`;
            }
        }
        debug('Converting to PDF...');
        // eslint-disable-next-line sonarjs/no-dead-store
        isRunningPdfGeneration = true;
        const pdfBuffer = await page.pdf(pdfOptions);
        // eslint-disable-next-line sonarjs/no-dead-store
        isRunningPdfGeneration = false;
        debug('PDF conversion done.');
        await page.close();
        if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
            await browser.close();
        }
        return pdfBuffer;
    }
    catch (error) {
        if (isRunningPdfGeneration &&
            defaultPuppeteerOptions.browser === 'chrome') {
            if (!doCloseBrowser) {
                await closeCachedBrowser();
            }
            defaultPuppeteerOptions.browser = 'firefox';
            debug('Trying again with Firefox.');
            return await convertHTMLToPDF(html, instancePdfOptions, instancePdfPuppeteerOptions);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/only-throw-error
            throw error;
        }
    }
    finally {
        try {
            if (doCloseBrowser && browser !== undefined) {
                debug('Closing browser...');
                await browser.close();
                debug('Browser closed.');
            }
        }
        catch {
            // ignore
        }
    }
}
export default convertHTMLToPDF;
/**
 * Closes the cached browser instance.
 */
export async function closeCachedBrowser() {
    if (cachedBrowser !== undefined) {
        try {
            await cachedBrowser.close();
        }
        catch {
            // ignore
        }
        cachedBrowser = undefined;
    }
}
/**
 * Checks for any cached browser instance.
 * @returns True is a cached browser instance exists.
 */
export function hasCachedBrowser() {
    return cachedBrowser !== undefined;
}
export { defaultPdfOptions, defaultPdfPuppeteerOptions } from './defaultOptions.js';
exitHook(() => {
    debug('Running exit hook.');
    void closeCachedBrowser();
});
