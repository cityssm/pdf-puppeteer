import { getPaperSize } from '@cityssm/paper-sizes'
import type { puppeteer } from '@cityssm/puppeteer-launch'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from './debug.config.js'
import { type PDFOptions, defaultPdfOptions } from './defaultOptions.js'

const debug = Debug(`${DEBUG_NAMESPACE}:pageToPdf`)

/**
 * Converts a Puppeteer page to a PDF document.
 * @param page The Puppeteer page to convert to PDF.
 * @param instancePdfOptions Options for the PDF generation.
 * The options can include:
 * - `format`: The paper format (e.g., 'Letter', 'A4').
 * - `width` and `height`: Custom dimensions for the PDF.
 * @returns A Promise that resolves to a Uint8Array containing the PDF data.
 */
export default async function pageToPdf(
  page: puppeteer.Page,
  instancePdfOptions: PDFOptions = {}
): Promise<Uint8Array> {
  debug('Generating PDF...')

  const pdfOptions = {
    ...defaultPdfOptions,
    ...instancePdfOptions
  }

  if (pdfOptions.format !== undefined) {
    const size = getPaperSize(pdfOptions.format)

    // eslint-disable-next-line sonarjs/different-types-comparison, @typescript-eslint/no-unnecessary-condition
    if (size !== undefined) {
      delete pdfOptions.format
      pdfOptions.width = `${size.width}${size.unit}`
      pdfOptions.height = `${size.height}${size.unit}`
    }
  }

  debug('Converting to PDF...')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const pdfBuffer = await page.pdf(pdfOptions as puppeteer.PDFOptions)

  debug('PDF conversion done.')
  debug(`PDF size: ${pdfBuffer.length} bytes`)

  return pdfBuffer
}
