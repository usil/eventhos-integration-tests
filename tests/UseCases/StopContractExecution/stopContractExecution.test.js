const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");

const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;

describe("Stops contract execution", () => {
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

  it("Set contract inactive", async () => {
    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);

    await driver.executeScript("arguments[0].click();", idTh);

    await seoHelpers.artificialWait();

    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const editButton = await firstRowColumns[8].findElement(
      By.css("button:first-child")
    );

    await driver.executeScript("arguments[0].scrollIntoView()", editButton);

    await driver.executeScript("arguments[0].click();", editButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const activeSelect = await dialog.findElement(
      By.css("mat-select[formcontrolname='active']")
    );

    await driver.executeScript("arguments[0].click();", activeSelect);

    const activeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await driver.executeScript("arguments[0].click();", activeOptions[1]);

    await driver.wait(until.stalenessOf(activeOptions[1]));

    const updateButton = await dialog.findElement(
      By.css("div[align='end'] button:last-child")
    );

    await driver.executeScript("arguments[0].click();", updateButton);

    await driver.wait(until.stalenessOf(dialog), 6 * 1000);

    await driver.wait(until.stalenessOf(firstRow));

    const result = await axios.post(
      `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    await seoHelpers.artificialWait();
    expect(result.data).toStrictEqual({
      code: 200310,
      message: "Success, but no contracts exists for this event",
    });

    const memoryOfIntegrationServer = await axios.get(
      `${mockServerUrl}/integration`
    );

    expect(memoryOfIntegrationServer.data.content.timesCalled).toBeTruthy();
  });

  afterAll(async () => {
    await axios.get(`${mockServerUrl}/clean`);
    await driver.quit();
  });
});
