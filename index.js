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
import exitHook from "exit-hook";
import Debug from "debug";
const debug = Debug("pdf-puppeteer");
export const defaultPuppeteerOptions = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
};
export const defaultPdfOptions = {};
export const defaultPdfPuppeteerOptions = {
    cacheBrowser: false,
    remoteContent: true,
    htmlIsUrl: false
};
let cachedBrowser;
let cachedBrowserOptions;
export const convertHTMLToPDF = (html, callback, instancePdfOptions, instancePuppeteerOptions, instancePdfPuppeteerOptions) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof html !== "string") {
        throw new TypeError("Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers.");
    }
    const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, instancePuppeteerOptions);
    const pdfPuppeteerOptions = Object.assign({}, defaultPdfPuppeteerOptions, instancePdfPuppeteerOptions);
    let browser;
    if (pdfPuppeteerOptions.cacheBrowser) {
        const currentPuppeteerOptions = JSON.stringify(instancePuppeteerOptions);
        if (!cachedBrowserOptions ||
            !cachedBrowser ||
            currentPuppeteerOptions !== cachedBrowserOptions) {
            debug("Initialize new cached browser.");
            if (cachedBrowser) {
                debug("Kill current cached browser.");
                if (cachedBrowser.pages.length === 0) {
                    debug("All pages closed, kill browser.");
                    yield cachedBrowser.close();
                    cachedBrowser = undefined;
                }
            }
            cachedBrowser = yield puppeteer.launch(puppeteerOptions);
            cachedBrowserOptions = currentPuppeteerOptions;
        }
        browser = cachedBrowser;
    }
    else {
        browser = yield puppeteer.launch(puppeteerOptions);
    }
    const page = yield browser.newPage();
    if (pdfPuppeteerOptions.htmlIsUrl) {
        yield page.goto(html, {
            waitUntil: "networkidle0"
        });
    }
    else if (pdfPuppeteerOptions.remoteContent) {
        yield page.goto(`data:text/html;base64,${Buffer.from(html).toString("base64")}`, {
            waitUntil: "networkidle0"
        });
    }
    else {
        yield page.setContent(html);
    }
    const pdfOptions = Object.assign({}, defaultPdfOptions, instancePdfOptions);
    yield page.pdf(pdfOptions).then(callback, (error) => {
        debug(error);
    });
    yield page.close();
    if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
        yield browser.close();
    }
});
export default convertHTMLToPDF;
export const closeCachedBrowser = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedBrowser) {
        yield cachedBrowser.close();
        cachedBrowser = undefined;
    }
});
export const hasCachedBrowser = () => {
    return !!cachedBrowser;
};
exitHook(() => __awaiter(void 0, void 0, void 0, function* () {
    debug("Running exit hook.");
    closeCachedBrowser();
}));
