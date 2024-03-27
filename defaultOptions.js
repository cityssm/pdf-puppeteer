import os from 'node:os';
import process from 'node:process';
export const isUnsupportedChrome = process.platform === 'win32' &&
    Number.parseInt(os.release().split('.')[0]) < 10;
export const defaultPuppeteerOptions = Object.freeze({
    product: isUnsupportedChrome ? 'firefox' : 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
    timeout: 60_000
});
export const defaultPdfOptions = Object.freeze({
    format: 'Letter'
});
export const defaultPdfPuppeteerOptions = Object.freeze({
    cacheBrowser: false,
    remoteContent: true,
    htmlIsUrl: false,
    switchBrowserIfFail: true
});
export const pageNavigationTimeoutMillis = 60_000;
