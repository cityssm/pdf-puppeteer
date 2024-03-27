import type { PDFOptions, PuppeteerLaunchOptions } from 'puppeteer';
export declare const isUnsupportedChrome: boolean;
export declare const defaultPuppeteerOptions: PuppeteerLaunchOptions;
export declare const defaultPdfOptions: PDFOptions;
export interface PDFPuppeteerOptions {
    cacheBrowser: boolean;
    remoteContent: boolean;
    htmlIsUrl: boolean;
    switchBrowserIfFail: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const htmlNavigationTimeoutMillis = 60000;
export declare const urlNavigationTimeoutMillis: number;
