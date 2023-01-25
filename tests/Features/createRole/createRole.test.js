const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create role (003)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/roles");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/roles"), 5 * 1000);
  });

  it("Creates a new role", async () => {
    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].click();", idTh);

    await seoHelpers.artificialWait(1000);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const firstRowFistColumn = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    const numberOfElements = parseInt(
      await firstRowFistColumn.getAttribute("innerHTML")
    );

    const roleHead = await driver.wait(
      until.elementLocated(By.className("role-head")),
      5 * 1000
    );

    const openDialogButton = await roleHead.findElement(
      By.className("mat-flat-button")
    );

    const buttonTextComponent = await openDialogButton.findElement(
      By.className("mat-button-wrapper")
    );

    const buttonText = await buttonTextComponent.getAttribute("innerHTML");

    expect(buttonText).toBe(" Add Role ");

    await openDialogButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const createButton = actionsButtons[1];

    const identifierInput = await dialog.findElement(By.name("identifier"));

    const resourceSelect = await dialog.findElement(By.name("resource"));

    await identifierInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await resourceSelect.click();

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await options[1].click();

    const listItems = await dialog.findElements(By.css("mat-list-option"));

    await listItems[0].click();

    let checkedCount = 0;

    for (const item of listItems) {
      const selected = await item.getAttribute("aria-selected");
      if (selected) checkedCount++;
    }

    expect(checkedCount).toBe(listItems.length);

    await createButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const newOneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child")),
      5 * 1000
    );

    const newNumberOfElements = parseInt(
      await newOneXOneInTable.getAttribute("innerHTML")
    );

    const newOneXOneInTableSecondCircumstance = await driver.wait(
      until.elementLocated(By.css("tbody tr:last-child td:first-child"))
    );

    const newNumberOfElementsSecondCircumstance = parseInt(
      await newOneXOneInTableSecondCircumstance.getAttribute("innerHTML")
    );

    expect(
      newNumberOfElements > newNumberOfElementsSecondCircumstance
        ? newNumberOfElements
        : newNumberOfElementsSecondCircumstance
    ).toBeGreaterThan(numberOfElements);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
