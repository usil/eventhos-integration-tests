const seoHelpers = require("../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Generate long live token (011)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );
    await seoHelpers.createClient(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("thead tr th:first-child")),
      5 * 1000
    );
    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Generate long live token", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const generateLongLiveButton = await firstRow[4].findElement(
      By.css("button")
    );

    await generateLongLiveButton.click();

    const postDialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const input = await postDialog.findElement(By.css("input"));

    expect(input).toBeTruthy();

    const closeButton = await postDialog.findElement(
      By.css(".mat-dialog-actions button")
    );

    await closeButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(postDialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const buttonDetached = await driver.wait(
      until.stalenessOf(generateLongLiveButton),
      5 * 1000
    );

    expect(buttonDetached).toBe(true);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let revokeTokenButton;

    for (let index = 0; index < allRows.length; index++) {
      const firstColumn = await allRows[index].findElement(
        By.css("td:first-child")
      );

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        indexOfEditedColumn = index;
        const fifthColumn = (
          await allRows[index].findElements(By.css("td"))
        )[4];
        revokeTokenButton = await fifthColumn.findElement(By.css("button"));
        break;
      }
    }

    const revokeTokenButtonInnerSpan = await revokeTokenButton.findElement(
      By.css(".mat-button-wrapper")
    );

    const revokeTokenButtonText = await revokeTokenButtonInnerSpan.getAttribute(
      "innerHTML"
    );

    expect(revokeTokenButtonText).toBe(" Remove Long Live ");
  });

  it("Revoke long live token", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const revokeLongLiveButton = await firstRow[4].findElement(
      By.css("button")
    );

    await revokeLongLiveButton.click();

    const buttonDetached = await driver.wait(
      until.stalenessOf(revokeLongLiveButton),
      5 * 1000
    );

    expect(buttonDetached).toBe(true);

    await seoHelpers.artificialWait(500);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let generateTokenButton;

    for (let index = 0; index < allRows.length; index++) {
      const firstColumn = await allRows[index].findElement(
        By.css("td:first-child")
      );

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID == parseInt(id)) {
        indexOfEditedColumn = index;
        const fifthColumn = (
          await allRows[index].findElements(By.css("td"))
        )[4];
        generateTokenButton = await fifthColumn.findElement(By.css("button"));
        break;
      }
    }

    const generateTokenButtonInnerSpan = await generateTokenButton.findElement(
      By.css(".mat-button-wrapper")
    );

    const revokeTokenButtonText =
      await generateTokenButtonInnerSpan.getAttribute("innerHTML");

    expect(revokeTokenButtonText).toBe(" Generate Long Live ");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
