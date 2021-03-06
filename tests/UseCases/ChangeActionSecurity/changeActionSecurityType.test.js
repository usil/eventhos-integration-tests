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

describe("Changes the action security", () => {
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
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createConsumerSystem(driver);

    expect(created).toBe(true);
  });

  it("Creates an action with no security", async () => {
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

  it("Send no auth post first post", async () => {
    const result = await axios.post(
      `${apiUrl}/event/received?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({ code: 20000, message: "success" });

    const memoryOfIntegrationServer = await axios.get(
      `http://localhost:${integrationServerPort}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).toStrictEqual({});
  });

  it("Change action security", async () => {
    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);

    const editFirstRowButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:first-child")
      )
    );

    await editFirstRowButton.click();

    await driver.wait(until.stalenessOf(editFirstRowButton));

    const securityTypeSelect = await driver.wait(
      until.elementLocated(
        By.xpath("//mat-select[@formcontrolname='securityType']")
      )
    );

    await securityTypeSelect.click();

    const securityTypeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await securityTypeOptions[1].click();

    await driver.wait(until.stalenessOf(securityTypeOptions[1]));

    const tokenUrlInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@formcontrolname='securityUrl']")),
      5 * 1000
    );

    const clientIdInput = await driver.wait(
      until.elementLocated(By.xpath("//input[@formcontrolname='clientId']")),
      5 * 1000
    );

    const clientSecretInput = await driver.wait(
      until.elementLocated(
        By.xpath("//input[@formcontrolname='clientSecret']")
      ),
      5 * 1000
    );

    await tokenUrlInput.sendKeys(
      `http://${pcIP}:${integrationServerPort}/token`
    );

    await clientIdInput.sendKeys("clientId");

    await clientSecretInput.sendKeys("secret");

    const updateButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    const rawTextInput = await driver.wait(
      until.elementLocated(By.xpath("//textarea[@formcontrolname='rawBody']")),
      5 * 1000
    );

    await rawTextInput.clear();

    await rawTextInput.sendKeys(
      '{"token": "${.oauthResponse.body.content.access_token}"}'
    );

    await updateButton.click();

    await driver.wait(until.stalenessOf(updateButton), 5 * 1000);

    const updated = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    expect(updated).toBeTruthy();
  });

  it("Send with oauth", async () => {
    const result = await axios.post(
      `${apiUrl}/event/received?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({ code: 20000, message: "success" });

    await seoHelpers.artificialWait(2000);

    const memoryOfIntegrationServer = await axios.get(
      `http://localhost:${integrationServerPort}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).toStrictEqual({
      token: "token_021",
    });
  });

  afterAll(async () => {
    server.close();
    await driver.quit();
  });
});
