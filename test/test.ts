import assert from 'node:assert'
import fs from 'node:fs/promises'
import os from 'node:os'
import { describe, it } from 'node:test'

import isPdf from '@cityssm/is-pdf'
import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import PdfPuppeteer from '../index.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

debug(`Platform: ${os.platform()}`)
debug(`Release:  ${os.release()}`)

const validMessage = 'PDF should be valid'

const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`

await describe('pdf-puppeteer', async () => {
  await it('Converts HTML to PDF', async () => {
    let isValidPdf = false

    const pdfPuppeteer = new PdfPuppeteer({
      disableSandbox: true
    })

    try {
      const pdf = await pdfPuppeteer.fromHtml(html, {
          format: 'Legal'
        })

      await fs.writeFile('./test/output/html.pdf', pdf)

      isValidPdf = isPdf(pdf)
    } finally {
      await pdfPuppeteer.closeBrowser()
    }

    assert.ok(isValidPdf, validMessage)
  })

  await it('Converts a website to PDF', async () => {
    let isValidPdf = false

    const pdfPuppeteer = new PdfPuppeteer({
      disableSandbox: true
    })

    try {
      const pdf = await pdfPuppeteer.fromUrl('https://cityssm.github.io/', {
        format: 'ARCH A'
      })

      await fs.writeFile('./test/output/url.pdf', pdf)

      isValidPdf = isPdf(pdf)
    } finally {
      await pdfPuppeteer.closeBrowser()
    }

    assert.ok(isValidPdf, validMessage)
  })
})
