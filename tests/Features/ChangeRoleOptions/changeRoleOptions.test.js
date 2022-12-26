const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create role options works (007)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/roles");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/roles"), 5 * 1000);
    await seoHelpers.creatRole(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:first-child"),
        5 * 1000
      )
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Update options", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const thirdColumnOfFirstRow = firstRow[2];

    const optionsButton = await thirdColumnOfFirstRow.findElement(
      By.css("button")
    );

    await optionsButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const updateButton = actionsButtons[1];

    const resourceSelect = await dialog.findElement(By.name("resource"));

    await resourceSelect.click();

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await options[2].click();

    const listItems = await dialog.findElements(By.css("mat-list-option"));

    await listItems[0].click();

    let checkedCount = 0;

    for (const item of listItems) {
      const selected = await item.getAttribute("aria-selected");
      if (selected) checkedCount++;
    }

    expect(checkedCount).toBe(listItems.length);

    await resourceSelect.click();

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await secondOptions[1].click();

    const secondListOfItems = await dialog.findElements(
      By.css("mat-list-option")
    );

    for (const item of secondListOfItems) {
      await item.click();
    }

    let nonCheckedCount = 0;

    for (const item of secondListOfItems) {
      const selected = await item.getAttribute("aria-selected");
      if (selected === "true") nonCheckedCount++;
    }

    expect(nonCheckedCount).toBe(0);

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait(1000);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let newOptionsButton;

    for (const element of allRows) {
      const firstColumn = await element.findElement(By.css("td:first-child"));

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        const thirdColumn = (await element.findElements(By.css("td")))[2];
        newOptionsButton = await thirdColumn.findElement(By.css("button"));
        break;
      }
    }

    await newOptionsButton.click();

    const secondDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const secondResourceSelect = await secondDialog.findElement(
      By.name("resource")
    );

    await secondResourceSelect.click();

    const thirdOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await thirdOptions[2].click();

    const thirdListOfItems = await secondDialog.findElements(
      By.css("mat-list-option")
    );

    let secondNonCheckedCount = 0;

    for (const item of thirdListOfItems) {
      const selected = await item.getAttribute("aria-selected");
      if (selected !== "true") secondNonCheckedCount++;
    }

    expect(secondNonCheckedCount).toBe(0);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
