import type { puppeteer } from '@cityssm/puppeteer-launch';
import { type PDFOptions } from './defaultOptions.js';
/**
 * Converts a Puppeteer page to a PDF document.
 * @param page The Puppeteer page to convert to PDF.
 * @param instancePdfOptions Options for the PDF generation.
 * The options can include:
 * - `format`: The paper format (e.g., 'Letter', 'A4').
 * - `width` and `height`: Custom dimensions for the PDF.
 * @returns A Promise that resolves to a Uint8Array containing the PDF data.
 */
export default function pageToPdf(page: puppeteer.Page, instancePdfOptions?: PDFOptions): Promise<Uint8Array>;
