import type { PaperType } from '@cityssm/paper-sizes'
import type { puppeteer } from '@cityssm/puppeteer-launch'
import { millisecondsInOneMinute, secondsToMillis } from '@cityssm/to-millis'

/*
 * PDF Options
 */

export type PDFOptions = Omit<puppeteer.PDFOptions, 'format'> & {
  format?: PaperType | puppeteer.PaperFormat
}

export const defaultPdfOptions: PDFOptions = {
  format: 'Letter',
  printBackground: true
} as const

/*
 * PDF Puppeteer Options
 */

export interface PDFPuppeteerOptions {
  /**
   * The browser to use.
   * Default: 'chrome'
   */
  browser: puppeteer.SupportedBrowser

  /**
   * If the sandbox should be disabled.
   * Default: false
   */
  disableSandbox: boolean

  /**
   * If true, use whatever version of Puppeteer is installed,
   * which could be a legacy version.
   * Default: false
   */
  usePackagePuppeteer: boolean

  /**
   * The timeout in milliseconds for closing the browser.
   * If the browser is not used for this amount of time,
   * it will be closed automatically.
   * Set to `-1` to disable the timeout.
   * Set to `0` to close the browser after use.
   * Default: `60000` (1 minute)
   */
  browserCloseTimeoutMillis: number
}

export const defaultPdfPuppeteerOptions: PDFPuppeteerOptions = {
  browser: 'chrome',
  browserCloseTimeoutMillis: millisecondsInOneMinute,
  disableSandbox: false,
  usePackagePuppeteer: false
} as const

export const defaultPuppeteerOptions: puppeteer.LaunchOptions = {
  browser: 'chrome',
  headless: true,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  timeout: secondsToMillis(30)
}

export const htmlNavigationTimeoutMillis = millisecondsInOneMinute
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2
