const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const createIntegrationTestServer = require("../../../src/server/server");
const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const pcIP = process.env.pcIP;
const password = process.env.adminPassword;
const integrationServerPort = process.env.serverPort;

describe("Stops contract execution", () => {
  let actionId = "";
  let clientCredentials;
  let eventIdentifier = "";
  let server;

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
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createConsumerSystem(driver);

    expect(created).toBe(true);
  });

  it("Creates an action", async () => {
    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    actionId = await seoHelpers.createAction(
      driver,
      `http://${pcIP}:${integrationServerPort}/integration`,
      1
    );

    expect(actionId).toBeTruthy();
  });

  it("Create contract", async () => {
    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);

    const created = await seoHelpers.createContract(driver);

    expect(created).toBe(true);
  });

  it("Sends an event", async () => {
    const result = await axios.post(
      `${apiUrl}/event/received?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({ code: 20000, message: "success" });

    const memoryOfIntegrationServer = await axios.get(
      `http://localhost:${integrationServerPort}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).toStrictEqual({});
  });

  it("Set contract inactive", async () => {
    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await idTh.click();

    await seoHelpers.artificialWait();

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const editButton = await firstRowColumns[7].findElement(
      By.css("button:first-child")
    );

    await editButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const activeSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='active']")
    );

    await activeSelect.click();

    const activeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await activeOptions[1].click();

    await driver.wait(until.stalenessOf(activeOptions[1]));

    const updateButton = await dialog.findElement(
      By.css("div[align='end'] button:last-child")
    );

    await updateButton.click();

    await driver.wait(until.stalenessOf(dialog), 6 * 1000);

    await driver.wait(until.stalenessOf(firstRow));

    const result = await axios.post(
      `${apiUrl}/event/received?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({
      code: 200310,
      message: "Success, but no contracts exists for this event",
    });

    const memoryOfIntegrationServer = await axios.get(
      `http://localhost:${integrationServerPort}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.timesCalled).toBe(1);
  });

  afterAll(async () => {
    server.close();
    await driver.quit();
  });
});
