import { type PDFOptions, type PDFPuppeteerOptions } from './defaultOptions.js';
export declare class PdfPuppeteer {
    #private;
    constructor(pdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>);
    /**
     * Converts HTML content to a PDF document.
     * This method can handle both local HTML content and remote resources.
     * If the HTML contains remote content, it will fetch those resources.
     * If `hasRemoteContent` is `false`, it will load the HTML without fetching remote resources.
     * @param html - The HTML content to convert to PDF.
     * @param pdfOptions - Options for the PDF generation.
     * The options can include:
     * - `format`: The paper format (e.g., 'Letter', 'A4').
     * - `width` and `height`: Custom dimensions for the PDF.
     * If `false`, the HTML will be loaded without fetching remote resources.
     * @returns A Promise that resolves to a Uint8Array containing the PDF data.
     * @throws {TypeError} If the `html` parameter is not a string.
     * @throws {Error} If there is an issue with loading the HTML or generating the PDF.
     */
    fromHtml(html: string, pdfOptions?: PDFOptions): Promise<Uint8Array>;
    /**
     * Converts a URL to a PDF document.
     * This method loads the content of the URL and generates a PDF from it.
     * @param url - The URL to convert to PDF.
     * It should be a valid URL string.
     * @throws {TypeError} If the `url` parameter is not a string.
     * @param pdfOptions - Options for the PDF generation.
     * The options can include:
     * - `format`: The paper format (e.g., 'Letter', 'A4').
     * - `width` and `height`: Custom dimensions for the PDF.
     * @throws {Error} If there is an issue with loading the URL or generating the PDF.
     * @returns A Promise that resolves to a Uint8Array containing the PDF data.
     */
    fromUrl(url: string, pdfOptions?: PDFOptions): Promise<Uint8Array>;
    /**
     * Closes the Puppeteer browser instance.
     * This method ensures that the browser is closed properly.
     */
    closeBrowser(): Promise<void>;
}
export default PdfPuppeteer;
export { installChromeBrowser, installFirefoxBrowser } from '@cityssm/puppeteer-launch';
