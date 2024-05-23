import { type puppeteer } from '@cityssm/puppeteer-launch';
export declare const defaultPdfOptions: puppeteer.PDFOptions;
export interface PDFPuppeteerOptions {
    cacheBrowser: boolean;
    remoteContent: boolean;
    htmlIsUrl: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const puppeteerLaunchTimeoutMillis = 60000;
export declare const htmlNavigationTimeoutMillis = 60000;
export declare const urlNavigationTimeoutMillis: number;
