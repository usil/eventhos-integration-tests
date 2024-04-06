const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { until, By } = require("selenium-webdriver");
const createActionHelpers = require("../../Features/CreateAction/createActionHelpers");
const rs = require("randomstring");

// const { expect } = require("chai");

const axios = require("axios").default;

const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;

describe("Sends an event with raw function body", () => {
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

  it("Creates an action with raw function body", async () => {
    await driver.get(webUrl + "/dashboard/action");
    await driver.wait(until.urlIs(webUrl + "/dashboard/action"), 5 * 1000);

    /* actionId = await seoHelpers.createAction(
      driver,
      `${mockServerUrl}/integration`,
      1,
      [],
      [],
      {
        integration: true,
      }
    );

    expect(actionId).toBeTruthy(); */
    const nameInput = await driver.wait( until.elementLocated(
        By.xpath("//input[@formcontrolname='name']")
    ), 5 * 1000, "There isn't name input", 3 * 100);
  
    const systemSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='system_id']")
    );

    const operationInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='operation']")
    );

    const descriptionTextInput = await driver.findElement(
      By.xpath("//textarea[@formcontrolname='description']")
    );

    const urlInput = await driver.findElement(
      By.xpath("//input[@formcontrolname='url']")
    );

    const methodSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='method']")
    );

    const securityTypeSelect = await driver.findElement(
      By.xpath("//mat-select[@formcontrolname='securityType']")
    );

    const actionName = rs.generate({
      length: 8,
      charset: "alphabetic",
    });

    const formButtons = await driver.findElements(By.css("form button"));

    const createButton = formButtons[2];

    await nameInput.sendKeys(actionName);

    await descriptionTextInput.sendKeys(
      rs.generate({
        length: 16,
        charset: "alphabetic",
      })
    );
  
    await driver.executeScript("arguments[0].click();", systemSelect);    
    const systemOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );
    await systemOptions[0].click();

    await driver.wait(until.stalenessOf(systemOptions[0]));

    const operationKey = "new"
    await operationInput.sendKeys(operationKey)

    await urlInput.sendKeys(`${mockServerUrl}/custom-logic`);

    await methodSelect.click();

    const methodOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await methodOptions[1].click();

    await driver.wait(until.stalenessOf(methodOptions[0]));
    await securityTypeSelect.click();
    const securityTypeOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );
    await securityTypeOptions[0].click();

    const radioButtonCode = await driver.findElement(By.id('mat-radio-4-input'));
    await driver.executeScript("arguments[0].click();", radioButtonCode);
    const textAreaRawFunctionBody = await driver.findElement(By.id('action-raw-function-body'));
    await textAreaRawFunctionBody.sendKeys(
      `const request = {};
      if(eventContext.httpRequest.body.sex === 'M') {
       request.sexo = 1;
      } else if (eventContext.httpRequest.body.sex === 'F') {
       request.sexo = 2
      }
      return request;`
      );
    await driver.executeScript("arguments[0].click();", createButton);
    await createActionHelpers.verifyIfExistActionByName(driver, actionName)
  });

  it("Create contract", async () => {
    await driver.get(webUrl + "/dashboard/contract");
    await driver.wait(until.urlIs(webUrl + "/dashboard/contract"), 5 * 1000);

    const created = await seoHelpers.createContract(driver);

    expect(created).toBe(true);
  });

  it("Sends an event", async () => {
    var fullUrl = `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`;
    console.log(fullUrl)
    const result = await axios.post(
      fullUrl,
      {
        sex: "M"
      }
    );
    expect(result.data).toStrictEqual({ code: 20000, message: "success" });
    console.log(`${mockServerUrl}/custom-logic`)
    const memoryOfIntegrationServer = await axios.get(
      `${mockServerUrl}/custom-logic`
    );
    console.log(memoryOfIntegrationServer.data)
    expect(memoryOfIntegrationServer.data.content.sexo).toBe(1)
  });

  afterAll(async () => {
    //await axios.get(`${mockServerUrl}/clean`);
    await driver.quit();
  });
});
