const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create a client (004)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );
  });

  it("Creates a new client", async () => {
    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    let oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child")),
      5 * 1000
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child")),
      5 * 1000
    );

    const numberOfElements = parseInt(
      await oneXOneInTable.getAttribute("innerHTML")
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

    await openDialogButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionsButtons = await dialog.findElements(
      By.css(".mat-dialog-actions button")
    );

    const createButton = actionsButtons[1];

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

    await resourceSelect.click();

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await options[0].click();

    const addButton = await dialog.findElement(By.css(".select-role button"));

    await addButton.click();

    const rolesList = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesList.length).toBe(1);

    const removeButton = await dialog.findElement(By.css(".roles-list button"));

    await removeButton.click();

    const rolesListPostRemove = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesListPostRemove.length).toBe(0);

    const createButtonDisabledAttribute = await createButton.getAttribute(
      "disabled"
    );

    expect(createButtonDisabledAttribute).toBe("true");

    await resourceSelect.click();

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    expect(secondOptions.length).toBe(options.length);

    await secondOptions[0].click();

    await addButton.click();

    const checkbox = await dialog.findElement(By.css("mat-checkbox"));

    await checkbox.click();

    await createButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);

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
      5 * 1000
    );

    expect(postCreateDialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const newOneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child")),
      5 * 1000
    );

    const newNumberOfElements = parseInt(
      await newOneXOneInTable.getAttribute("innerHTML")
    );

    expect(newNumberOfElements).toBeGreaterThan(numberOfElements);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
