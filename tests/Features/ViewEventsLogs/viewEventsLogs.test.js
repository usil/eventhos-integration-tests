const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until, By } = require("selenium-webdriver");

const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;

describe("View events logs (032)", () => {
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
      `${mockServerUrl}/integration`,
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
      `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({ code: 20000, message: "success" });

    await seoHelpers.artificialWait();

    const memoryOfIntegrationServer = await axios.get(
      `${mockServerUrl}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.body).toStrictEqual({});
  });

  it("View events in table", async () => {
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

    expect(lastButtonSpanText).toBe(" 1 processed ");

    await lastButton.click();

    await driver.wait(
      until.urlIs(
        webUrl +
          `/dashboard/events-logs/logs-list/event-contracts?receivedEventId=${idText}`
      ),
      5 * 1000
    );

    const matCard = await driver.wait(until.elementLocated(By.css("mat-card")));

    expect(matCard).toBeTruthy();

    const firstRowContractsTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child")),
      5 * 1000
    );

    const lastButtonRowContractsTable =
      await firstRowContractsTable.findElement(By.css("td:last-child button"));

    await lastButtonRowContractsTable.click();

    await driver.wait(until.stalenessOf(matCard));

    const matCardFinal = await driver.wait(
      until.elementLocated(By.css("mat-card"))
    );

    const matCardTitle = await matCardFinal.findElement(
      By.css("mat-card-title")
    );

    const titleText = await matCardTitle.getAttribute("innerHTML");

    expect(titleText).toBe("200");
  });

  afterAll(async () => {
    await axios.get(`${mockServerUrl}/clean`);
    await driver.quit();
  });
});
