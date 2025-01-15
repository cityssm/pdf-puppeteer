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
    remoteContent: true,
    htmlIsUrl: false
};
export const defaultPuppeteerOptions = {
    timeout: secondsToMillis(30),
    browser: 'chrome',
    headless: true,
    args: ['--disable-setuid-sandbox']
};
export const htmlNavigationTimeoutMillis = millisecondsInOneMinute;
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2;
