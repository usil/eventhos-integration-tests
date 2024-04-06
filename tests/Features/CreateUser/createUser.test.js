const seoHelpers = require("../../../src/helpers/seo.helpers");
const ScreenshotHelper = require("../../../src/helpers/ScreenshotHelper");
const getBrowserDriver = require("../../../src/browsers/browserDriver");
const { By, until } = require("selenium-webdriver");
const rs = require("randomstring");

const webUrl = process.env.webUrl;
const password = process.env.adminPassword;

describe("Create a user (005)", () => {
  let driver;
  const userPassword = "passworD1!";

  beforeAll(async () => {
    driver = await getBrowserDriver();
    global.driver = driver;
    await seoHelpers.enterIntoEventhos(driver, webUrl, password);
  });

  it("Creates a new user", async () => {
    var createdUser = await createUser();    
    //if a new user is created with same username, a warning should appear: That username is already on use
    //this will indicate us that user was created
    await createUser(createdUser.nameString,  createdUser.userNameString); 
    await seoHelpers.artificialWait();
    const errorDisplayDiv = await driver.wait(
      until.elementLocated(By.className("error-display ng-star-inserted")),
      5 * 1000
    );
    var text = await errorDisplayDiv.getText();
    expect(text.trim()).toBe("That username is already on use");
  });

  async function createUser(nameString, userNameString){

    await driver.get(webUrl + "/dashboard/auth/users");
    await driver.wait(until.urlIs(webUrl + "/dashboard/auth/users"), 5 * 1000);

    if(typeof nameString === 'undefined'){
      nameString = rs.generate({
        length: 8,
        charset: "alphabetic",
      });
    }

    if(typeof userNameString === 'undefined'){
      userNameString = rs.generate({
        length: 8,
        charset: "alphabetic",
      });
    }  

    const clientHead = await driver.wait(
      until.elementLocated(By.className("users-head")),
      5 * 1000
    );

    const openDialogButton = await clientHead.findElement(
      By.className("mat-flat-button")
    );

    const buttonTextComponent = await openDialogButton.findElement(
      By.className("mat-button-wrapper")
    );

    const buttonText = await buttonTextComponent.getAttribute("innerHTML");

    expect(buttonText).toBe(" Add User ");

    await driver.executeScript("arguments[0].click();", openDialogButton);

    const dialog = await driver.wait(
      until.elementLocated(By.css("mat-dialog-container")),
      5 * 1000
    );

    /* const actionsButtons = await dialog.findElements(
      By.css("mat-dialog-actions button")
    ); */

    const actionsButtons = await dialog.findElements(
      By.xpath("//create-user/form/div[2]/button")
    );
    const createButton = actionsButtons[1];

    const nameInput = await dialog.findElement(By.name("name"));

    const descriptionInput = await driver.findElement(By.name("description"));

    const usernameInput = await driver.findElement(By.name("username"));

    const passwordInput = await dialog.findElement(By.name("password"));

    const resourceSelect = await dialog.findElement(By.name("role"));

    await nameInput.sendKeys(nameString);
    await driver.executeScript("arguments[0].click();", descriptionInput);

    await descriptionInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );
    await descriptionInput.sendKeys(
      rs.generate({
        length: 8,
        charset: "alphabetic",
      })
    );

    await driver.executeScript("arguments[0].click();", passwordInput);
    await passwordInput.sendKeys(userPassword);


    await usernameInput.sendKeys(userNameString);

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const options = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    await driver.executeScript("arguments[0].click();", options[0]);

    const addButton = await dialog.findElement(By.css(".select-role button"));

    await driver.executeScript("arguments[0].click();", addButton);

    const rolesList = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesList.length).toBe(1);

    const removeButton = await dialog.findElement(By.css(".roles-list button"));

    await driver.executeScript("arguments[0].click();", removeButton);

    const rolesListPostRemove = await dialog.findElements(
      By.css(".roles-list .role-title")
    );

    expect(rolesListPostRemove.length).toBe(0);

    const createButtonDisabledAttribute = await createButton.getAttribute(
      "disabled"
    );

    expect(createButtonDisabledAttribute).toBe("true");

    await driver.executeScript("arguments[0].click();", resourceSelect);

    const secondOptions = await driver.wait(
      until.elementsLocated(By.css(".mat-option"))
    );

    expect(secondOptions.length).toBe(options.length);

    await driver.executeScript("arguments[0].click();", secondOptions[0]);

    await driver.executeScript("arguments[0].click();", addButton);

    await driver.executeScript("arguments[0].click();", createButton);    

    return {nameString, userNameString}
  }
  

  afterAll(async () => {
    await driver.quit();
  });
});
