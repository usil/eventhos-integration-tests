const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Creates a producer system (019)", () => {
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
  });

  it("Create a system works", async () => {
    let allOriginalRows = await seoHelpers.getTableRows(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
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

    const typeSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='type']")
    );

    const systemClassSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='systemClass']")
    );

    const descriptionTextInput = await driver.findElement(
      By.xpath("//textarea[@formcontrolname='description']")
    );

    const clientIdSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='clientId']")
    );

    const createButton = await driver.findElement(By.css("form button"));

    const isCreateButtonDisabled =
      (await createButton.getAttribute("disabled")) === "true" ? true : false;

    const identifierDisabled =
      (await createButton.getAttribute("disabled")) === "true" ? true : false;

    expect(isCreateButtonDisabled).toBe(true);

    expect(identifierDisabled).toBe(true);

    const systemName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    await nameInput.sendKeys(systemName);

    await descriptionTextInput.sendKeys(
      rs.generate({
        length: 16,
        charset: "alphabetic",
      })
    );

    await typeSelect.click();

    const typeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await typeOptions[0].click();

    await driver.wait(until.stalenessOf(typeOptions[0]));

    await systemClassSelect.click();

    const classOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await classOptions[0].click();

    await driver.wait(until.stalenessOf(classOptions[0]));

    await clientIdSelect.click();

    const clientIdOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await clientIdOptions[0].click();

    const identifierValue = await identifierInput.getAttribute("value");
    
    //#TODO:is assuming that first type of create system is erp
    expect(identifierValue).toBe(`${systemName.toLowerCase()}_api`);

    await createButton.click();

    if (allOriginalRows.length !== 0) {
      await driver.wait(until.stalenessOf(allOriginalRows[0]));
    }

    const rows = await driver.wait(
      until.elementsLocated(By.css("tbody tr")),
      2 * 1000
    );

    const rowColumns = await rows[0].findElements(By.css("td"));

    const nameColumn = await rowColumns[1];

    const nameOfCreated = await nameColumn.getAttribute("innerHTML");

    expect(nameOfCreated).toBe(systemName);

    const systemClassColumn = await rowColumns[2];

    const systemClassOfCreated = await systemClassColumn.getAttribute(
      "innerHTML"
    );

    expect(systemClassOfCreated).toBe("producer");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
