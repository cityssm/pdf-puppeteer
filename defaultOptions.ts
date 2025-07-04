import type { puppeteer } from '@cityssm/puppeteer-launch'
import { millisecondsInOneMinute, secondsToMillis } from '@cityssm/to-millis'

/*
 * PDF Options
 */

export const defaultPdfOptions: puppeteer.PDFOptions = {
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
  browser?: puppeteer.SupportedBrowser

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
}

export const defaultPdfPuppeteerOptions: PDFPuppeteerOptions = {
  browser: 'chrome',
  disableSandbox: false,
  usePackagePuppeteer: false
} as const

export const defaultPuppeteerOptions: puppeteer.LaunchOptions = {
  browser: 'chrome',
  headless: true,
  timeout: secondsToMillis(30)
}

export const htmlNavigationTimeoutMillis = millisecondsInOneMinute
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2
