var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as puppeteer from "puppeteer";
export const convertHTMLToPDF = (html, callback, pdfOptions, puppeteerArguments, remoteContent = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof html !== "string") {
        throw new TypeError("Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.");
    }
    const browser = yield (puppeteerArguments
        ? puppeteer.launch(puppeteerArguments)
        : puppeteer.launch());
    const page = yield browser.newPage();
    if (!pdfOptions) {
        pdfOptions = { format: "Letter" };
    }
    if (remoteContent) {
        yield page.goto(`data:text/html;base64,${Buffer.from(html).toString("base64")}`, {
            waitUntil: "networkidle0"
        });
    }
    else {
        yield page.setContent(html);
    }
    yield page.pdf(pdfOptions).then(callback, (error) => {
        console.log(error);
    });
    yield browser.close();
});
export default convertHTMLToPDF;
