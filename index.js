import Debug from 'debug';
import exitHook from 'exit-hook';
import { launchBrowserWithFallback } from './browser.js';
import { defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions, pageNavigationTimeoutMillis } from './defaultOptions.js';
const debug = Debug('pdf-puppeteer');
let cachedBrowser;
let cachedBrowserOptions;
export async function convertHTMLToPDF(html, instancePdfOptions, instancePuppeteerOptions, instancePdfPuppeteerOptions) {
    if (typeof html !== 'string') {
        throw new TypeError('Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.');
    }
    const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, instancePuppeteerOptions);
    const pdfPuppeteerOptions = Object.assign({}, defaultPdfPuppeteerOptions, instancePdfPuppeteerOptions);
    let browser;
    if (pdfPuppeteerOptions.cacheBrowser ?? false) {
        const currentPuppeteerOptions = JSON.stringify(puppeteerOptions);
        if (cachedBrowserOptions === undefined ||
            cachedBrowser === undefined ||
            currentPuppeteerOptions !== cachedBrowserOptions) {
            debug('Initialize new cached browser.');
            if (cachedBrowser !== undefined) {
                debug('Kill current cached browser.');
                if (cachedBrowser.pages.length === 0) {
                    debug('All pages closed, kill browser.');
                    await cachedBrowser.close();
                    cachedBrowser = undefined;
                }
            }
            cachedBrowser = await launchBrowserWithFallback(puppeteerOptions, pdfPuppeteerOptions.switchBrowserIfFail);
            cachedBrowserOptions = currentPuppeteerOptions;
        }
        browser = cachedBrowser;
    }
    else {
        browser = await launchBrowserWithFallback(puppeteerOptions, pdfPuppeteerOptions.switchBrowserIfFail);
    }
    const page = await browser.newPage();
    if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
        await page.goto(html, {
            waitUntil: 'networkidle0',
            timeout: pageNavigationTimeoutMillis
        });
    }
    else if (pdfPuppeteerOptions.remoteContent ?? true) {
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
            waitUntil: 'networkidle0',
            timeout: pageNavigationTimeoutMillis
        });
    }
    else {
        await page.setContent(html, {
            timeout: pageNavigationTimeoutMillis
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
export { defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions } from './defaultOptions.js';
exitHook(() => {
    debug('Running exit hook.');
    void closeCachedBrowser();
});
