var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as assert from "assert";
import * as pdfPuppeteer from "../index.js";
const html = `<html>
<head><title>Test</title></head>
<body><h1>Hello World</h1></body>
</html>`;
describe("pdf-puppeteer", () => {
    it("Converts HTML to PDF with a new browser", (done) => {
        pdfPuppeteer.convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, undefined, undefined, {
            cacheBrowser: false,
            remoteContent: false
        });
    });
    it("Converts HTML to PDF with a cached browser", (done) => {
        pdfPuppeteer.convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, undefined, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }, {
            cacheBrowser: true,
            remoteContent: false
        });
    });
    it("Converts remote HTML to PDF with Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, { format: "Letter" }, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }, {
            cacheBrowser: true,
            remoteContent: true
        });
    });
    it("Converts HTML to PDF with Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, { format: "A4" }, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }, {
            cacheBrowser: true
        });
    });
    it("Converts a website to PDF with different Puppeteer options", (done) => {
        pdfPuppeteer.convertHTMLToPDF("https://cityssm.github.io/", (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, undefined, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            env: {
                environment: "pdf-puppeteer"
            }
        }, {
            cacheBrowser: true,
            remoteContent: false,
            htmlIsUrl: true
        });
    });
    it("Throws an error if the html parameter is not a string", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield pdfPuppeteer.convertHTMLToPDF(123456789, () => {
                assert.fail("No error thrown.");
            });
        }
        catch (_error) {
            assert.ok("Error thrown");
        }
    }));
    it("Closes cached browsers", () => __awaiter(void 0, void 0, void 0, function* () {
        if (pdfPuppeteer.hasCachedBrowser) {
            yield pdfPuppeteer.closeCachedBrowser();
        }
        assert.strictEqual(pdfPuppeteer.hasCachedBrowser, false);
    }));
});
