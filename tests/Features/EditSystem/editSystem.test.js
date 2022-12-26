const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Edits a system (021)", () => {
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
    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Edit a system works", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const elementToEditId = await firstRowColumns[0].getAttribute("innerHTML");

    const newName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    const editButton = await firstRowColumns[5].findElement(
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

    const typeSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='type']")
    );

    const systemClassSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='systemClass']")
    );

    const descriptionTextInput = await dialog.findElement(
      By.css("textarea[formcontrolname='description']")
    );

    expect(descriptionTextInput).toBeTruthy();

    const clientIdSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='clientId']")
    );

    await nameInput.clear();

    await nameInput.sendKeys(newName);

    await typeSelect.click();

    const typeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await typeOptions[1].click();

    await driver.wait(until.stalenessOf(typeOptions[1]));

    await systemClassSelect.click();

    const classOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await classOptions[1].click();

    await driver.wait(until.stalenessOf(classOptions[1]));

    const selectIdDisabled =
      (await clientIdSelect.getAttribute("aria-disabled")) === "true"
        ? true
        : false;

    expect(selectIdDisabled).toBe(true);

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

    const updatedName = await updatedRowColumns[1].getAttribute("innerHTML");

    const updatedSystemClass = await updatedRowColumns[2].getAttribute(
      "innerHTML"
    );

    const updatedSystemType = await updatedRowColumns[3].getAttribute(
      "innerHTML"
    );

    expect(updatedName).toBe(newName);
    expect(updatedSystemClass).toBe("consumer");
    expect(updatedSystemType).toBe("CRM");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
