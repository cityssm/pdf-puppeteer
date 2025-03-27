import { puppeteer } from '@cityssm/puppeteer-launch';
import { type PDFPuppeteerOptions } from './defaultOptions.js';
/**
 * Converts HTML or a webpage into HTML using Puppeteer.
 * @param html - An HTML string, or a URL.
 * @param instancePdfOptions - PDF options for Puppeteer.
 * @param instancePdfPuppeteerOptions - pdf-puppeteer options.
 * @returns A Buffer of PDF data.
 */
export declare function convertHTMLToPDF(html: string, instancePdfOptions?: puppeteer.PDFOptions, instancePdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>): Promise<Uint8Array>;
export default convertHTMLToPDF;
/**
 * Closes the cached browser instance.
 */
export declare function closeCachedBrowser(): Promise<void>;
/**
 * Checks for any cached browser instance.
 * @returns True is a cached browser instance exists.
 */
export declare function hasCachedBrowser(): boolean;
export { type PDFPuppeteerOptions, defaultPdfOptions, defaultPdfPuppeteerOptions } from './defaultOptions.js';
