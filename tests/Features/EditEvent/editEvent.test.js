const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Edits an event (024)", () => {
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

  it("Edit an event works", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const elementToEditId = await firstRowColumns[0].getAttribute("innerHTML");

    const newName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    const editButton = await firstRowColumns[6].findElement(
      By.css("button:first-child")
    );

    await editButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const nameInput = await dialog.findElement(
      By.css("input[formcontrolname='name']")
    );

    const operationSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='operation']")
    );

    const descriptionTextInput = await dialog.findElement(
      By.css("textarea[formcontrolname='description']")
    );

    expect(descriptionTextInput).toBeTruthy();

    await nameInput.clear();

    await nameInput.sendKeys(newName);

    await operationSelect.click();

    const operationOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await operationOptions[2].click();

    await driver.wait(until.stalenessOf(operationOptions[2]));

    const updateButton = await dialog.findElement(
      By.css("div[align='end'] button:last-child")
    );

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await driver.wait(until.stalenessOf(firstRow));

    const allRowsPostUpdate = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let updatedRowColumns;

    for (const row of allRowsPostUpdate) {
      const rowColumns = await row.findElements(By.css("td"));
      const idOfColumn = await rowColumns[0].getAttribute("innerHTML");
      if (idOfColumn == elementToEditId) {
        updatedRowColumns = rowColumns;
        break;
      }
    }

    const updatedName = await updatedRowColumns[2].getAttribute("innerHTML");

    const updatedOperation = await updatedRowColumns[3].getAttribute(
      "innerHTML"
    );

    expect(updatedName).toBe(newName);
    expect(updatedOperation).toBe("update");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
