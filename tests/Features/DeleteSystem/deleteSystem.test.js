const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Deletes a system (022)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    await seoHelpers.createClient(driver);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createProducerSystem(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    // await idTh.click();

    await driver.executeScript("arguments[0].click();", idTh);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Delete a system works", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const elementToDelete = await firstRowColumns[0].getAttribute("innerHTML");

    const deleteButton = await firstRowColumns[5].findElement(
      By.css("button:last-child")
    );

    // await deleteButton.click();
    await driver.executeScript("arguments[0].click();", deleteButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const confirmButton = actionButtons[1];

    // await confirmButton.click();

    await driver.executeScript("arguments[0].click();", confirmButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const allFirstColumns = await driver.wait(
      until.elementsLocated(By.css("tbody tr td:first-child"))
    );

    let foundId = 0;

    for (const row of allFirstColumns) {
      const id = parseInt(await row.getAttribute("innerHTML"));
      if (id === elementToDelete) {
        foundId++;
      }
    }

    expect(foundId).toBe(0);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
