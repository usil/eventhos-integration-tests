const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates a new event (023)", () => {
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
  });

  it("Create an event works", async () => {
    let allOriginalRows = await seoHelpers.getTableRows(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await idTh.click();

    if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));

      allOriginalRows = await driver.wait(
        until.elementsLocated(By.css("tbody tr")),
        2 * 1000
      );
    }

    const identifierInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='identifier']")
    );

    const nameInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='name']")
    );

    const systemSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='system_id']")
    );

    const operationSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='operation']")
    );

    const descriptionTextInput = await driver.findElement(
      By.xpath("//textarea[@formcontrolname='description']")
    );

    const createButton = await driver.findElement(By.css("form button"));

    const identifierDisabled =
      (await createButton.getAttribute("disabled")) === "true" ? true : false;

    const isCreateButtonDisabled =
      (await createButton.getAttribute("disabled")) === "true" ? true : false;

    expect(identifierDisabled).toBe(true);

    expect(isCreateButtonDisabled).toBe(true);

    const eventName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    await nameInput.sendKeys(eventName);

    await descriptionTextInput.sendKeys(
      rs.generate({
        length: 16,
        charset: "alphabetic",
      })
    );

    await systemSelect.click();

    const systemOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await systemOptions[0].click();

    await driver.wait(until.stalenessOf(systemOptions[0]));

    await operationSelect.click();

    const operationOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await operationOptions[0].click();

    await driver.wait(until.stalenessOf(operationOptions[0]));

    const identifierValue = await identifierInput.getAttribute("value");

    expect(identifierValue).toBe(`${eventName.toLowerCase()}_select`);

    await createButton.click();

    if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));
    }

    const rows = await driver.wait(
      until.elementsLocated(By.css("tbody tr")),
      2 * 1000
    );

    const rowColumns = await rows[0].findElements(By.css("td"));

    const nameColumn = await rowColumns[2];

    const nameOfCreated = await nameColumn.getAttribute("innerHTML");

    expect(nameOfCreated).toBe(eventName);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
