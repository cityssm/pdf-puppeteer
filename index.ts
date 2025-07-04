import launchPuppeteer, { type puppeteer } from '@cityssm/puppeteer-launch'
import Debug from 'debug'
import exitHook from 'exit-hook'

import { DEBUG_NAMESPACE } from './debug.config.js'
import {
  type PDFOptions,
  type PDFPuppeteerOptions,
  defaultPdfPuppeteerOptions,
  defaultPuppeteerOptions,
  htmlNavigationTimeoutMillis,
  urlNavigationTimeoutMillis
} from './defaultOptions.js'
import pageToPdf from './pageToPdf.js'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export class PdfPuppeteer {
  #browser: puppeteer.Browser | undefined
  #browserTimeout: NodeJS.Timeout | undefined

  #puppeteerOptions: puppeteer.LaunchOptions

  readonly #pdfPuppeteerOptions: PDFPuppeteerOptions

  constructor(pdfPuppeteerOptions: Partial<PDFPuppeteerOptions> = {}) {
    this.#pdfPuppeteerOptions = {
      ...defaultPdfPuppeteerOptions,
      ...pdfPuppeteerOptions
    }

    exitHook(() => {
      debug('Exit hook triggered. Closing browser...')
      this.#clearBrowserCloseTimeout()
      void this.closeBrowser()
    })
  }

  #clearBrowserCloseTimeout(): void {
    if (this.#browserTimeout !== undefined) {
      try {
        clearTimeout(this.#browserTimeout)
      } catch (error) {
        debug('Error clearing browser close timeout:', error)
      }

      this.#browserTimeout = undefined
    }
  }

  #setBrowserCloseTimeout(): void {
    this.#clearBrowserCloseTimeout()

    if (this.#pdfPuppeteerOptions.browserCloseTimeoutMillis > 0) {
      this.#browserTimeout = setTimeout(() => {
        debug('Browser timeout reached. Closing browser...')
        void this.closeBrowser()
      }, this.#pdfPuppeteerOptions.browserCloseTimeoutMillis)
    }
  }

  async #initializePage(): Promise<puppeteer.Page> {
    this.#clearBrowserCloseTimeout()

    if (this.#browser === undefined || !this.#browser.connected) {
      this.#puppeteerOptions = {
        ...defaultPuppeteerOptions,
        browser: this.#pdfPuppeteerOptions.browser
      }

      if (this.#pdfPuppeteerOptions.disableSandbox) {
        this.#puppeteerOptions.args = [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      }

      let puppeteerLaunchFunction = launchPuppeteer

      if (this.#pdfPuppeteerOptions.usePackagePuppeteer) {
        const puppeteerPackage = await import('puppeteer')
        puppeteerLaunchFunction = puppeteerPackage.launch
      }

      this.#browser = await puppeteerLaunchFunction(this.#puppeteerOptions)
    }

    return await this.#browser.newPage()
  }

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
  async fromHtml(
    html: string,
    pdfOptions: PDFOptions = {}
  ): Promise<Uint8Array> {
    if (typeof html !== 'string') {
      throw new TypeError(
        'Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.'
      )
    }

    const page = await this.#initializePage()

    await page.goto(
      `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
      {
        timeout: htmlNavigationTimeoutMillis,
        waitUntil:
          this.#puppeteerOptions.browser === 'firefox'
            ? 'domcontentloaded'
            : 'networkidle0'
      }
    )

    debug('Content loaded.')

    const pdf = await pageToPdf(page, pdfOptions)

    await page.close()

    const remainingPages = await this.#browser?.pages()

    if (
      this.#pdfPuppeteerOptions.browserCloseTimeoutMillis === 0 &&
      (remainingPages?.length ?? 0) <= 1
    ) {
      debug('Browser close timeout is set to 0. Closing browser immediately.')
      await this.closeBrowser()
    } else {
      this.#setBrowserCloseTimeout()
    }

    return pdf
  }

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
  async fromUrl(url: string, pdfOptions: PDFOptions = {}): Promise<Uint8Array> {
    if (typeof url !== 'string') {
      throw new TypeError(
        'Invalid Argument: URL expected as type of string and received a value of a different type. Check your request body and request headers.'
      )
    }

    const page = await this.#initializePage()

    debug('Loading URL...')

    await page.goto(url, {
      timeout: urlNavigationTimeoutMillis,
      waitUntil:
        this.#puppeteerOptions.browser === 'firefox'
          ? 'domcontentloaded'
          : 'networkidle0'
    })

    debug('Content loaded.')

    const pdf = await pageToPdf(page, pdfOptions)

    await page.close()

    const remainingPages = await this.#browser?.pages()

    if (
      this.#pdfPuppeteerOptions.browserCloseTimeoutMillis === 0 &&
      (remainingPages?.length ?? 0) <= 1
    ) {
      debug('Browser close timeout is set to 0. Closing browser immediately.')
      await this.closeBrowser()
    } else {
      this.#setBrowserCloseTimeout()
    }

    return pdf
  }

  /**
   * Closes the Puppeteer browser instance.
   * This method ensures that the browser is closed properly.
   */
  async closeBrowser(): Promise<void> {
    if (this.#browser !== undefined) {
      debug('Closing browser...')

      this.#clearBrowserCloseTimeout()

      try {
        await this.#browser.close()
      } catch (error) {
        debug('Error closing browser:', error)
      }

      this.#browser = undefined
    }
  }
}

export default PdfPuppeteer
