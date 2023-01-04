const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create a user (005)", () => {
  let driver;
  const userPassword = "passworD1";

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/users");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/users"), 5 * 1000);
  });

  it("Creates a new user", async () => {
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

    const lastIdValue = parseInt(
      await firstRowFistColumn.getAttribute("innerHTML")
    );
    /* const numberOfElements = await driver.findElements(
      By.xpath("//div/div[2]/div/div/table/tbody/tr")
    ); */

    const clientHead = await driver.wait(
      until.elementLocated(By.className("users-head")),
      5 * 1000
    );

    const openDialogButton = await clientHead.findElement(
      By.className("mat-flat-button")
    );

    const buttonTextComponent = await openDialogButton.findElement(
      By.className("mat-button-wrapper")
    );

    const buttonText = await buttonTextComponent.getAttribute("innerHTML");

    expect(buttonText).toBe(" Add User ");

    await driver.executeScript("arguments[0].click();", openDialogButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const createButton = actionsButtons[1];

    const nameInput = await dialog.findElement(By.name("name"));

    const descriptionInput = await driver.findElement(By.name("description"));

    const usernameInput = await dialog.findElement(By.name("username"));

    const passwordInput = await dialog.findElement(By.name("password"));

    const resourceSelect = await dialog.findElement(By.name("role"));

    await nameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );
    await driver.executeScript("arguments[0].click();", descriptionInput);

    await descriptionInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );
    await descriptionInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await passwordInput.sendKeys(userPassword);

    await usernameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await driver.executeScript("arguments[0].click();", options[0]);

    const addButton = await dialog.findElement(By.css(".select-role button"));

    await driver.executeScript("arguments[0].click();", addButton);

    const rolesList = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesList.length).toBe(1);

    const removeButton = await dialog.findElement(By.css(".roles-list button"));

    await driver.executeScript("arguments[0].click();", removeButton);

    const rolesListPostRemove = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesListPostRemove.length).toBe(0);

    const createButtonDisabledAttribute = await createButton.getAttribute(
      "disabled"
    );

    expect(createButtonDisabledAttribute).toBe("true");

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    expect(secondOptions.length).toBe(options.length);

    await driver.executeScript("arguments[0].click();", secondOptions[0]);

    await driver.executeScript("arguments[0].click();", addButton);

    await driver.executeScript("arguments[0].click();", createButton);

    /* const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true); */

    await seoHelpers.artificialWait();

    const newOneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child")),
      5 * 1000
    );

    const newLastIdValue = parseInt(
      await newOneXOneInTable.getAttribute("innerHTML")
    );

    const newOneXOneInTableSecondCircumstance = await driver.wait(
      until.elementLocated(By.css("tbody tr:last-child td:first-child"))
    );

    const newNumberOfElementsSecondCircumstance = parseInt(
      await newOneXOneInTableSecondCircumstance.getAttribute("innerHTML")
    );

    const possibleElements = [
      newLastIdValue,
      newNumberOfElementsSecondCircumstance,
    ];

    // expect(possibleElements).toContain(lastIdValue + 1);
    expect(newLastIdValue).toBeGreaterThan(lastIdValue);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
