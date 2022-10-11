import * as puppeteer from "puppeteer";
export declare const defaultPuppeteerOptions: puppeteer.PuppeteerLaunchOptions;
export declare const defaultPdfOptions: puppeteer.PDFOptions;
interface PDFPuppeteerOptions {
    cacheBrowser?: boolean;
    remoteContent?: boolean;
    htmlIsUrl?: boolean;
}
export declare const defaultPdfPuppeteerOptions: PDFPuppeteerOptions;
export declare const convertHTMLToPDF: (html: string, callback: (pdf: Buffer) => void, instancePdfOptions?: puppeteer.PDFOptions, instancePuppeteerOptions?: puppeteer.PuppeteerLaunchOptions, instancePdfPuppeteerOptions?: PDFPuppeteerOptions) => Promise<void>;
export default convertHTMLToPDF;
export declare const closeCachedBrowser: () => Promise<void>;
export declare const hasCachedBrowser: () => boolean;
