const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");
const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Change a system class", () => {
  let driver;
  let producerSystemName = "";

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
  });

  it("Creates a client", async () => {
    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    const clientCredentials = await seoHelpers.createClient(driver);

    expect(clientCredentials.clientId).toBeTruthy();
    expect(clientCredentials.clientSecret).toBeTruthy();
    expect(clientCredentials.accessToken).toBeTruthy();
  });

  it("Creates a producer system", async () => {
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    producerSystemName = await seoHelpers.createProducerSystem(driver);

    expect(producerSystemName).toBeTruthy();
  });

  it("View system in the events", async () => {
    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    const systemSelect = await driver.wait(
      until.elementLocated(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      )
    );

    await systemSelect.click();

    const systemOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    let systemFound = false;

    for (const system of systemOptions) {
      const textSpan = await system.findElement(By.css(".mat-option-text"));
      const name = await textSpan.getAttribute("innerHTML");

      if (name === producerSystemName) {
        systemFound = true;
        break;
      }
    }

    expect(systemFound).toBe(true);
  });

  it("Change system class", async () => {
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const editButton = await firstRowColumns[5].findElement(
      By.css("button:first-child")
    );

    await editButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const updateButton = await dialog.findElement(
      By.css("div[align='end'] button:last-child")
    );

    const systemClassSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='systemClass']")
    );

    await systemClassSelect.click();

    const classOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await classOptions[1].click();

    await driver.wait(until.stalenessOf(classOptions[1]));

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    const firstRowUpdated = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowUpdatedColumns = await firstRowUpdated.findElements(
      By.css("td")
    );

    const updatedSystemClass = await firstRowUpdatedColumns[2].getAttribute(
      "innerHTML"
    );

    expect(updatedSystemClass).toBe("consumer");
  });

  it("Do not view system in the events", async () => {
    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    const systemSelect = await driver.wait(
      until.elementLocated(
        By.xpath("//mat-select[@formcontrolname='system_id']")
      )
    );

    await systemSelect.click();

    const systemOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    let systemFound = false;

    for (const system of systemOptions) {
      const textSpan = await system.findElement(By.css(".mat-option-text"));
      const name = await textSpan.getAttribute("innerHTML");

      if (name === producerSystemName) {
        systemFound = true;
        break;
      }
    }

    expect(systemFound).toBe(false);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
