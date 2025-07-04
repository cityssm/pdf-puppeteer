import { type puppeteer } from '@cityssm/puppeteer-launch';
import { type PDFPuppeteerOptions } from './defaultOptions.js';
export declare class PdfPuppeteer {
    #private;
    constructor(pdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>);
    fromHtml(html: string, pdfOptions?: puppeteer.PDFOptions, hasRemoteContent?: boolean): Promise<Uint8Array>;
    fromUrl(url: string, pdfOptions?: puppeteer.PDFOptions): Promise<Uint8Array>;
    close(): Promise<void>;
}
export default PdfPuppeteer;
