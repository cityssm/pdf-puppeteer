export const defaultPuppeteerOptions = Object.freeze({
    product: 'chrome',
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
