import * as puppeteer from "puppeteer";

export const convertHTMLToPDF = async (
    html: string,
    callback: (pdf: Buffer) => void,
    pdfOptions: puppeteer.PDFOptions,
    puppeteerArguments: puppeteer.PuppeteerLaunchOptions,
    remoteContent = true
) => {
    if (typeof html !== "string") {
        throw new TypeError(
            "Invalid Argument: HTML expected as type of string and received a value of a different type. Check your request body and request headers."
        );
    }
    const browser = await (puppeteerArguments ? puppeteer.launch(puppeteerArguments) : puppeteer.launch());

    const page = await browser.newPage();
    if (!pdfOptions) {
        pdfOptions = { format: "Letter" };
    }

    // eslint-disable-next-line unicorn/prefer-ternary
    if (remoteContent) {
        await page.goto(`data:text/html;base64,${Buffer.from(html).toString("base64")}`, {
            waitUntil: "networkidle0"
        });
    } else {
        //page.setContent will be faster than page.goto if html is a static
        await page.setContent(html);
    }

    await page.pdf(pdfOptions).then(callback, (error) => {
        console.log(error);
    });

    await browser.close();
};

export default convertHTMLToPDF;
