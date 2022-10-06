# PDF-Puppeteer  

[![Codacy grade](https://img.shields.io/codacy/grade/a078dd3403c646399c257ce81359df36)](https://app.codacy.com/gh/cityssm/pdf-puppeteer/dashboard?branch=master)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/pdf-puppeteer)](https://codeclimate.com/github/cityssm/pdf-puppeteer)

A simple npm package to convert HTML to PDF for Node.js applications by using Puppeteer.

**Based on the work in [westmonroe/pdf-puppeteer](https://github.com/westmonroe/pdf-puppeteer).**
Forked to better manage dependencies and switch to ESM.

## Getting Started  

### Installation  

To use PDF-Puppeteer in your Node app:  
 
```bash
npm install @cityssm/pdf-puppeteer   
```  

### Requirements
Node 12 or greater.

### Usage  

```js
import { convertHTMLToPDF } from "@cityssm/pdf-puppeteer";

const callback = (pdf) => {
    // do something with the PDF like send it as the response
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
};

/**
*    Usage
*    @param html - This is the html to be converted to a pdf
*    @param callback - Do something with the PDF
*    @param [pdfOptions] - Optional parameter to pass in Puppeteer PDF options
*    @param [puppeteerArguments] - Optional parameter to pass in Puppeter arguments
*    @param [remoteContent] - Default true. Optional parameter to specify if there is no remote content. Performance will be optimized for no remote content.
*/
convertHTMLToPDF(html, callback, pdfOptions, puppeteerArguments, remoteContent);
```

The `convertHTMLToPDF` function takes the four parameters detailed above.
For more information on the available Puppeteer options for PDF's take a look at [Puppeteer's Page PDF Options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions).
