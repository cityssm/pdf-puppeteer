import { type puppeteer } from '@cityssm/puppeteer-launch';
import { type PDFPuppeteerOptions } from './defaultOptions.js';
export declare function convertHTMLToPDF(html: string, instancePdfOptions?: puppeteer.PDFOptions, instancePdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>): Promise<Uint8Array>;
export default convertHTMLToPDF;
export declare function closeCachedBrowser(): Promise<void>;
export declare function hasCachedBrowser(): boolean;
export { type PDFPuppeteerOptions, defaultPdfOptions, defaultPdfPuppeteerOptions } from './defaultOptions.js';
