const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until } = require("selenium-webdriver");
const createIntegrationTestServer = require("../../../src/server/server");
const { By } = require("selenium-webdriver");
const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const pcIP = process.env.pcIP;
const password = process.env.adminPassword;
const integrationServerPort = process.env.serverPort;

describe("View event contracts (033)", () => {
  let actionId = "";
  let clientCredentials;
  let eventIdentifier = "";
  let server;
  let driver;

  beforeAll(async () => {
    const app = createIntegrationTestServer();
    server = app.listen(integrationServerPort);

    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
  });

  it("Creates a client", async () => {
    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    clientCredentials = await seoHelpers.createClient(driver);

    expect(clientCredentials.clientId).toBeTruthy();
    expect(clientCredentials.clientSecret).toBeTruthy();
    expect(clientCredentials.accessToken).toBeTruthy();
  });

  it("Creates a producer system", async () => {
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createProducerSystem(driver);

    expect(created).toBeTruthy();
  });

  it("Creates an event", async () => {
    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    eventIdentifier = await seoHelpers.createEvent(driver);

    expect(eventIdentifier).toBeTruthy();
  });

  it("Creates a consumer system", async () => {
    await testAndCreateConsumerSystem();
  });

  it("Creates an action", async () => {
    await testAndCreateAction();
  });

  it("Create contract", async () => {
    await testAndCreateContract();
  });

  const testAndCreateConsumerSystem = async () => {
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createConsumerSystem(driver);

    expect(created).toBe(true);
  };

  it("Creates a second consumer system", async () => {
    await testAndCreateConsumerSystem();
  });

  const testAndCreateAction = async () => {
    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    actionId = await seoHelpers.createAction(
      driver,
      `http://${pcIP}:${integrationServerPort}/integration`,
      1
    );

    expect(actionId).toBeTruthy();
  };

  it("Creates a second action", async () => {
    await testAndCreateAction();
  });

  const testAndCreateContract = async () => {
    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);

    const created = await seoHelpers.createContract(driver);

    expect(created).toBe(true);
  };

  it("Creates a second contract", async () => {
    await testAndCreateContract();
  });

  it("View event contracts", async () => {
    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const editButton = await firstRowColumns[5].findElement(By.css("button"));

    await editButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const orderInputs = await driver.wait(
      until.elementsLocated(By.css("input[formcontrolname='order']")),
      6 * 1000
    );

    expect(orderInputs.length).toBe(2);
    expect(dialog).toBeTruthy();

    await orderInputs[0].clear();
    await orderInputs[0].sendKeys(1);

    const updateButton = await dialog.findElement(By.css("button:last-child"));

    await updateButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await editButton.click();

    await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const orderInputsPostUpdate = await driver.wait(
      until.elementsLocated(By.css("input[formcontrolname='order']")),
      6 * 1000
    );

    const value = await orderInputsPostUpdate[1].getAttribute("value");

    expect(value).toBe("1");
  });

  afterAll(async () => {
    server.close();
    await driver.quit();
  });
});
