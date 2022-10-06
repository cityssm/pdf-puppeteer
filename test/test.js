import * as assert from "assert";
import { convertHTMLToPDF } from "../index.js";
const html = `<html>
<head><title>Test</title></head>
<body><h1>Hello World</h1></body>
</html>`;
describe("pdf-puppeteer", () => {
    it("Converts HTML To PDF", (done) => {
        convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, undefined, undefined, false);
    });
    it("Converts remote HTML To PDF with Puppeteer Arguments", (done) => {
        convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, { format: "A4" }, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }, true);
    });
    it("Converts HTML To PDF with Puppeteer Arguments", (done) => {
        convertHTMLToPDF(html, (pdf) => {
            assert.strictEqual(Object.prototype.toString.call(pdf), "[object Uint8Array]");
            done();
        }, { format: "A4" }, {
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
    });
});
