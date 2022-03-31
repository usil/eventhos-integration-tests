const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("View client secret (010)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );
  });

  it("View client secret", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const secretButton = await firstRow[3].findElement(By.css("button"));

    await secretButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const input = await driver.wait(until.elementLocated(By.css("input")));

    expect(input).toBeTruthy();

    const closeButton = await dialog.findElement(
      By.css(".mat-dialog-actions button")
    );

    await closeButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
