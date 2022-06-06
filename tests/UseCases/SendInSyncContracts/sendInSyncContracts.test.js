const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until } = require("selenium-webdriver");

const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerDomain = process.env.mockServerDomain;
const password = process.env.adminPassword;
const integrationMockServerPort = process.env.mockServerPort;

describe("Sends an event with synchronous contracts", () => {
  let actionId = "";
  let clientCredentials;
  let eventIdentifier = "";

  let driver;

  beforeAll(async () => {
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
      `http://${mockServerDomain}:${integrationMockServerPort}/integration`,
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

  it("Creates a second consumer system", async () => {
    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    const created = await seoHelpers.createConsumerSystem(driver);

    expect(created).toBe(true);
  });

  it("Creates a second action", async () => {
    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    actionId = await seoHelpers.createAction(
      driver,
      `http://${mockServerDomain}:${integrationMockServerPort}/integration`,
      1
    );

    expect(actionId).toBeTruthy();
  });

  it("Creates a second contract", async () => {
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

    await seoHelpers.artificialWait();

    const memoryOfIntegrationServer = await axios.get(
      `http://${mockServerDomain}:${integrationMockServerPort}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).toStrictEqual({});
    expect(memoryOfIntegrationServer.data.content.calledTimes.length).toBe(2);
    expect(memoryOfIntegrationServer.data.content.calledTimes[0]).toBeLessThan(
      memoryOfIntegrationServer.data.content.calledTimes[1]
    );
  });

  afterAll(async () => {
    await axios.get(
      `http://${mockServerDomain}:${integrationMockServerPort}/clean`
    );
    await driver.quit();
  });
});
