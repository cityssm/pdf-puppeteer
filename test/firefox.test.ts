import assert from 'node:assert'
import os from 'node:os'
import { describe, it } from 'node:test'

import isPdf from '@cityssm/is-pdf'
import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js'
import * as pdfPuppeteer from '../index.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug('pdf-puppeteer:test:firefox')

debug(`Platform: ${os.platform()}`)
debug(`Release:  ${os.release()}`)

const html = `<html>
  <head><title>Test</title></head>
  <body><h1>Hello World</h1></body>
  </html>`

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

