import * as assert from "assert";

import * as pdfPuppeteer from "../index.js";

const html = `<html>
<head><title>Test</title></head>
<body><h1>Hello World</h1></body>
</html>`;

describe("pdf-puppeteer", () => {
    // Loose check that this is not erroring, basically
    // TODO find way to compare values of PDF's generated with returned array buffer
    it("Converts HTML to PDF with a new browser", (done) => {
        pdfPuppeteer.convertHTMLToPDF(
            html,
            (pdf) => {
                assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
                done();
            },
            undefined,
            undefined,
            {
                cacheBrowser: false,
                remoteContent: false
            }
        );
    });

    it("Converts HTML to PDF with a cached browser", (done) => {
        pdfPuppeteer.convertHTMLToPDF(
            html,
            (pdf) => {
                assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
                done();
            },
            undefined,
            {
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            },
            {
                cacheBrowser: true,
                remoteContent: false
            }
        );
    });

    it("Converts remote HTML to PDF with Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF(
            html,
            (pdf) => {
                assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
                done();
            },
            { format: "Letter" },
            {
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            },
            {
                cacheBrowser: true,
                remoteContent: true
            }
        );
    });

    it("Converts HTML to PDF with Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF(
            html,
            (pdf) => {
                assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
                done();
            },
            { format: "A4" },
            {
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            },
            {
                cacheBrowser: true
            }
        );
    });

    it("Converts a website to PDF with different Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF(
            "https://cityssm.github.io/",
            (pdf) => {
                assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
                done();
            },
            undefined,
            {
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                env: {
                    environment: "pdf-puppeteer"
                }
            },
            {
                cacheBrowser: true,
                remoteContent: false,
                htmlIsUrl: true
            }
        );
    });

    it("Throws an error if the html parameter is not a string", async () => {
        try {
            await pdfPuppeteer.convertHTMLToPDF(123_456_789, () => {
                assert.fail("No error thrown.");
            });
        } catch (_error) {
            assert.ok("Error thrown");
        }
    });

    it("Closes cached browsers", async () => {
        if (pdfPuppeteer.hasCachedBrowser) {
            await pdfPuppeteer.closeCachedBrowser();
        }

        assert.strictEqual(pdfPuppeteer.hasCachedBrowser, false);
    });
});
