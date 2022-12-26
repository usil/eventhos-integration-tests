const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates an action (027)", () => {
  let actionToEditId = "";
  let driver;

  let newActionName = rs.generate({
    length: 8,
    charset: "alphabetic",
  });

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createConsumerSystem(driver);

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    await seoHelpers.createSimpleAction(driver);

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

  it("Goes to edit page", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    actionToEditId = await firstRowColumns[0].getAttribute("innerHTML");

    const editButton = await firstRowColumns[5].findElement(
      By.css("button:first-child")
    );

    await editButton.click();

    await driver.wait(until.stalenessOf(editButton));

    const inSecondPage = await driver.wait(
      until.elementLocated(By.xpath("//input[@formcontrolname='name']"))
    );

    expect(inSecondPage).toBeTruthy();
  });

  it("It edits the action and returns", async () => {
    const updateButton = await driver.findElement(By.css("button:last-child"));

    const nameInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='name']")
    );

    const operationSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='operation']")
    );

    const descriptionTextInput = await driver.findElement(
      By.xpath("//textarea[@formcontrolname='description']")
    );

    const urlInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='url']")
    );

    const methodSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='method']")
    );

    const securityTypeSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='securityType']")
    );

    expect(securityTypeSelect).toBeTruthy();
    expect(methodSelect).toBeTruthy();
    expect(urlInput).toBeTruthy();
    expect(descriptionTextInput).toBeTruthy();

    await operationSelect.click();

    const operationOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await operationOptions[1].click();

    await driver.wait(until.stalenessOf(operationOptions[1]));

    await nameInput.clear();

    await nameInput.sendKeys(newActionName);

    await updateButton.click();

    await driver.wait(until.stalenessOf(updateButton), 5 * 1000);

    const gotToTheMainPage = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    expect(gotToTheMainPage).toBeTruthy();
  });

  it("Action was edited correctly", async () => {
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const allRowsPostUpdate = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let updatedRowColumns;

    for (const row of allRowsPostUpdate) {
      const rowColumns = await row.findElements(By.css("td"));
      const idOfColumn = await rowColumns[0].getAttribute("innerHTML");
      console.log(actionToEditId);
      if (idOfColumn == actionToEditId) {
        updatedRowColumns = rowColumns;
        break;
      }
    }

    const updatedName = await updatedRowColumns[1].getAttribute("innerHTML");

    const updatedOperation = await updatedRowColumns[2].getAttribute(
      "innerHTML"
    );

    expect(updatedName).toBe(newActionName);
    expect(updatedOperation).toBe("new");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
