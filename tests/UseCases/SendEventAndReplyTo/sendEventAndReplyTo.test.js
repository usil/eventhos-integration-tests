const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until, By } = require("selenium-webdriver");

const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;

let actionIdReply = "";
let clientCredentialsReply;
let eventIdentifierReply = "";
describe("Sends an event", () => {

  let driver;

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

    clientCredentialsReply = await seoHelpers.createClient(driver);

    expect(clientCredentialsReply.clientId).toBeTruthy();
    expect(clientCredentialsReply.clientSecret).toBeTruthy();
    expect(clientCredentialsReply.accessToken).toBeTruthy();
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

    eventIdentifierReply = await seoHelpers.createEvent(driver);

    expect(eventIdentifierReply).toBeTruthy();
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

    actionIdReply = await seoHelpers.createAction(
      driver,
      `${mockServerUrl}/integration`,
      1
    );

    expect(actionIdReply).toBeTruthy();
  });

  it("Create contract", async () => {
    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);
    const created = await seoHelpers.createContract(driver);
    expect(created).toBe(true);
  });

  afterAll(async () => {
    await axios.get(`${mockServerUrl}/clean`);
    await driver.quit();
  });
});

///////////////////////////////////////////////

describe("Sends an event and verify if work reply to", () => {
    let actionId = "";
    let clientCredentials;
    let eventIdentifier = "";
    let driver;
  
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
        `${mockServerUrl}/integration`,
        1,
        [],
        [],
        null,
        null,
        eventIdentifierReply
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
        `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
      );
  
      expect(result.data).toStrictEqual({ code: 20000, message: "success" });
  
    });

    it('Verify reply to', async () => {
      await driver.get(webUrl + "/dashboard/events-logs/logs-list");
      const firstRowEventIdentifierCondition = until.elementLocated(By.xpath('//app-events-log/app-logs-list/div/table/tbody/tr[1]/td[3]'));
      const firstRowEventIdentifier = await driver.wait(el => firstRowEventIdentifierCondition.fn(el), 5 * 1000, "There isn't last button of event log status", 3 * 100);
      console.log(await firstRowEventIdentifier.getText());
      expect(await firstRowEventIdentifier.getText()).toBe(eventIdentifierReply);
    });
  
    afterAll(async () => {
      await axios.get(`${mockServerUrl}/clean`);
      await driver.quit();
    });
  });
