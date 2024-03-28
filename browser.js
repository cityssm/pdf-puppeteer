import { chromeWebBrowserTypes, getInstalledWebBrowsers } from '@cityssm/web-browser-info';
import Debug from 'debug';
import * as puppeteer from 'puppeteer';
const debug = Debug('pdf-puppeteer:browser');
const defaultPuppeteerOptions = {
    timeout: 60_000
};
let fallbackPuppeteerLaunchOptions = [];
let selectedFallbackIndex = -1;
async function loadFallbackBrowsers() {
    if (fallbackPuppeteerLaunchOptions.length === 0) {
        const tempFallbackPuppeteerLaunchOptions = [];
        const fallbackChromeBrowsers = await getInstalledWebBrowsers(chromeWebBrowserTypes, 110);
        for (const chromeBrowser of fallbackChromeBrowsers) {
            tempFallbackPuppeteerLaunchOptions.push({
                product: 'chrome',
                executablePath: chromeBrowser.command,
                timeout: defaultPuppeteerOptions.timeout
            });
        }
        const fallbackFirefoxBrowsers = await getInstalledWebBrowsers('firefox');
        for (const firefoxBrowser of fallbackFirefoxBrowsers) {
            tempFallbackPuppeteerLaunchOptions.push({
                product: 'firefox',
                executablePath: firefoxBrowser.command,
                timeout: defaultPuppeteerOptions.timeout
            });
        }
        fallbackPuppeteerLaunchOptions = tempFallbackPuppeteerLaunchOptions;
        debug('Available fallback browsers:');
        debug(fallbackPuppeteerLaunchOptions);
    }
    return fallbackPuppeteerLaunchOptions;
}
export async function launchBrowser(forceUseSystemBrowser = false) {
    try {
        if (forceUseSystemBrowser && selectedFallbackIndex === -1) {
            throw new Error('Fallback browser required.');
        }
        return await puppeteer.launch(selectedFallbackIndex === -1
            ? defaultPuppeteerOptions
            : fallbackPuppeteerLaunchOptions[selectedFallbackIndex]);
    }
    catch (error) {
        const fallbackOptions = await loadFallbackBrowsers();
        for (const [index, fallback] of fallbackOptions.entries()) {
            try {
                const browser = await puppeteer.launch(fallback);
                selectedFallbackIndex = index;
                return browser;
            }
            catch { }
        }
        throw error;
    }
}
