import type { puppeteer } from '@cityssm/puppeteer-launch';
export declare const defaultPdfOptions: puppeteer.PDFOptions;
export interface PDFPuppeteerOptions {
    /**
     * If the Puppeteer browser instance should be saved between calls.
     * Default: false
     */
    cacheBrowser: boolean;
    /**
     * If the given HTML references remote content, like images and stylesheets.
     * Speed can be increased when set to false.
     * Default: true
     */
    remoteContent: boolean;
    /**
     * If the HTML parameter is actually a URL.
     * Default: false
     */
    htmlIsUrl: boolean;
    /**
     * The browser to use.
     * Default: 'chrome'
     */
    browser?: puppeteer.SupportedBrowser;
    /**
     * If the sandbox should be disabled.
     * Default: false
     */
    disableSandbox: boolean;
    /**
     * If true, use whatever version of Puppeteer is installed,
     * which could be a legacy version.
     * Default: false
     */
    usePackagePuppeteer: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const defaultPuppeteerOptions: puppeteer.LaunchOptions;
export declare const htmlNavigationTimeoutMillis: number;
export declare const urlNavigationTimeoutMillis: number;
