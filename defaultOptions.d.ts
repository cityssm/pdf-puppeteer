import type { PaperType } from '@cityssm/paper-sizes';
import type { puppeteer } from '@cityssm/puppeteer-launch';
export type PDFOptions = Omit<puppeteer.PDFOptions, 'format'> & {
    format?: PaperType | puppeteer.PaperFormat;
};
export declare const defaultPdfOptions: PDFOptions;
export interface PDFPuppeteerOptions {
    /**
     * The browser to use.
     * Default: 'chrome'
     */
    browser: puppeteer.SupportedBrowser;
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
    /**
     * The timeout in milliseconds for closing the browser.
     * If the browser is not used for this amount of time,
     * it will be closed automatically.
     * Set to `-1` to disable the timeout.
     * Set to `0` to close the browser after use.
     * Default: `60000` (1 minute)
     */
    browserCloseTimeoutMillis: number;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const defaultPuppeteerOptions: puppeteer.LaunchOptions;
export declare const htmlNavigationTimeoutMillis: number;
export declare const urlNavigationTimeoutMillis: number;
