const { default: axios } = require("axios");
const { until, By } = require("selenium-webdriver");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const seoHelpers = require("../../../src/helpers/seo.helpers");
const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;
describe("Abort an event failed", () => {
    let actionId = "";
    let clientCredentials;
    let eventIdentifier = "";
    let eventContractNameAborted = "";
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
        `${mockServerUrl}/error`,
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
    
    it("Sends the event", async () => {
    const result = await axios.post(
        `${apiUrl}/event/send?event-identifier=${eventIdentifier}&access-key=${clientCredentials.accessToken}`
    );

    expect(result.data).toStrictEqual({ code: 20000, message: "success" });
    });
    it("Abort event failed", async () => {
        await driver.get(webUrl + "/dashboard/events-logs/logs-list");
        await driver.wait(until.urlIs(webUrl + "/dashboard/events-logs/logs-list"), 5 * 1000);
        const firstEventFailedRow = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[1]")), 6 * 1000, "there isn't first row for event long", 300)

        const firstEventFailedButton = await firstEventFailedRow.findElement(By.xpath("./td[6]/div/button"));
        const firstEventFailedId = await firstEventFailedRow.findElement(By.xpath("./td[1]"));
        const firstEventFailedProducerValue = await firstEventFailedRow.findElement(By.xpath("./td[2]")).getText();
        const firstEventFailedEventValue = await firstEventFailedRow.findElement(By.xpath("./td[3]")).getText();

        const firstEventFailedIdValue = await firstEventFailedId.getText();
        expect(await firstEventFailedButton.getText()).toContain("errored");

        await driver.executeScript("arguments[0].click();", firstEventFailedButton);

        const EventWithErrorRows = await driver.wait(until.elementsLocated(By.xpath("//app-events-log/app-event-contracts/table/tbody/tr")), 5 * 1000, "there isn't event contracts", 300)
        let rowWithError;
        for await (const row of EventWithErrorRows) {
            const rowStateButton = await row.findElement(By.xpath("//td[4]/button"))
            const rowNameContract = await row.findElement(By.xpath("//td[3]")).getText();
            const rowStateButtonText = await rowStateButton.getText()
            if (rowStateButtonText === "error") {
                rowWithError = row;
                eventContractNameAborted = rowNameContract;
                break;
            }
        }
        const rowAbortButton = await rowWithError.findElement(By.xpath("//td[6]/button"))
        await driver.executeScript("arguments[0].click();", rowAbortButton);
        const firstEventFailedRowAfterAbort = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[1]")), 6 * 1000, "there isn't button for event long after abort", 300)
        const firstEventFailedIdAfterAbort = await firstEventFailedRowAfterAbort.findElement(By.xpath("./td[1]"));
        const firstEventFailedProducerAfterAbortValue = await firstEventFailedRowAfterAbort.findElement(By.xpath("./td[2]")).getText();
        const firstEventFailedEventAfterAbortValue = await firstEventFailedRowAfterAbort.findElement(By.xpath("./td[3]")).getText();
        const firstEventFailedIdAfterAbortValue = await firstEventFailedIdAfterAbort.getText()
        expect(parseInt(firstEventFailedIdAfterAbortValue)).toEqual(parseInt(firstEventFailedIdValue))
        expect(firstEventFailedProducerAfterAbortValue).toBe(firstEventFailedProducerValue)
        expect(firstEventFailedEventAfterAbortValue).toBe(firstEventFailedEventValue)
    });

    it("Verify abort event failed", async () => {
        const firstEventFailedRow = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[1]")), 6 * 1000, "there isn't first row for event long", 300);
        const firstEventFailedButton = await firstEventFailedRow.findElement(By.xpath("./td[6]/div/button"));
        await driver.executeScript("arguments[0].click();", firstEventFailedButton);
        const EventWithErrorRows = await driver.wait(until.elementsLocated(By.xpath("//app-events-log/app-event-contracts/table/tbody/tr")), 5 * 1000, "there isn't event contracts", 300)
        let rowWithError;
        for await (const row of EventWithErrorRows) {
            const rowStateButton = await row.findElement(By.xpath("//td[4]/button"))
            const rowNameContract = await row.findElement(By.xpath("//td[3]")).getText();
            const rowStateButtonText = await rowStateButton.getText()
            if (rowStateButtonText === "error" && rowNameContract === eventContractNameAborted) {
                rowWithError = row;
                break;
            }
        }

        const textState = await rowWithError.findElement(By.xpath("./td[5]")).getText();
        expect(textState).toBe("aborted");
    });

    afterAll(async () => {
        await axios.get(`${mockServerUrl}/clean`);
        await driver.quit();
    });
});
    