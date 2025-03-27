import assert from 'node:assert'
import fs from 'node:fs/promises'
import os from 'node:os'
import { after, describe, it } from 'node:test'

import isPdf from '@cityssm/is-pdf'
import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js'
import * as pdfPuppeteer from '../index.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug('pdf-puppeteer:test')

debug(`Platform: ${os.platform()}`)
debug(`Release: ${os.release()}`)

const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`

await describe('pdf-puppeteer', async () => {
  after(async () => {
    await pdfPuppeteer.closeCachedBrowser()
  })

  await it('Converts HTML to PDF with a new browser', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
      cacheBrowser: false,
      remoteContent: false,
      disableSandbox: true
    })

    assert.ok(Boolean(isPdf(pdf)))
  })

  await it('Converts HTML to PDF with a cached browser', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
      cacheBrowser: true,
      remoteContent: false,
      disableSandbox: true
    })

    assert.ok(Boolean(isPdf(pdf)))
  })

  await it('Converts remote HTML to PDF with Puppeteer options', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(
      html,
      { format: 'Legal' },
      {
        cacheBrowser: true,
        remoteContent: true,
        disableSandbox: true
      }
    )

    await fs.writeFile('./test/output/html.pdf', pdf)

    assert.ok(Boolean(isPdf(pdf)))
  })

  await it('Converts HTML to PDF with Puppeteer options', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(
      html,
      { format: 'Letter' },
      {
        cacheBrowser: true,
        disableSandbox: true
      }
    )

    assert.ok(Boolean(isPdf(pdf)))
  })

  await it('Converts a website to PDF', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(
      'https://cityssm.github.io/',
      {
        format: 'Letter'
      },
      {
        cacheBrowser: true,
        remoteContent: false,
        htmlIsUrl: true,
        disableSandbox: true
      }
    )

    await fs.writeFile('./test/output/url.pdf', pdf)

    assert.ok(Boolean(isPdf(pdf)))
  })

  await it('Throws an error if the html parameter is not a string', async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      await pdfPuppeteer.convertHTMLToPDF(123_456_789)
      assert.fail('No error thrown.')
    } catch {
      assert.ok('Error thrown')
    }
  })

  await it('Closes cached browsers', async () => {
    if (pdfPuppeteer.hasCachedBrowser()) {
      await pdfPuppeteer.closeCachedBrowser()
    }

    assert.strictEqual(pdfPuppeteer.hasCachedBrowser(), false)
  })
})

await describe.skip('pdf-puppeteer/firefox', async () => {

  await it('Converts HTML to PDF with a new Firefox browser', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
      browser: 'firefox',
      cacheBrowser: false,
      disableSandbox: true,
      remoteContent: false
    })

    assert.ok(Boolean(isPdf(pdf)))
  })

})
