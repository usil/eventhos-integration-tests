const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create resource works (002)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/resource");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/resource"),
      5 * 1000
    );
  });

  it("Cancels the pop-up", async () => {
    const roleHead = await driver.wait(
      until.elementLocated(By.className("role-head")),
      5 * 1000
    );

    const openDialogButton = await roleHead.findElement(
      By.className("mat-flat-button")
    );

    openDialogButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const cancelButton = actionButtons[0];

    cancelButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      5 * 1000
    );

    expect(dialogDetached).toBe(true);
  });

  it("Creates a resource", async () => {
    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    let oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    const numberOfElements = parseInt(
      await oneXOneInTable.getAttribute("innerHTML")
    );

    const roleHead = await driver.wait(
      until.elementLocated(By.className("role-head")),
      5 * 1000
    );

    const openDialogButton = await roleHead.findElement(
      By.className("mat-flat-button")
    );

    const buttonTextComponent = await openDialogButton.findElement(
      By.className("mat-button-wrapper")
    );

    const buttonText = await buttonTextComponent.getAttribute("innerHTML");

    expect(buttonText).toBe(" Add Resource ");

    await openDialogButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const createButton = actionButtons[1];

    console.log(await createButton.getAttribute("innerHTML"));

    const resourceIdentifierInput = await dialog.findElement(
      By.name("resourceIdentifier")
    );

    const applicationSelect = await dialog.findElement(By.name("application"));

    applicationSelect.click();

    const option = await driver.wait(
      until.elementLocated(By.xpath("//mat-option[@tabindex='0']")),
      5 * 1000
    );

    await option.click();

    const buttonState = await createButton.getAttribute("disabled");

    expect(buttonState).toBe("true");

    await resourceIdentifierInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await createButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    const newOneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
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
