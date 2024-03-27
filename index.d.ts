/// <reference types="node" />
import type * as puppeteer from 'puppeteer';
import { type PDFPuppeteerOptions } from './defaultOptions.js';
export declare function convertHTMLToPDF(html: string, instancePdfOptions?: puppeteer.PDFOptions, instancePuppeteerOptions?: puppeteer.PuppeteerLaunchOptions, instancePdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>): Promise<Buffer>;
export default convertHTMLToPDF;
export declare function closeCachedBrowser(): Promise<void>;
export declare function hasCachedBrowser(): boolean;
export { type PDFPuppeteerOptions, defaultPdfOptions, defaultPdfPuppeteerOptions, defaultPuppeteerOptions } from './defaultOptions.js';
