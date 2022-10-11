import * as puppeteer from "puppeteer";
import exitHook from "exit-hook";
import Debug from "debug";

const debug = Debug("pdf-puppeteer");

/*
 * Puppeteer Options
 */

export const defaultPuppeteerOptions: puppeteer.PuppeteerLaunchOptions = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
};

/*
 * PDF Options
 */

export const defaultPdfOptions: puppeteer.PDFOptions = {};

/*
 * PDF Puppeteer Options
 */

interface PDFPuppeteerOptions {
    /**
     * Whether or not the Puppeteer browser instance should be saved between calls.
     * Default: false
     */
    cacheBrowser?: boolean;

    /**
     * Speed can be increased when set to false.
     * Default: true
     */
    remoteContent?: boolean;

    /**
     * Whether or not the HTML parameter is actually a URL.
     * Default: false
     */
    htmlIsUrl?: boolean;
}

export const defaultPdfPuppeteerOptions: PDFPuppeteerOptions = {
    cacheBrowser: false,
    remoteContent: true,
    htmlIsUrl: false
};

let cachedBrowser: puppeteer.Browser;
let cachedBrowserOptions: string;

export const convertHTMLToPDF = async (
    html: string,
    callback: (pdf: Buffer) => void,
    instancePdfOptions?: puppeteer.PDFOptions,
    instancePuppeteerOptions?: puppeteer.PuppeteerLaunchOptions,
    instancePdfPuppeteerOptions?: PDFPuppeteerOptions
) => {
    if (typeof html !== "string") {
        throw new TypeError(
            "Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers."
        );
    }

    const puppeteerOptions = Object.assign({}, defaultPuppeteerOptions, instancePuppeteerOptions);

    const pdfPuppeteerOptions = Object.assign(
        {},
        defaultPdfPuppeteerOptions,
        instancePdfPuppeteerOptions
    );

    /*
     * Initialize browser
     */

    let browser: puppeteer.Browser;

    if (pdfPuppeteerOptions.cacheBrowser) {
        const currentPuppeteerOptions = JSON.stringify(instancePuppeteerOptions);

        if (
            !cachedBrowserOptions ||
            !cachedBrowser ||
            currentPuppeteerOptions !== cachedBrowserOptions
        ) {
            debug("Initialize new cached browser.");

            if (cachedBrowser) {
                debug("Kill current cached browser.");

                if (cachedBrowser.pages.length === 0) {
                    debug("All pages closed, kill browser.");
                    await cachedBrowser.close();
                    cachedBrowser = undefined;
                }
            }

            cachedBrowser = await puppeteer.launch(puppeteerOptions);
            cachedBrowserOptions = currentPuppeteerOptions;
        }

        browser = cachedBrowser;
    } else {
        browser = await puppeteer.launch(puppeteerOptions);
    }

    /*
     * Initialize page
     */

    const page = await browser.newPage();

    if (pdfPuppeteerOptions.htmlIsUrl) {
        await page.goto(html, {
            waitUntil: "networkidle0"
        });
    } else if (pdfPuppeteerOptions.remoteContent) {
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString("base64")}`, {
            waitUntil: "networkidle0"
        });
    } else {
        await page.setContent(html);
    }

    const pdfOptions = Object.assign({}, defaultPdfOptions, instancePdfOptions);

    await page.pdf(pdfOptions).then(callback, (error) => {
        debug(error);
    });

    await page.close();

    if (!pdfPuppeteerOptions.cacheBrowser || cachedBrowser !== browser) {
        await browser.close();
    }
};

export default convertHTMLToPDF;

export const closeCachedBrowser = async () => {
    if (cachedBrowser) {
        await cachedBrowser.close();
        cachedBrowser = undefined;
    }
};

export const hasCachedBrowser = (): boolean => {
    return !!cachedBrowser;
};

exitHook(async () => {
    debug("Running exit hook.");
    closeCachedBrowser();
});
