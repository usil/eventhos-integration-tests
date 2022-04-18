const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Revoke client (012)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/clients");
    await driver.wait(
      until.urlIs(webUrl + "/dashboard/auth/clients"),
      5 * 1000
    );
    await seoHelpers.createClient(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("thead tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await idTh.click();

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Revoke client", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const revokeButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:first-child")
      ),
      5 * 1000
    );

    await revokeButton.click();

    const buttonDetached = await driver.wait(
      until.stalenessOf(revokeButton),
      5 * 1000
    );

    expect(buttonDetached).toBe(true);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let rectifyButton;

    for (const element of allRows) {
      const firstColumn = await element.findElement(By.css("td:first-child"));

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        const finalColumn = (await element.findElements(By.css("td")))[6];
        rectifyButton = await finalColumn.findElement(
          By.css("button:first-child")
        );
        break;
      }
    }

    const rectifyButtonInnerSpan = await rectifyButton.findElement(
      By.css(".mat-button-wrapper")
    );

    const rectifyButtonText = await rectifyButtonInnerSpan.getAttribute(
      "innerHTML"
    );

    expect(rectifyButtonText).toBe(" Ratify Client ");
  });

  it("Rectify client", async () => {
    const firstRow = await driver.wait(
      until.elementsLocated(By.css("tbody tr:first-child td"))
    );

    const id = await firstRow[0].getAttribute("innerHTML");

    const rectifyButton = await driver.wait(
      until.elementLocated(
        By.css("tbody tr:first-child td:last-child button:first-child")
      )
    );

    await rectifyButton.click();

    const buttonDetached = await driver.wait(
      until.stalenessOf(rectifyButton),
      5 * 1000
    );

    expect(buttonDetached).toBe(true);

    const allRows = await driver.wait(
      until.elementsLocated(By.css("tbody tr"))
    );

    let revokeButton;

    for (const element of allRows) {
      const firstColumn = await element.findElement(By.css("td:first-child"));

      const currentID = parseInt(await firstColumn.getAttribute("innerHTML"));

      if (currentID === parseInt(id)) {
        const finalColumn = (await element.findElements(By.css("td")))[6];
        revokeButton = await finalColumn.findElement(
          By.css("button:first-child")
        );
        break;
      }
    }

    const revokeButtonInnerSpan = await revokeButton.findElement(
      By.css(".mat-button-wrapper")
    );

    const revokeButtonText = await revokeButtonInnerSpan.getAttribute(
      "innerHTML"
    );

    expect(revokeButtonText).toBe(" Revoke Client ");
  });

  afterAll(async () => {
    await driver.quit();
  });
});
