const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Update user roles (014)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/roles");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/roles"), 5 * 1000);

    await seoHelpers.creatRole(driver);

    await driver.get(webUrl + "/dashboard/auth/users");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/users"), 5 * 1000);

    await seoHelpers.createUser(driver);

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

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    // await idTh.click();
    await driver.executeScript("arguments[0].click();", idTh);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Update user role works", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const sixthColumnOfFirstRow = firstRow[3];

    const updateRolesButton = await sixthColumnOfFirstRow.findElement(
      By.css("button:last-child")
    );

    await driver.executeScript("arguments[0].click();", updateRolesButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const updateButton = actionsButtons[1];

    const rolesSelect = await dialog.findElement(By.name("role"));

    await driver.executeScript("arguments[0].click();", rolesSelect);

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    const addButton = await dialog.findElement(By.css(".select-role button"));

    await driver.executeScript("arguments[0].click();", options[0]);

    await driver.executeScript("arguments[0].click();", addButton);

    const rolesList = await dialog.findElements(By.css(".roles-list"));

    expect(rolesList.length).toBeGreaterThanOrEqual(2);

    const deleteButton = await rolesList[1].findElement(By.css("button"));

    await driver.executeScript("arguments[0].click();", deleteButton);

    const rolesListSecondPhase = await dialog.findElements(
      By.css(".roles-list")
    );

    expect(rolesList.length).toBeGreaterThan(rolesListSecondPhase.length);

    await driver.executeScript("arguments[0].click();", rolesSelect);

    const optionsSecondPhase = await driver.wait(
      until.elementsLocated(By.css(".mat-option")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].click();", optionsSecondPhase[0]);

    await driver.executeScript("arguments[0].click();", addButton);

    await driver.executeScript("arguments[0].click();", updateButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait(500);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let newUpdateRolesButton;

    for (let index = 0; index < allRows.length; index++) {
      const firstColumn = await allRows[index].findElement(
        By.css("td:first-child")
      );

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        indexOfEditedColumn = index;
        const sixthColumn = (
          await allRows[index].findElements(By.css("td"))
        )[3];
        newUpdateRolesButton = await sixthColumn.findElement(
          By.css("button:last-child")
        );
        break;
      }
    }
    await driver.executeScript("arguments[0].click();", newUpdateRolesButton);

    const updateCheckDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const rolesListUpdateCheck = await updateCheckDialog.findElements(
      By.css(".roles-list")
    );

    expect(rolesListUpdateCheck.length).toBeGreaterThan(
      rolesListSecondPhase.length
    );
  });

  afterAll(async () => {
    await driver.quit();
  });
});
