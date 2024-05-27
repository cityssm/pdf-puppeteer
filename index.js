import { getPaperSize } from '@cityssm/paper-sizes';
import launchPuppeteer from '@cityssm/puppeteer-launch';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions, htmlNavigationTimeoutMillis, urlNavigationTimeoutMillis } from './defaultOptions.js';
const debug = Debug('pdf-puppeteer:index');
let cachedBrowser;
export async function convertHTMLToPDF(html, instancePdfOptions = {}, instancePdfPuppeteerOptions = {}) {
    if (typeof html !== 'string') {
        throw new TypeError('Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.');
    }
    const pdfPuppeteerOptions = Object.assign({}, defaultPdfPuppeteerOptions, instancePdfPuppeteerOptions);
    let browser;
    let doCloseBrowser = false;
    let isRunningPdfGeneration = false;
    try {
        if (pdfPuppeteerOptions.cacheBrowser ?? false) {
            if (cachedBrowser === undefined) {
                cachedBrowser = await launchPuppeteer(defaultPuppeteerOptions);
            }
            browser = cachedBrowser;
        }
        else {
            doCloseBrowser = true;
            browser = await launchPuppeteer(defaultPuppeteerOptions);
        }
        const browserVersion = await browser.version();
        debug(`Browser: ${browserVersion}`);
        const browserIsFirefox = browserVersion.toLowerCase().includes('firefox');
        const page = await browser.newPage();
        const remoteContent = pdfPuppeteerOptions.remoteContent ?? true;
        if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
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
                timeout: remoteContent
                    ? urlNavigationTimeoutMillis
                    : htmlNavigationTimeoutMillis
            });
        }
        debug('Content loaded.');
        const pdfOptions = Object.assign({}, defaultPdfOptions, instancePdfOptions);
        if (pdfOptions.format !== undefined) {
            const size = getPaperSize(pdfOptions.format);
            if (size !== undefined) {
                delete pdfOptions.format;
                pdfOptions.width = `${size.width}${size.unit}`;
                pdfOptions.height = `${size.height}${size.unit}`;
            }
        }
        debug('Converting to PDF...');
        isRunningPdfGeneration = true;
        const pdfBuffer = await page.pdf(pdfOptions);
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
            defaultPuppeteerOptions.product === 'chrome') {
            if (!doCloseBrowser) {
                await closeCachedBrowser();
            }
            defaultPuppeteerOptions.product = 'firefox';
            debug('Trying again with Firefox.');
            return await convertHTMLToPDF(html, instancePdfOptions, instancePdfPuppeteerOptions);
        }
        else {
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
        }
    }
}
export default convertHTMLToPDF;
export async function closeCachedBrowser() {
    if (cachedBrowser !== undefined) {
        try {
            await cachedBrowser.close();
        }
        catch {
        }
        cachedBrowser = undefined;
    }
}
export function hasCachedBrowser() {
    return cachedBrowser !== undefined;
}
export { defaultPdfOptions, defaultPdfPuppeteerOptions } from './defaultOptions.js';
exitHook(() => {
    debug('Running exit hook.');
    void closeCachedBrowser();
});
