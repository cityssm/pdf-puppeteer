import * as puppeteer from 'puppeteer';
export declare function launchBrowserWithFallback(puppeteerOptions: puppeteer.PuppeteerLaunchOptions, switchBrowserIfFail?: boolean): Promise<puppeteer.Browser>;
