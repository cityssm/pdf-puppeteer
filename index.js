import Debug from 'debug';
import exitHook from 'exit-hook';
import * as puppeteer from 'puppeteer';
const debug = Debug('pdf-puppeteer');
export const defaultPuppeteerOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new'
};
export const defaultPdfOptions = {};
export const defaultPdfPuppeteerOptions = {
    cacheBrowser: false,
    remoteContent: true,
    htmlIsUrl: false
};
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
            cachedBrowser = await puppeteer.launch(puppeteerOptions);
            cachedBrowserOptions = currentPuppeteerOptions;
        }
        browser = cachedBrowser;
    }
    else {
        browser = await puppeteer.launch(puppeteerOptions);
    }
    const page = await browser.newPage();
    if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
        await page.goto(html, {
            waitUntil: 'networkidle0'
        });
    }
    else if (pdfPuppeteerOptions.remoteContent ?? true) {
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, {
            waitUntil: 'networkidle0'
        });
    }
    else {
        await page.setContent(html);
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
        await cachedBrowser.close();
        cachedBrowser = undefined;
    }
}
export function hasCachedBrowser() {
    return cachedBrowser !== undefined;
}
exitHook(() => {
    debug('Running exit hook.');
    void closeCachedBrowser();
});
