const seoHelpers = require("../../../src/helpers/seo.helpers");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, Key, until } = require("selenium-webdriver");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Login form  works (001)", () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    //await driver.get(webUrl);
    //await driver.wait(until.urlIs(webUrl + "/login"), 5 * 1000);
  });

  it("Should be redirected to login after logout", async () => {
    await driver.get(webUrl);
    await seoHelpers.artificialWait(1000);
    var currentUrl = await driver.getCurrentUrl();
    if(currentUrl.endsWith("/dashboard/profile")){
      // we have a session, perform a logout
      const adminButton = await driver.findElement(By.className("mat-focus-indicator mat-menu-trigger profile-menu mat-button mat-button-base mat-accent"));
      await adminButton.click();   
      await seoHelpers.artificialWait(1000);   
      const divProfileLOgout = await driver.findElement(By.id("mat-menu-panel-0"));
      const buttons = await divProfileLOgout.findElements(By.css('button'));
      await buttons[1].click();
    }

    currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(webUrl + "/login");

  });

  it("Prints incorrect password and disabled button", async () => {

    await driver.get(webUrl);
    await seoHelpers.artificialWait(1000);
    currentUrl = await driver.getCurrentUrl();
    if(currentUrl.endsWith("/dashboard/profile")){
      // we have a session, perform a logout
      const adminButton = await driver.findElement(By.className("mat-focus-indicator mat-menu-trigger profile-menu mat-button mat-button-base mat-accent"));
      await adminButton.click();   
      await seoHelpers.artificialWait(1000);   
      const divProfileLOgout = await driver.findElement(By.id("mat-menu-panel-0"));
      const buttons = await divProfileLOgout.findElements(By.css('button'));
      await buttons[1].click();
    }   
    const usernameInput = await driver.findElement(By.name("username"));
    await usernameInput.sendKeys("admin");
    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.sendKeys("1234");//atleast 5 chars are required

    const submitButton = await driver.findElement(By.className("login-btn"));

    const buttonStateFirst = await submitButton.getAttribute("disabled");

    expect(buttonStateFirst).toBe("true");

    await passwordInput.sendKeys("Admin2");

    const buttonStateSecond = await submitButton.getAttribute("disabled");

    expect(buttonStateSecond).toBe(null);

    submitButton.click();

    const errorDisplay = await driver.wait(
      until.elementLocated(By.className("error-display")),
      5 * 1000
    );

    const h5ErrorDisplay = await errorDisplay.findElement(By.tagName("h5"));

    const h5Value = await h5ErrorDisplay.getAttribute("innerHTML");

    expect(h5Value).toBe("Login failed; Invalid username or password.");
  });

  it("Logs in correctly", async () => {

    await driver.get(webUrl);
    await seoHelpers.artificialWait(1000);
    currentUrl = await driver.getCurrentUrl();
    if(currentUrl.endsWith("/dashboard/profile")){
      // we have a session, perform a logout
      const adminButton = await driver.findElement(By.className("mat-focus-indicator mat-menu-trigger profile-menu mat-button mat-button-base mat-accent"));
      await adminButton.click();   
      await seoHelpers.artificialWait(1000);   
      const divProfileLOgout = await driver.findElement(By.id("mat-menu-panel-0"));
      const buttons = await divProfileLOgout.findElements(By.css('button'));
      await buttons[1].click();
    }      

    await driver.wait(
      until.elementLocated(By.name("username")),
      5 * 1000
    );

    const usernameInput = await driver.findElement(By.name("username"));
    await usernameInput.clear();
    await usernameInput.sendKeys("admin");
    const passwordInput = await driver.findElement(By.name("password"));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    const submitButton = await driver.findElement(By.className("login-btn"));
    submitButton.click();

    const result = await driver.wait(
      until.urlIs(webUrl + "/dashboard/profile"),
      5 * 1000
    );

    expect(result).toBe(true);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
