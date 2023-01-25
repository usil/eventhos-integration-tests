const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Deletes an event (025)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);

    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );

    await seoHelpers.createClient(driver);

    await driver.get(webUrl + "/dashboard/system");
    await driver.wait(until.urlIs(webUrl + "/dashboard/system"), 5 * 1000);

    await seoHelpers.createProducerSystem(driver);

    await driver.get(webUrl + "/dashboard/event");
    await driver.wait(until.urlIs(webUrl + "/dashboard/event"), 5 * 1000);

    await seoHelpers.createEvent(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Delete an event works", async () => {
    const firstRow = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child"))
    );

    const firstRowColumns = await firstRow.findElements(By.css("td"));

    const eventNameToDelete = await firstRowColumns[2].getAttribute("innerHTML");

    const deleteButton = await firstRowColumns[6].findElement(
      By.css("button:last-child")
    );

    await deleteButton.click();

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    const actionButtons = await dialog.findElements(By.css("button"));

    const confirmButton = actionButtons[1];

    await confirmButton.click();

    const dialogDetached = await driver.wait(
      until.stalenessOf(dialog),
      6 * 1000
    );

    expect(dialogDetached).toBe(true);

    await seoHelpers.artificialWait();

    //search the deleted event
    const tableSectionElement = await driver.findElement(
      By.xpath("//section[@class='show-table']")
    );

    const searchEventByNameTextInput = await tableSectionElement.findElement(
      By.css("input[formcontrolname*='name']")
    ); 

    await searchEventByNameTextInput.clear();
    await searchEventByNameTextInput.sendKeys(eventNameToDelete.toLowerCase());

    //#TODO: wait until the search
    //I tried this https://stackoverflow.com/a/47653460/3957754
    //with no luck. So ...
    await seoHelpers.artificialWait(2*1000);

    const paginatorCountLabelElement = await tableSectionElement.findElement(
      By.css("div[class*='mat-paginator-range-label']")
    );    
    
    //when event is not found, paginator label shows
    //"0 of 0"
    const paginatorCountText = await paginatorCountLabelElement.getAttribute("innerHTML");    

    expect(paginatorCountText.trim()).toBe("0 of 0");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
