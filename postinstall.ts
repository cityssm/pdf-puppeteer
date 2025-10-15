// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import {
  testInstalledChromeBrowser,
  testInstalledFirefoxBrowser
} from '@cityssm/puppeteer-launch'

try {
  await testInstalledChromeBrowser(true)
  console.log('✔️  Chrome browser installed successfully')
} catch (error) {
  console.error('❌  Error installing Chrome browser:', error)

  try {
    await testInstalledFirefoxBrowser(true)
    console.log('✔️  Firefox browser installed successfully')
  } catch (error) {
    console.error('❌  Error installing Firefox browser:', error)
  }
}
