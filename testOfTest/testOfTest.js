const { expect } = require("chai");
const { By, until } = require("selenium-webdriver");
const getBrowserDriver = require("../src/browsers/browserDriver");
const seoHelpers = require("../src/helpers/seo.helpers");
const rs = require("randomstring");

const testOfTEst = {
  async testCreateClient(driver) {
    const idTh = await driver.wait(
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
    console.log(numberOfElements);

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

    expect(buttonText).to.equal(" Add Client ");

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

    const descriptionInput = await driver.wait(
      until.elementLocated(
        By.name("description"),
        "There isn't desccription input when creates client",
        8 * 1000
      )
    );

    const identifierInput = await dialog.findElement(By.name("identifier"));

    const resourceSelect = await dialog.findElement(By.name("role"));

    await nameInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await driver.executeScript("arguments[0].click();", descriptionInput);
    await descriptionInput.sendKeys("Custom description");
    await descriptionInput.sendKeys("Custom description2");

    /* await driver.executeScript(
      "arguments[0].value='Custom description';",
      descriptionInput
    ); */

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

    expect(rolesList.length).to.equal(1);

    const removeButton = await dialog.findElement(By.css(".roles-list button"));

    await driver.executeScript("arguments[0].click();", removeButton);

    const rolesListPostRemove = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesListPostRemove.length).to.equal(0);

    const createButtonDisabledAttribute = await createButton.getAttribute(
      "disabled"
    );

    expect(createButtonDisabledAttribute).to.equal("true");

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    expect(secondOptions.length).to.equal(options.length);

    await driver.executeScript("arguments[0].click();", secondOptions[0]);

    await driver.executeScript("arguments[0].click();", addButton);

    const checkbox = await driver.findElement(
      By.xpath("//mat-checkbox/label/span[1]/input")
    );

    await driver.executeScript("arguments[0].click();", checkbox);
    await driver.executeScript("arguments[0].click();", createButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      9 * 1000
    );

    expect(dialogDetached).to.equal(true);

    const postCreateDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const postCreateInputs = await postCreateDialog.findElements(
      By.css("input")
    );

    expect(postCreateInputs.length).to.equal(3);

    let disabledCount = 0;

    for (const input of postCreateInputs) {
      const disabled = await input.getAttribute("disabled");

      if (disabled) {
        disabledCount++;
      }
    }

    expect(disabledCount).to.equal(3);

    const okButton = await postCreateDialog.findElement(
      By.css(".mat-dialog-actions button")
    );

    await driver.executeScript("arguments[0].click();", okButton);

    const postCreateDialogDetached = await driver.wait(
      until.stalenessOf(postCreateDialog),
      9 * 1000
    );

    expect(postCreateDialogDetached).to.equal(true);

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
    expect(possibleElements).to.contain(numberOfElements + 1);
  },
};

const main = async () => {
  const webUrl = "http://192.168.100.17:2110";
  const password = "czm09ZxKPEFhVq73L3UM6Vx6SA8mEq1y";
  let driver = await getBrowserDriver();
  await seoHelpers.enterIntoEventhos(driver, webUrl, password);

  await driver.get(webUrl + "/dashboard/auth/clients");
  await driver.wait(until.urlIs(webUrl + "/dashboard/auth/clients"), 9 * 1000);

  await testOfTEst.testCreateClient(driver);
};
module.exports = testOfTEst;
