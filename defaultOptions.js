export const defaultPuppeteerOptions = Object.freeze({
    product: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
});
export const defaultPdfOptions = Object.freeze({
    format: 'Letter'
});
export const defaultPdfPuppeteerOptions = Object.freeze({
    cacheBrowser: false,
    remoteContent: true,
    htmlIsUrl: false
});
