const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");
const testOfTEst = require("../../../testOfTest/testOfTest");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create a client (004)", () => {
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
  });

  it("Creates a new client", async () => {
    /* const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].click();", idTh);

    await seoHelpers.artificialWait(2000);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const firstRowFistColumn = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    const numberOfElements = parseInt(
      await firstRowFistColumn.getAttribute("innerHTML")
    );

    const clientHead = await driver.wait(
      until.elementLocated(By.className("client-head")),
      5 * 1000
    );

    const openDialogButton = await clientHead.findElement(
      By.className("mat-flat-button")
    );

    const buttonTextComponent = await openDialogButton.findElement(
      By.className("mat-button-wrapper")
    );

    const buttonText = await buttonTextComponent.getAttribute("innerHTML");

    expect(buttonText).toBe(" Add Client ");

    await driver.executeScript("arguments[0].click();", openDialogButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const createButton = await actionsButtons[1];

    const nameInput = await dialog.findElement(By.name("name"));

    const descriptionInput = await dialog.findElement(By.name("description"));

    const identifierInput = await dialog.findElement(By.name("identifier"));

    const resourceSelect = await dialog.findElement(By.name("role"));

    await nameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await descriptionInput.sendKeys(
      rs.generate({
        length: 16,
        charset: "alphabetic",
      })
    );

    await identifierInput.sendKeys(
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

    // const checkbox = await dialog.findElement(By.css("mat-checkbox"));
    const checkbox = await driver.findElement(
      By.xpath("//mat-checkbox/label/span[1]/input")
    );

    await driver.executeScript("arguments[0].click();", checkbox);
    await driver.executeScript("arguments[0].click();", createButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      9 * 1000
    );

    expect(dialogDetached).toBe(true);

    // await driver.sleep(5000);

    const postCreateDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const postCreateInputs = await postCreateDialog.findElements(
      By.css("input")
    );

    expect(postCreateInputs.length).toBe(3);

    let disabledCount = 0;

    for (const input of postCreateInputs) {
      const disabled = await input.getAttribute("disabled");

      if (disabled) {
        disabledCount++;
      }
    }

    expect(disabledCount).toBe(3);

    const okButton = await postCreateDialog.findElement(
      By.css(".mat-dialog-actions button")
    );

    await okButton.click();

    const postCreateDialogDetached = await driver.wait(
      until.stalenessOf(postCreateDialog),
      9 * 1000
    );

    expect(postCreateDialogDetached).toBe(true);
    // await driver.sleep(5000);

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

    const possibleElements = [
      newNumberOfElements,
      newNumberOfElementsSecondCircumstance,
    ];
    expect(possibleElements).toContain(numberOfElements + 1); */
    await testOfTEst.testCreateClient(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
