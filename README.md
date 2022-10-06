# PDF-Puppeteer  

[![Codacy grade](https://img.shields.io/codacy/grade/a078dd3403c646399c257ce81359df36)](https://app.codacy.com/gh/cityssm/pdf-puppeteer/dashboard?branch=master)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/pdf-puppeteer)](https://codeclimate.com/github/cityssm/pdf-puppeteer)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/cityssm/pdf-puppeteer)](https://codeclimate.com/github/cityssm/pdf-puppeteer)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/pdf-puppeteer)](https://app.snyk.io/org/cityssm/project/5ca7d9e4-6a88-47dc-b792-753e6bee5c31)

A simple npm package to convert HTML to PDF for Node.js applications by using Puppeteer.

**Based on the work in [westmonroe/pdf-puppeteer](https://github.com/westmonroe/pdf-puppeteer).**
Forked to manage dependencies and switch to ESM.

## Getting Started  

### Installation  
 
```bash
npm install @cityssm/pdf-puppeteer   
```  

### Usage  

```js
import { convertHTMLToPDF } from "@cityssm/pdf-puppeteer";

const callback = (pdf) => {
    // Do something with the PDF, like send it as the response.
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
};

/**
*    Usage
*    @param html - This is the HTML to be converted to a PDF.
*    @param callback - Do something with the PDF.
*    @param [pdfOptions] - Optional parameter to pass in Puppeteer PDF options.
*    @param [puppeteerArguments] - Optional parameter to pass in Puppeteer arguments.
*    @param [remoteContent] - Default true. Optional parameter to specify if there is no remote content. Performance will be optimized for no remote content.
*/
convertHTMLToPDF(html, callback, pdfOptions, puppeteerArguments, remoteContent);
```

The `convertHTMLToPDF()` function takes the four parameters detailed above.

For more information on the available Puppeteer options for PDFs,
take a look at [Puppeteer's Page PDF Options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions).
