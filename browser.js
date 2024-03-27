import browserLauncher from '@httptoolkit/browser-launcher';
import Debug from 'debug';
import * as puppeteer from 'puppeteer';
import { isUnsupportedChrome } from './defaultOptions.js';
const debug = Debug('pdf-puppeteer:browser');
async function launchBrowser(puppeteerOptions) {
    if (isUnsupportedChrome && puppeteerOptions.product === 'chrome') {
        throw new Error('Puppeteer does not support Chrome on this OS.');
    }
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
export async function launchBrowserWithFallback(puppeteerOptions, switchBrowserIfFail = true) {
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
