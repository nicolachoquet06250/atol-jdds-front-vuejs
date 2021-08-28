const App = require('../pageobjects/app.page');

/**
 * @param {Element} expectedValue
 * @param {String} requiredValue
 */
const expectToHaveText = (expectedValue, requiredValue) => {
  expect(expectedValue).not.toBe(null);

  expect(expectedValue.getText()).toEqual(requiredValue);
};

describe('Vue.js app', () => {
  it('should open and render', () => {
    App.open();

    expectToHaveText(App.heading, 'Welcome to Your Vue.js App');
  })
})
