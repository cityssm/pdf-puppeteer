// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import { installChromeBrowser, installFirefoxBrowser } from '@cityssm/puppeteer-launch'

try {
  await installChromeBrowser()
  console.log('✔️  Chrome browser installed successfully')
} catch (error) {
  console.error('❌  Error installing Chrome browser:', error)

  try {
    await installFirefoxBrowser()
    console.log('✔️  Firefox browser installed successfully')
  } catch (error) {
    console.error('❌  Error installing Firefox browser:', error)
  }
}