const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Change resource options works (006)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/resource");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/resource"),
      5 * 1000
    );
    await seoHelpers.createResource(driver);
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

  it("Options get updated", async () => {
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

    const plusButton = await dialog.findElement(By.css(".select-role button"));

    const nameInput = await dialog.findElement(By.name("name"));

    const originalList = await dialog.findElements(
      By.css(".options-list-container > div")
    );

    await nameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await plusButton.click();

    const afterClickInput = await nameInput.getAttribute("innerHTML");

    expect(afterClickInput).toBe("");

    await nameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await plusButton.click();

    const newListSize = await dialog.findElements(
      By.css(".options-list-container > div")
    );

    expect(newListSize.length).toBe(originalList.length + 2);

    const lastListItem = newListSize[newListSize.length - 1];

    const reduceButton = await lastListItem.findElement(By.css("button"));

    await reduceButton.click();

    const finalList = await dialog.findElements(
      By.css(".options-list-container > div")
    );

    expect(finalList.length).toBe(originalList.length + 1);

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const updateButton = actionsButtons[1];

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let newOptionsButton;

    for (let index = 0; index < allRows.length; index++) {
      const firstColumn = await allRows[index].findElement(
        By.css("td:first-child")
      );

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        indexOfEditedColumn = index;
        const thirdColumn = (
          await allRows[index].findElements(By.css("td"))
        )[2];
        newOptionsButton = await thirdColumn.findElement(By.css("button"));
        break;
      }
    }

    await newOptionsButton.click();

    const secondDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const corroborationList = await secondDialog.findElements(
      By.css(".options-list-container > div")
    );

    expect(corroborationList.length).toBeGreaterThanOrEqual(
      originalList.length + 1
    );
  });

  it("Cancel button works", async () => {
    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const cancelButton = actionsButtons[0];

    await cancelButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
