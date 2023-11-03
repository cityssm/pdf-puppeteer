/// <reference types="node" />
import * as puppeteer from 'puppeteer';
export declare const defaultPuppeteerOptions: puppeteer.PuppeteerLaunchOptions;
export declare const defaultPdfOptions: puppeteer.PDFOptions;
interface PDFPuppeteerOptions {
    cacheBrowser: boolean;
    remoteContent: boolean;
    htmlIsUrl: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare function convertHTMLToPDF(html: string, instancePdfOptions?: puppeteer.PDFOptions, instancePuppeteerOptions?: puppeteer.PuppeteerLaunchOptions, instancePdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>): Promise<Buffer>;
export default convertHTMLToPDF;
export declare function closeCachedBrowser(): Promise<void>;
export declare function hasCachedBrowser(): boolean;
