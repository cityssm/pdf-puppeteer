// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-call */

import assert from 'node:assert'
import fs from 'node:fs/promises'
import { after, describe, it } from 'node:test'

import isPdf from 'is-pdf'

import * as pdfPuppeteer from '../index.js'

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
      remoteContent: false
    })

    assert.ok(isPdf(pdf))
  })

  await it('Converts HTML to PDF with a cached browser', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(html, undefined, {
      cacheBrowser: true,
      remoteContent: false
    })

    assert.ok(isPdf(pdf))
  })

  await it('Converts remote HTML to PDF with Puppeteer options', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(
      html,
      { format: 'Legal' },
      {
        cacheBrowser: true,
        remoteContent: true
      }
    )

    await fs.writeFile('./test/output/html.pdf', pdf)

    assert.ok(isPdf(pdf))
  })

  await it('Converts HTML to PDF with Puppeteer options', async () => {
    const pdf = await pdfPuppeteer.convertHTMLToPDF(
      html,
      { format: 'Letter' },
      {
        cacheBrowser: true
      }
    )

    assert.ok(isPdf(pdf))
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
        htmlIsUrl: true
      }
    )

    await fs.writeFile('./test/output/url.pdf', pdf)

    assert.ok(isPdf(pdf))
  })

  await it('Throws an error if the html parameter is not a string', async () => {
    try {
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
