const { config } = require('./wdio.shared.conf');

const BUILD_ID = Math.ceil(Date.now() / 1000);

const { env: { SAUCE_USERNAME, SAUCE_ACCESS_KEY }, argv } = process;

exports.config = {
  /**
   * base config
   */
  ...config,
  /**
   * config for testing on Sauce Labs
   */
  user: SAUCE_USERNAME,
  key: SAUCE_ACCESS_KEY,
  region: 'us',
  headless: argv.includes('--headless'),

  services: [
    ['sauce', {
      sauceConnect: true,
      tunnelIdentifier: 'Vue.js Integration tests'
    }]
  ],

  maxInstances: 10,
  capabilities: [{
    browserName: 'firefox',
    browserVersion: 'latest',
    platformName: 'Windows 10',
    'sauce:options': {
      build: `Build ${BUILD_ID}`
    }
  }, {
    browserName: 'chrome',
    browserVersion: 'latest',
    platformName: 'Windows 10',
    'sauce:options': {
      build: `Build ${BUILD_ID}`
    }
  }]
}
