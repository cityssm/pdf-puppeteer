import { type puppeteer } from '@cityssm/puppeteer-launch'

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
   * Whether or not the Puppeteer browser instance should be saved between calls.
   * Default: false
   */
  cacheBrowser: boolean

  /**
   * Whether or not the given HTML references remote content, like images and stylesheets.
   * Speed can be increased when set to false.
   * Default: true
   */
  remoteContent: boolean

  /**
   * Whether or not the HTML parameter is actually a URL.
   * Default: false
   */
  htmlIsUrl: boolean
}

export const defaultPdfPuppeteerOptions: PDFPuppeteerOptions = {
  cacheBrowser: false,
  remoteContent: true,
  htmlIsUrl: false
} as const

export const htmlNavigationTimeoutMillis = 60_000
export const urlNavigationTimeoutMillis = htmlNavigationTimeoutMillis * 2
