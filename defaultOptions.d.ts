import type { PDFOptions } from 'puppeteer';
export declare const defaultPdfOptions: PDFOptions;
export interface PDFPuppeteerOptions {
    cacheBrowser: boolean;
    remoteContent: boolean;
    htmlIsUrl: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const htmlNavigationTimeoutMillis = 60000;
export declare const urlNavigationTimeoutMillis: number;
