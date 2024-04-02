import launchPuppeteer from '@cityssm/puppeteer-launch';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { defaultPdfOptions, defaultPdfPuppeteerOptions, htmlNavigationTimeoutMillis, urlNavigationTimeoutMillis } from './defaultOptions.js';
const debug = Debug('pdf-puppeteer:index');
let cachedBrowser;
export async function convertHTMLToPDF(html, instancePdfOptions, instancePdfPuppeteerOptions) {
    if (typeof html !== 'string') {
        throw new TypeError('Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.');
    }
    const pdfPuppeteerOptions = Object.assign({}, defaultPdfPuppeteerOptions, instancePdfPuppeteerOptions);
    let browser;
    if (pdfPuppeteerOptions.cacheBrowser ?? false) {
        if (cachedBrowser === undefined) {
            cachedBrowser = await launchPuppeteer();
        }
        browser = cachedBrowser;
    }
    else {
        browser = await launchPuppeteer();
    }
    const browserVersion = await browser.version();
    debug(`Browser: ${browserVersion}`);
    const browserIsFirefox = browserVersion.toLowerCase().includes('firefox');
    const page = await browser.newPage();
    const remoteContent = pdfPuppeteerOptions.remoteContent ?? true;
    if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
        await page.goto(html, {
            waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
            timeout: urlNavigationTimeoutMillis
        });
    }
    else if (remoteContent) {
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
            waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
            timeout: urlNavigationTimeoutMillis
        });
    }
    else {
        await page.setContent(html, {
            timeout: remoteContent
                ? urlNavigationTimeoutMillis
                : htmlNavigationTimeoutMillis
        });
    }
    const pdfOptions = Object.assign({}, defaultPdfOptions, instancePdfOptions);
    const pdfBuffer = await page.pdf(pdfOptions);
    await page.close();
    if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
        await browser.close();
    }
    return pdfBuffer;
}
export default convertHTMLToPDF;
export async function closeCachedBrowser() {
    if (cachedBrowser !== undefined) {
        try {
            await cachedBrowser.close();
        }
        catch { }
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
