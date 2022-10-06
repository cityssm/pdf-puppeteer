import * as puppeteer from "puppeteer";
export declare const convertHTMLToPDF: (html: string, callback: (pdf: Buffer) => void, pdfOptions: puppeteer.PDFOptions, puppeteerArguments: puppeteer.PuppeteerLaunchOptions, remoteContent?: boolean) => Promise<void>;
export default convertHTMLToPDF;
