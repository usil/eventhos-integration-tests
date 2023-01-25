const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Delete role works (016)", () => {
  let driver;

  beforeEach(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
    await driver.get(webUrl + "/dashboard/auth/roles");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/roles"), 5 * 1000);
    await seoHelpers.creatRole(driver);

    const idTh = await driver.wait(
      until.elementLocated(By.css("tr th:first-child")),
      5 * 1000
    );

    const oneXOneInTable = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:first-child"))
    );

    await driver.executeScript("arguments[0].scrollIntoView()", idTh);
    await driver.executeScript("arguments[0].click();", idTh);

    await driver.wait(until.stalenessOf(oneXOneInTable), 5 * 1000);
  });

  it("Cancel delete", async () => {
    const oneXFourTableDeleteButton = await driver.wait(
      until.elementLocated(By.css("tbody tr:first-child td:last-child button"))
    );
    const nameOfRole = await driver.wait(
      until.elementLocated(
        By.xpath("//div/div[2]/div/div/table/tbody/tr[1]/td[2]")
      ),
      5 * 1000,
      "There isn't first column of roles",
      300
    );
    if (nameOfRole !== "admin") {
      await driver.executeScript(
        "arguments[0].click();",
        oneXFourTableDeleteButton
      );

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionButtons = await dialog.findElements(By.css("button"));

      const cancelButton = actionButtons[0];

      await cancelButton.click();

      const dialogDetached = await driver.wait(
        until.stalenessOf(dialog),
        6 * 1000
      );

      expect(dialogDetached).toBe(true);
    }
  });

  it("Delete role works", async () => {
    const nameOfRole = await driver.wait(
      until.elementLocated(
        By.xpath("//div/div[2]/div/div/table/tbody/tr[1]/td[2]")
      ),
      5 * 1000,
      "There isn't first column of roles",
      300
    );
    if (nameOfRole !== "admin") {
      const oneXOneInTable = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:first-child"))
      );
      const numberOfElements = parseInt(
        await oneXOneInTable.getAttribute("innerHTML")
      );

      const oneXFourTableDeleteButton = await driver.wait(
        until.elementLocated(
          By.css("tbody tr:first-child td:last-child button")
        )
      );

      await driver.executeScript(
        "arguments[0].click();",
        oneXFourTableDeleteButton
      );

      const dialog = await driver.wait(
        until.elementLocated(By.css("mat-dialog-container")),
        5 * 1000
      );

      const actionButtons = await dialog.findElements(By.css("button"));

      const deleteButton = actionButtons[1];

      await deleteButton.click();

      const dialogDetached = await driver.wait(
        until.stalenessOf(dialog),
        6 * 1000
      );

      expect(dialogDetached).toBe(true);

      await seoHelpers.artificialWait();

      const allFirstColumns = await driver.wait(
        until.elementsLocated(By.css("tbody tr td:first-child"))
      );

      let foundId = 0;

      for (const row of allFirstColumns) {
        const id = parseInt(await row.getAttribute("innerHTML"));
        if (id === numberOfElements) {
          foundId++;
        }
      }

      expect(foundId).toBe(0);
    }
  });

  afterAll(async () => {
    await driver.quit();
  });
});
