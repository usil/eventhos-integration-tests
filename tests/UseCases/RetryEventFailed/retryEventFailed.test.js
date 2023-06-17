const { default: axios } = require("axios");
const { until, By } = require("selenium-webdriver");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const seoHelpers = require("../../../src/helpers/seo.helpers");
const webUrl = process.env.webUrl;
const apiUrl = process.env.apiUrl;
const mockServerUrl = process.env.mockServerUrl;
const password = process.env.adminPassword;
describe("Retry an event failed", () => {
    let actionId = "";
    let clientCredentials;
    let eventIdentifier = "";
    let eventContractNameRetried = "";

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
    it("Retry event failed", async () => {
        await driver.get(webUrl + "/dashboard/events-logs/logs-list");
        await driver.wait(until.urlIs(webUrl + "/dashboard/events-logs/logs-list"), 5 * 1000);
        const firstEventFailedRow = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[1]")), 6 * 1000, "there isn't button for event long", 300)

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
                eventContractNameRetried = rowNameContract;

                break;
            }
        }
        const rowRetryButton = await rowWithError.findElement(By.xpath("//td[5]/button"))
        await driver.executeScript("arguments[0].click();", rowRetryButton);
        const firstEventFailedRowAfterRetry = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[1]")), 6 * 1000, "there isn't button for event long after retry", 300)
        const firstEventFailedIdAfterRetry = await firstEventFailedRowAfterRetry.findElement(By.xpath("./td[1]"));
        const firstEventFailedProducerAfterRetryValue = await firstEventFailedRowAfterRetry.findElement(By.xpath("./td[2]")).getText();
        const firstEventFailedEventAfterRetryValue = await firstEventFailedRowAfterRetry.findElement(By.xpath("./td[3]")).getText();
        const firstEventFailedIdAfterRetryValue = await firstEventFailedIdAfterRetry.getText()
        expect(parseInt(firstEventFailedIdAfterRetryValue)).toBeGreaterThan(parseInt(firstEventFailedIdValue))
        expect(firstEventFailedProducerAfterRetryValue).toBe(firstEventFailedProducerValue)
        expect(firstEventFailedEventAfterRetryValue).toBe(firstEventFailedEventValue)

    });
    it("Verify retry event failed", async () => {
        const secondEventFailedRow = await driver.wait(until.elementLocated(By.xpath("//app-logs-list/div/table/tbody/tr[2]")), 6 * 1000, "there isn't second row for event long", 300);
        const secondEventFailedButton = await secondEventFailedRow.findElement(By.xpath("./td[6]/div/button"));
        await driver.executeScript("arguments[0].click();", secondEventFailedButton);

        const EventWithErrorRows = await driver.wait(until.elementsLocated(By.xpath("//app-events-log/app-event-contracts/table/tbody/tr")), 5 * 1000, "there isn't event contracts", 300)
        let rowWithError;
        for await (const row of EventWithErrorRows) {
            const rowStateButton = await row.findElement(By.xpath("//td[4]/button"))
            const rowNameContract = await row.findElement(By.xpath("//td[3]")).getText();
            const rowStateButtonText = await rowStateButton.getText()
            if (rowStateButtonText === "error" && rowNameContract === eventContractNameRetried) {
                rowWithError = row;
                break;
            }
        }

        const textState = await rowWithError.findElement(By.xpath("./td[5]")).getText();
        expect(textState).toBe("retried");
    })
    afterAll(async () => {
        await axios.get(`${mockServerUrl}/clean`);
        await driver.quit();
    });
});
    