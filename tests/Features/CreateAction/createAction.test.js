const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until } = require("selenium-webdriver");
const createActionHelpers = require("./createActionHelpers");
const ScreenshotHelper = require("../../../src/helpers/ScreenshotHelper.js");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates an action (026)", () => {
  let driver;
  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createConsumerSystem(driver);

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);
  });

  it("Create action, no body and custom auth", async () => {
    const actionName = await createActionHelpers.fillCreateForm(driver);
    await createActionHelpers.verifyIfExistActionByName(driver, actionName);
  });

  it("Create action, with body and custom auth", async () => {
    await driver.navigate().refresh();
    const actionName = await createActionHelpers.fillCreateFormWithBodyAndCustomAuth(driver);
    await createActionHelpers.verifyIfExistActionByName(driver, actionName)
  });

  it('Create action with raw function body', async() => {
    await driver.navigate().refresh();
    const actionName = await createActionHelpers.createActionWithRawFunctionBody(driver);
    await createActionHelpers.verifyIfExistActionByName(driver, actionName)
  });

  afterAll(async () => {
    await driver.quit();
  });
});
