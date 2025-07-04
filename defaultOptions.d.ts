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
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const defaultPuppeteerOptions: puppeteer.LaunchOptions;
export declare const htmlNavigationTimeoutMillis: number;
export declare const urlNavigationTimeoutMillis: number;
