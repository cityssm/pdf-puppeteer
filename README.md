# PDF-Puppeteer

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/pdf-puppeteer)](https://www.npmjs.com/package/@cityssm/pdf-puppeteer)
[![codecov](https://codecov.io/gh/cityssm/pdf-puppeteer/graph/badge.svg?token=306EDSL6BF)](https://codecov.io/gh/cityssm/pdf-puppeteer)
[![DeepSource](https://app.deepsource.com/gh/cityssm/pdf-puppeteer.svg/?label=active+issues&show_trend=true&token=8YWipc8F8ZoQEwCuWK4duIuj)](https://app.deepsource.com/gh/cityssm/pdf-puppeteer/)
[![Coverage Testing](https://github.com/cityssm/pdf-puppeteer/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/pdf-puppeteer/actions/workflows/coverage.yml)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=cityssm_pdf-puppeteer&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=cityssm_pdf-puppeteer)

Converts URLs and HTML to PDFs using Puppeteer.

**Based on the work in [westmonroe/pdf-puppeteer](https://github.com/westmonroe/pdf-puppeteer).**

## Installation

```sh
npm install @cityssm/pdf-puppeteer
```

## Usage

```js
import PdfPuppeteer from '@cityssm/pdf-puppeteer'

// Initialize PDF Puppeteer.
const pdfPuppeteer = new PdfPuppeteer(pdfPuppeteerOptions)

// Convert a website to a PDF.
const pdfBufferFromUrl = await pdfPuppeteer.fromUrl(url, pdfOptions)

// Convert HTML to a PDF.
const pdfBufferFromHTML = await pdfPuppeteer.fromHtml(html, pdfOptions)

// Do something with the PDF, like send it as the response.
res.setHeader('Content-Type', 'application/pdf')
res.send(pdfBufferFromHTML)
```

For more information on the available Puppeteer options for PDFs (`pdfOptions`),
take a look at [Puppeteer's Page PDF Options](https://pptr.dev/api/puppeteer.pdfoptions).

### PDF Puppeteer Options

| Option                | Description                                                                                    | Default Value |
| --------------------- | ---------------------------------------------------------------------------------------------- | ------------- |
| `browser`             | The web browser to use for PDF generation, either `"chrome"` or `"firefox"`                    | `"chrome"`    |
| `disableSandbox`      | Required in some secure environments.                                                          | `false`       |
| `usePackagePuppeteer` | Use the version of Puppeteer installed in the package rather than `@cityssm/puppeteer-launch`. | `false`       |

## Related Project

[**@cityssm/paper-sizes**](https://github.com/cityssm/node-paper-sizes)<br />
Retrieves exact dimensions for common paper sizes, including North American (ANSI and ARCH) and ISO. 

[**@cityssm/puppeteer-launch**](https://github.com/cityssm/puppeteer-launch)<br />
Launches Puppeteer, falling back to system browsers when the cached ones aren't working or aren't available.
