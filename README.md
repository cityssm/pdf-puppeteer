# PDF-Puppeteer

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/pdf-puppeteer)](https://www.npmjs.com/package/@cityssm/pdf-puppeteer)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/pdf-puppeteer)](https://codeclimate.com/github/cityssm/pdf-puppeteer)
[![codecov](https://codecov.io/gh/cityssm/pdf-puppeteer/graph/badge.svg?token=306EDSL6BF)](https://codecov.io/gh/cityssm/pdf-puppeteer)
[![DeepSource](https://app.deepsource.com/gh/cityssm/pdf-puppeteer.svg/?label=active+issues&show_trend=true&token=8YWipc8F8ZoQEwCuWK4duIuj)](https://app.deepsource.com/gh/cityssm/pdf-puppeteer/)
[![Coverage Testing](https://github.com/cityssm/pdf-puppeteer/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/pdf-puppeteer/actions/workflows/coverage.yml)

A simple npm package to convert HTML to PDF for Node.js applications by using Puppeteer.

**Based on the work in [westmonroe/pdf-puppeteer](https://github.com/westmonroe/pdf-puppeteer).**
Forked to manage dependencies, switch to ESM, and eliminate the callback function.

## Installation

```sh
npm install @cityssm/pdf-puppeteer
```

## Usage

```js
import { convertHTMLToPDF } from "@cityssm/pdf-puppeteer";

/**
 * Usage
 * @param html - This is the HTML to be converted to a PDF.
 * @param [pdfOptions] - Optional parameter to pass in Puppeteer PDF options.
 * @param [pdfPuppeteerOptions] - Optional parameter to pass in PDF Puppeteer options.
 */
const pdfBuffer = await convertHTMLToPDF(html, pdfOptions, pdfPuppeteerOptions);

// Do something with the PDF, like send it as the response.
res.setHeader("Content-Type", "application/pdf");
res.send(pdfBuffer);
```

The `convertHTMLToPDF()` function takes the three parameters detailed above.

For more information on the available Puppeteer options for PDFs,
take a look at [Puppeteer's Page PDF Options](https://pptr.dev/api/puppeteer.pdfoptions).

### PDF Puppeteer Options

| Option          | Description                                                                        | Default Value |
| --------------- | ---------------------------------------------------------------------------------- | ------------- |
| `cacheBrowser`  | Whether or not the Puppeter browser instance should be saved between PDFs.         | `false`       |
| `remoteContent` | Whether or not the HTML contains remote content.                                   | `true`        |
| `htmlIsUrl`     | Whether or not the `html` parameter is actually a URL that should be navigated to. | `false`       |
