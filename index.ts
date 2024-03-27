import browserLauncher from '@httptoolkit/browser-launcher'
import Debug from 'debug'
import exitHook from 'exit-hook'
import * as puppeteer from 'puppeteer'

import {
  type PDFPuppeteerOptions,
  defaultPdfOptions,
  defaultPdfPuppeteerOptions,
  defaultPuppeteerOptions
} from './defaultOptions.js'

const debug = Debug('pdf-puppeteer')

let cachedBrowser: puppeteer.Browser | undefined
let cachedBrowserOptions: string

async function launchBrowser(
  puppeteerOptions: puppeteer.PuppeteerLaunchOptions
): Promise<puppeteer.Browser> {
  try {
    return await puppeteer.launch(puppeteerOptions)
  } catch (error) {
    return await new Promise((resolve) => {
      browserLauncher.detect((browsers) => {
        const browser = browsers.find((possibleBrowser) => {
          return (
            possibleBrowser.type === puppeteerOptions.product ||
            (puppeteerOptions.product === 'chrome' &&
              possibleBrowser.name === 'chromium')
          )
        })

        if (browser === undefined) {
          debug(`No available browsers for ${puppeteerOptions.product}:`)
          debug(browsers)
          throw error
        } else {
          debug('Using system browser:')
          debug(browser)
          resolve(
            puppeteer.launch(
              Object.assign(
                {},
                {
                  executablePath: browser.command
                },
                puppeteerOptions
              )
            )
          )
        }
      })
    })
  }
}

/**
 * Converts HTML or a webpage into HTML using Puppeteer.
 * @param {string} html - An HTML string, or a URL.
 * @param {puppeteer.PDFOptions} instancePdfOptions - PDF options for Puppeteer.
 * @param {puppeteer.PuppeteerLaunchOptions} instancePuppeteerOptions - Puppeteer browser options.
 * @param {Partial<PDFPuppeteerOptions>} instancePdfPuppeteerOptions - pdf-puppeteer options.
 * @returns {Promise<Buffer>} - A Buffer of PDF data.
 */
export async function convertHTMLToPDF(
  html: string,
  instancePdfOptions?: puppeteer.PDFOptions,
  instancePuppeteerOptions?: puppeteer.PuppeteerLaunchOptions,
  instancePdfPuppeteerOptions?: Partial<PDFPuppeteerOptions>
): Promise<Buffer> {
  if (typeof html !== 'string') {
    throw new TypeError(
      'Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.'
    )
  }

  const puppeteerOptions = Object.assign(
    {},
    defaultPuppeteerOptions,
    instancePuppeteerOptions
  )

  const pdfPuppeteerOptions = Object.assign(
    {},
    defaultPdfPuppeteerOptions,
    instancePdfPuppeteerOptions
  )

  /*
   * Initialize browser
   */
  let browser: puppeteer.Browser

  if (pdfPuppeteerOptions.cacheBrowser ?? false) {
    const currentPuppeteerOptions = JSON.stringify(puppeteerOptions)

    if (
      cachedBrowserOptions === undefined ||
      cachedBrowser === undefined ||
      currentPuppeteerOptions !== cachedBrowserOptions
    ) {
      debug('Initialize new cached browser.')

      if (cachedBrowser !== undefined) {
        debug('Kill current cached browser.')

        if (cachedBrowser.pages.length === 0) {
          debug('All pages closed, kill browser.')
          await cachedBrowser.close()
          cachedBrowser = undefined
        }
      }

      cachedBrowser = await launchBrowser(puppeteerOptions)
      cachedBrowserOptions = currentPuppeteerOptions
    }

    browser = cachedBrowser
  } else {
    browser = await launchBrowser(puppeteerOptions)
  }

  /*
   * Initialize page
   */
  const page = await browser.newPage()

  if (pdfPuppeteerOptions.htmlIsUrl ?? false) {
    await page.goto(html, {
      waitUntil: 'networkidle0'
    })
  } else if (pdfPuppeteerOptions.remoteContent ?? true) {
    await page.goto(
      `data:text/html;base64,${Buffer.from(html).toString('base64')}`,
      {
        waitUntil: 'networkidle0'
      }
    )
  } else {
    await page.setContent(html)
  }

  const pdfOptions = Object.assign({}, defaultPdfOptions, instancePdfOptions)

  const pdfBuffer = await page.pdf(pdfOptions)

  await page.close()

  if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
    await browser.close()
  }

  return pdfBuffer
}

export default convertHTMLToPDF

/**
 * Closes any cached browser instances.
 */
export async function closeCachedBrowser(): Promise<void> {
  if (cachedBrowser !== undefined) {
    try {
      await cachedBrowser.close()
    } catch {}
    cachedBrowser = undefined
  }
}

/**
 * Checks for any cached browser instances.
 * @returns {boolean} - True is a cached browser instance exists.
 */
export function hasCachedBrowser(): boolean {
  return cachedBrowser !== undefined
}

export {
  type PDFPuppeteerOptions,
  defaultPdfOptions,
  defaultPdfPuppeteerOptions,
  defaultPuppeteerOptions
} from './defaultOptions.js'

exitHook(() => {
  debug('Running exit hook.')
  void closeCachedBrowser()
})
