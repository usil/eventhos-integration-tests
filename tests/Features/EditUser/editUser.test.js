const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Edit user (013)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/users");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/users"), 5 * 1000);

    await seoHelpers.createUser(driver);

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

  it("Edit user", async () => {
    await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    const secondColumnOfFirstRow = await driver.findElement(
      By.css("tbody tr:first-child .cdk-column-name")
    );

    const originalName = await secondColumnOfFirstRow.getAttribute("innerHTML");

    const newName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    const tableActions = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td:last-child button"))
    );

    await tableActions[0].click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const updateButton = actionButtons[1];

    const nameInput = await dialog.findElement(By.name("name"));

    const nameInputOriginalValue = await nameInput.getAttribute("value");

    expect(nameInputOriginalValue).toBe(originalName);

    await nameInput.clear();

    await nameInput.sendKeys(newName);

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const allRowsSecondColumn = await driver.wait(
      until.elementsLocated(By.css("tbody .cdk-column-name"))
    );

    let newNameFound = false;

    for (const column of allRowsSecondColumn) {
      const nameOfColumn = await column.getAttribute("innerHTML");
      if (nameOfColumn === newName) {
        newNameFound = true;
        break;
      }
    }

    expect(newNameFound).toBe(true);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
