import browserLauncher from '@httptoolkit/browser-launcher';
import Debug from 'debug';
import exitHook from 'exit-hook';
import * as puppeteer from 'puppeteer';
import { defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions } from './defaultOptions.js';
const debug = Debug('pdf-puppeteer');
let cachedBrowser;
let cachedBrowserOptions;
async function launchBrowser(puppeteerOptions) {
    try {
        return await puppeteer.launch(puppeteerOptions);
    }
    catch (error) {
        return await new Promise((resolve) => {
            browserLauncher.detect((browsers) => {
                const browser = browsers.find((possibleBrowser) => {
                    return (possibleBrowser.type === puppeteerOptions.product ||
                        (puppeteerOptions.product === 'chrome' &&
                            possibleBrowser.name === 'chromium'));
                });
                if (browser === undefined) {
                    debug(`No available browsers for ${puppeteerOptions.product}:`);
                    debug(browsers);
                    throw error;
                }
                else {
                    debug('Using system browser:');
                    debug(browser);
                    resolve(puppeteer.launch(Object.assign({}, puppeteerOptions, {
                        executablePath: browser.command
                    })));
                }
            });
        });
    }
}
async function launchBrowserWithFallback(puppeteerOptions, switchBrowserIfFail = true) {
    try {
        return await launchBrowser(puppeteerOptions);
    }
    catch (error) {
        if (switchBrowserIfFail) {
            const fallback = puppeteerOptions.product === 'chrome' ? 'firefox' : 'chrome';
            debug(`Switching to fallback: ${fallback}`);
            const fallbackPuppeteerOptions = Object.assign({}, puppeteerOptions, {
                product: fallback
            });
            delete fallbackPuppeteerOptions.executablePath;
            debug(fallbackPuppeteerOptions);
            return await launchBrowser(fallbackPuppeteerOptions);
        }
        else {
            throw error;
        }
    }
}
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
