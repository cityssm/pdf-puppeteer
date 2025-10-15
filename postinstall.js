// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import { testInstalledChromeBrowser, testInstalledFirefoxBrowser } from '@cityssm/puppeteer-launch';
try {
    const result = await testInstalledChromeBrowser(true);
    console.log(result.ranInstaller
        ? '✔️  Chrome browser installed successfully.'
        : '✔️  Chrome browser already installed.');
}
catch (error) {
    console.error('❌  Error installing Chrome browser:', error);
    try {
        const result = await testInstalledFirefoxBrowser(true);
        console.log(result.ranInstaller
            ? '✔️  Firefox browser installed successfully.'
            : '✔️  Firefox browser already installed.');
    }
    catch (error) {
        console.error('❌  Error installing Firefox browser:', error);
    }
}
