const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Login form  works (001)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await driver.get(webUrl);
    await driver.wait(until.urlIs(webUrl + "/login"), 5 * 1000);
  });

  it("Was redirected to /login", async () => {
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(webUrl + "/login");
  });

  it("Prints incorrect password and disabled button", async () => {
    const usernameInput = await driver.findElement(By.name("username"));
    await usernameInput.sendKeys("admin");
    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.sendKeys("admin");

    const submitButton = await driver.findElement(By.className("login-btn"));

    const buttonStateFirst = await submitButton.getAttribute("disabled");

    expect(buttonStateFirst).toBe("true");

    await passwordInput.sendKeys("Admin2");

    const buttonStateSecond = await submitButton.getAttribute("disabled");

    expect(buttonStateSecond).toBe(null);

    submitButton.click();

    const errorDisplay = await driver.wait(
      until.elementLocated(By.className("error-display")),
      5 * 1000
    );

    const h5ErrorDisplay = await errorDisplay.findElement(By.tagName("h5"));

    const h5Value = await h5ErrorDisplay.getAttribute("innerHTML");

    expect(h5Value).toBe("Incorrect password");
  });

  it("Logs in correctly", async () => {
    const usernameInput = await driver.findElement(By.name("username"));
    await usernameInput.clear();
    await usernameInput.sendKeys("admin");
    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    const submitButton = await driver.findElement(By.className("login-btn"));
    submitButton.click();

    const result = await driver.wait(
      until.urlIs(webUrl + "/dashboard/profile"),
      5 * 1000
    );

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
