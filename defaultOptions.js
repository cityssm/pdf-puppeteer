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
    timeout: 30_000,
    browser: 'chrome',
    headless: true
};
export const htmlNavigationTimeoutMillis = 60_000;
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2;
