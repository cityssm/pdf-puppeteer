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
   * If the Puppeteer browser instance should be saved between calls.
   * Default: false
   */
  cacheBrowser: boolean

  /**
   * If the given HTML references remote content, like images and stylesheets.
   * Speed can be increased when set to false.
   * Default: true
   */
  remoteContent: boolean

  /**
   * If the HTML parameter is actually a URL.
   * Default: false
   */
  htmlIsUrl: boolean

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
  cacheBrowser: false,
  disableSandbox: false,
  htmlIsUrl: false,
  remoteContent: true,
  usePackagePuppeteer: false
} as const

export const defaultPuppeteerOptions: puppeteer.LaunchOptions = {
  browser: 'chrome',
  headless: true,
  timeout: secondsToMillis(30)
}

export const htmlNavigationTimeoutMillis = millisecondsInOneMinute
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2
