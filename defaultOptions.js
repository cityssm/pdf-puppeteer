import { millisecondsInOneMinute, secondsToMillis } from '@cityssm/to-millis';
/*
 * PDF Options
 */
export const defaultPdfOptions = {
    format: 'Letter',
    printBackground: true
};
export const defaultPdfPuppeteerOptions = {
    cacheBrowser: false,
    disableSandbox: false,
    htmlIsUrl: false,
    remoteContent: true
};
export const defaultPuppeteerOptions = {
    browser: 'chrome',
    headless: true,
    timeout: secondsToMillis(30)
};
export const htmlNavigationTimeoutMillis = millisecondsInOneMinute;
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2;
