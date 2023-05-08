const { expect } = require("chai");
const { By, until } = require("selenium-webdriver");
const getBrowserDriver = require("../src/browsers/browserDriver");
const seoHelpers = require("../src/helpers/seo.helpers");
const rs = require("randomstring");
const { default: axios } = require("axios");

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

    const lastIdValue = parseInt(
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

    const identifierInput = await driver.findElement(By.name("identifier"));

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
    // expect(possibleElements).to.contain(lastIdValue + 1);

    expect(newLastIdValue).to.be.greaterThan(lastIdValue);
  },
  async testStopContractExecution(driver, webUrl, mockServerUrl, apiUrl) {
    let actionId = "";
    let clientCredentials;
    let eventIdentifier = "";

    clientCredentials = await seoHelpers.createClient(driver);

    expect(clientCredentials.clientId).to.be.ok;
    expect(clientCredentials.clientSecret).to.be.ok;
    expect(clientCredentials.accessToken).to.be.ok;

    // CREATE SYSTEM
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createProducerSystem(driver);

    expect(created).to.be.ok;

    // CREATE EVENT

    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    eventIdentifier = await seoHelpers.createEvent(driver);

    expect(eventIdentifier).to.be.ok;

    // CREATE A CONSUMER SYSTEM

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const createdConsumerSystem = await seoHelpers.createConsumerSystem(driver);

    expect(createdConsumerSystem).to.equal(true);

    // CREATE AN ACTION

    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    actionId = await seoHelpers.createAction(
      driver,
      `${mockServerUrl}/integration`,
      1
    );

    expect(actionId).to.be.ok;

    // CREATE A CONTRACT

    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);

    const createdContract = await seoHelpers.createContract(driver);

    expect(createdContract).to.be.true;

    //SEND AN EVENT

    const result = await axios.post(
      `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).deep.equal({ code: 20000, message: "success" });

    await seoHelpers.artificialWait();

    const memoryOfIntegrationServer = await axios.get(
      `${mockServerUrl}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).deep.equal({});

    //SEND CONTRACT INNACTIVE

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);

    await driver.executeScript("arguments[0].click();", idTh);

    await seoHelpers.artificialWait();

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const editButton = await firstRowColumns[8].findElement(
      By.css("button:first-child")
    );

    await driver.executeScript("arguments[0].scrollIntoView()", editButton);

    await driver.executeScript("arguments[0].click();", editButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const activeSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='active']")
    );

    await driver.executeScript("arguments[0].click();", activeSelect);

    const activeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await driver.executeScript("arguments[0].click();", activeOptions[1]);

    await driver.wait(until.stalenessOf(activeOptions[1]));

    const updateButton = await dialog.findElement(
      By.css("div[align='end'] button:last-child")
    );

    await driver.executeScript("arguments[0].click();", updateButton);

    await driver.wait(until.stalenessOf(dialog), 6 * 1000);

    await driver.wait(until.stalenessOf(firstRow));

    const resultInnactive = await axios.post(
      `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    await seoHelpers.artificialWait();
    expect(resultInnactive.data).deep.equal({
      code: 200310,
      message: "Success, but no contracts exists for this event",
    });

    const memoryOfIntegrationServerInnactive = await axios.get(
      `${mockServerUrl}/integration`
    );

    /* expect(
      memoryOfIntegrationServerInnactive.data.content.timesCalled
    ).to.equal(1); */
  },
  async testAuditReceivedEvents(driver, webUrl) {
    await driver.get(webUrl + "/dashboard/events-logs/logs-list");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/events-logs/logs-list"),
      5 * 1000
    );

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child")),
      5 * 1000
    );

    const lastButton = await firstRow.findElement(
      By.css("td:last-child button")
    );

    const idColumn = await firstRow.findElement(By.css("td:first-child"));

    const idText = await idColumn.getAttribute("innerHTML");

    const lastButtonSpan = await lastButton.findElement(By.css("span"));

    const lastButtonSpanText = await lastButtonSpan.getAttribute("innerHTML");

    expect(lastButtonSpanText).to.equal(" 1 processed ");

    await driver.executeScript("arguments[0].click();", lastButton);

    await driver.wait(
      until.urlIs(
        webUrl +
          `/dashboard/events-logs/logs-list/event-contracts?receivedEventId=${idText}`
      ),
      5 * 1000
    );

    const matCard = await driver.wait(until.elementLocated(By.css("mat-card")));

    expect(matCard).to.be.ok;

    const firstRowContractsTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child")),
      5 * 1000
    );

    const lastButtonRowContractsTable =
      await firstRowContractsTable.findElement(
        By.xpath(
          "//app-events-log/app-event-contracts/table/tbody/tr/td[4]/button"
        )
      );

    await driver.executeScript(
      "arguments[0].scrollIntoView()",
      lastButtonRowContractsTable
    );
    await driver.executeScript(
      "arguments[0].click();",
      lastButtonRowContractsTable
    );

    await driver.wait(until.stalenessOf(matCard));

    const matCardFinal = await driver.wait(
      until.elementLocated(By.css("mat-card"))
    );

    const matCardTitle = await matCardFinal.findElement(
      By.css("mat-card-title")
    );

    const titleText = await matCardTitle.getAttribute("innerHTML");

    expect(titleText).to.equal("200");
  },
  async testCreateUser(driver, userPassword) {
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

    const numberOfElements = parseInt(
      await firstRowFistColumn.getAttribute("innerHTML")
    );

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

    expect(buttonText).to.equal(" Add User ");

    // await openDialogButton.click();

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

    const descriptionInput = await dialog.findElement(By.name("description"));

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
        length: 16,
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

    // await resourceSelect.click();

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    // await options[0].click();

    await driver.executeScript("arguments[0].click();", options[0]);

    const addButton = await dialog.findElement(By.css(".select-role button"));

    // await addButton.click();
    await driver.executeScript("arguments[0].click();", addButton);

    const rolesList = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesList.length).to.equal(1);

    const removeButton = await dialog.findElement(By.css(".roles-list button"));

    // await removeButton.click();

    await driver.executeScript("arguments[0].click();", removeButton);

    const rolesListPostRemove = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesListPostRemove.length).to.equal(0);

    const createButtonDisabledAttribute = await createButton.getAttribute(
      "disabled"
    );

    expect(createButtonDisabledAttribute).to.equal("true");

    // await resourceSelect.click();

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    expect(secondOptions.length).to.equal(options.length);

    // await secondOptions[0].click();

    await driver.executeScript("arguments[0].click();", secondOptions[0]);

    // await addButton.click();
    await driver.executeScript("arguments[0].click();", addButton);

    // await createButton.click();
    await driver.executeScript("arguments[0].click();", createButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).to.equal(true);

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
  async testDeleteClient(driver) {
    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    const numberOfElements = parseInt(
      await oneXOneInTable.getAttribute("innerHTML")
    );
    const oneXFourTableDeleteButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:last-child")
      )
    );

    await driver.executeScript(
      "arguments[0].click();",
      oneXFourTableDeleteButton
    );

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const deleteButton = actionButtons[1];

    await driver.executeScript("arguments[0].click();", deleteButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).to.equal(true);

    await seoHelpers.artificialWait();

    const allFirstColumns = await driver.wait(
      until.elementsLocated(By.css("tbody tr td:first-child"))
    );

    let foundId = 0;

    for (const row of allFirstColumns) {
      const id = parseInt(await row.getAttribute("innerHTML"));
      if (id === numberOfElements) {
        foundId++;
      }
    }

    expect(foundId).to.equal(0);
  },
  async testCancelDelete(driver) {
    const oneXFourTableDeleteButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:last-child")
      )
    );

    await driver.executeScript(
      "arguments[0].click();",
      oneXFourTableDeleteButton
    );

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );
    const actionButtons = await dialog.findElements(By.css("button"));
    const cancelButton = actionButtons[0];
    const cancelButtonText = await cancelButton.getAttribute("innerHTML");
    expect(cancelButtonText).to.deep.equal(
      '<span class="mat-button-wrapper"> Cancel</span><span matripple="" class="mat-ripple mat-button-ripple"></span><span class="mat-button-focus-overlay"></span>'
    );
    expect(cancelButton).to.be.ok;
    await driver.executeScript("arguments[0].click();", cancelButton);

    /* const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    ); */
  },
};


module.exports = testOfTEst;
