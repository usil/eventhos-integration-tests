const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Delete client (016)", () => {
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

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    // await idTh.click();

    await driver.executeScript("arguments[0].click();", idTh);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Cancel delete", async () => {
    const oneXFourTableDeleteButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:last-child")
      )
    );

    // await oneXFourTableDeleteButton.click();

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
    expect(cancelButtonText).toEqual(
      '<span class="mat-button-wrapper"> Cancel</span><span matripple="" class="mat-ripple mat-button-ripple"></span><span class="mat-button-focus-overlay"></span>'
    );
    expect(cancelButton).toBeTruthy();
    await driver.executeScript("arguments[0].click();", cancelButton);

    /* const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    ); */
  });

  it("Delete client", async () => {
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

    // await oneXFourTableDeleteButton.click();

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

    // await deleteButton.click();

    await driver.executeScript("arguments[0].click();", deleteButton);

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

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

    expect(foundId).toBe(0);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
