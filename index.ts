import { getPaperSize } from '@cityssm/paper-sizes'
import launchPuppeteer, { type puppeteer } from '@cityssm/puppeteer-launch'
import Debug from 'debug'
import exitHook from 'exit-hook'

import {
  type PDFPuppeteerOptions,
  defaultPdfOptions,
  defaultPdfPuppeteerOptions,
  defaultPuppeteerOptions,
  htmlNavigationTimeoutMillis,
  urlNavigationTimeoutMillis
} from './defaultOptions.js'

const debug = Debug('pdf-puppeteer:index')

let cachedBrowser: puppeteer.Browser | undefined

/**
 * Converts HTML or a webpage into HTML using Puppeteer.
 * @param html - An HTML string, or a URL.
 * @param instancePdfOptions - PDF options for Puppeteer.
 * @param instancePdfPuppeteerOptions - pdf-puppeteer options.
 * @returns - A Buffer of PDF data.
 */
export async function convertHTMLToPDF(
  html: string,
  instancePdfOptions: puppeteer.PDFOptions = {},
  instancePdfPuppeteerOptions: Partial<PDFPuppeteerOptions> = {}
): Promise<Uint8Array> {
  if (typeof html !== 'string') {
    throw new TypeError(
      'Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.'
    )
  }

  const pdfPuppeteerOptions = {
    ...defaultPdfPuppeteerOptions,
    ...instancePdfPuppeteerOptions
  }

  /*
   * Initialize browser
   */

  let browser: puppeteer.Browser | undefined
  let doCloseBrowser = false
  let isRunningPdfGeneration = false

  try {
    if (pdfPuppeteerOptions.cacheBrowser ?? false) {
      if (cachedBrowser === undefined) {
        cachedBrowser = await launchPuppeteer(defaultPuppeteerOptions)
      }

      browser = cachedBrowser
    } else {
      doCloseBrowser = true
      browser = await launchPuppeteer(defaultPuppeteerOptions)
    }

    const browserVersion = await browser.version()

    debug(`Browser: ${browserVersion}`)

    const browserIsFirefox = browserVersion.toLowerCase().includes('firefox')

    /*
     * Initialize page
     */

    const page = await browser.newPage()

    const remoteContent = pdfPuppeteerOptions.remoteContent ?? true

    if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
      debug('Loading URL...')
      await page.goto(html, {
        waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
        timeout: urlNavigationTimeoutMillis
      })
    } else if (remoteContent) {
      debug('Loading HTML with remote content...')
      await page.goto(
        `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
        {
          waitUntil: browserIsFirefox ? 'domcontentloaded' : 'networkidle0',
          timeout: urlNavigationTimeoutMillis
        }
      )
    } else {
      debug('Loading HTML...')
      await page.setContent(html, {
        timeout: remoteContent
          ? urlNavigationTimeoutMillis
          : htmlNavigationTimeoutMillis
      })
    }

    debug('Content loaded.')

    const pdfOptions = { ...defaultPdfOptions, ...instancePdfOptions }

    // Fix "format" issue
    if (pdfOptions.format !== undefined) {
      const size = getPaperSize(pdfOptions.format)
      // eslint-disable-next-line sonarjs/different-types-comparison
      if (size !== undefined) {
        delete pdfOptions.format
        pdfOptions.width = `${size.width}${size.unit}`
        pdfOptions.height = `${size.height}${size.unit}`
      }
    }

    debug('Converting to PDF...')
    isRunningPdfGeneration = true

    const pdfBuffer = await page.pdf(pdfOptions)

    isRunningPdfGeneration = false
    debug('PDF conversion done.')

    await page.close()

    if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
      await browser.close()
    }

    return pdfBuffer
  } catch (error) {
    if (
      isRunningPdfGeneration &&
      defaultPuppeteerOptions.browser === 'chrome'
    ) {
      if (!doCloseBrowser) {
        await closeCachedBrowser()
      }

      defaultPuppeteerOptions.browser = 'firefox'

      debug('Trying again with Firefox.')

      return await convertHTMLToPDF(
        html,
        instancePdfOptions,
        instancePdfPuppeteerOptions
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw error
    }
  } finally {
    try {
      if (doCloseBrowser && browser !== undefined) {
        debug('Closing browser...')
        await browser.close()
        debug('Browser closed.')
      }
    } catch {
      // ignore
    }
  }
}

export default convertHTMLToPDF

/**
 * Closes the cached browser instance.
 */
export async function closeCachedBrowser(): Promise<void> {
  if (cachedBrowser !== undefined) {
    try {
      await cachedBrowser.close()
    } catch {
      // ignore
    }
    cachedBrowser = undefined
  }
}

/**
 * Checks for any cached browser instance.
 * @returns True is a cached browser instance exists.
 */
export function hasCachedBrowser(): boolean {
  return cachedBrowser !== undefined
}

export {
  type PDFPuppeteerOptions,
  defaultPdfOptions,
  defaultPdfPuppeteerOptions
} from './defaultOptions.js'

exitHook(() => {
  debug('Running exit hook.')
  void closeCachedBrowser()
})
