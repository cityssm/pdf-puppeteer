import type { PDFOptions, PuppeteerLaunchOptions } from 'puppeteer'

/*
 * Puppeteer Options
 */

export const defaultPuppeteerOptions: PuppeteerLaunchOptions = Object.freeze({
  product: 'chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
  timeout: 60_000
})

/*
 * PDF Options
 */

export const defaultPdfOptions: PDFOptions = Object.freeze({
  format: 'Letter'
})

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

  /**
   * Switch from 'chrome' to 'firefox', or vice versa, if unable to launch the browser.
   */
  switchBrowserIfFail: boolean
}

export const defaultPdfPuppeteerOptions: PDFPuppeteerOptions = Object.freeze({
  cacheBrowser: false,
  remoteContent: true,
  htmlIsUrl: false,
  switchBrowserIfFail: true
})