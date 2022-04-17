const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Deletes a contract (031)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
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

    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    await seoHelpers.createEvent(driver);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createConsumerSystem(driver);

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    await seoHelpers.createSimpleAction(driver);

    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);

    await seoHelpers.createContract(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Delete a contract works", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const elementToDelete = await firstRowColumns[0].getAttribute("innerHTML");

    const deleteButton = await firstRowColumns[8].findElement(
      By.css("button:last-child")
    );

    await deleteButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const confirmButton = actionButtons[1];

    await confirmButton.click();

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
