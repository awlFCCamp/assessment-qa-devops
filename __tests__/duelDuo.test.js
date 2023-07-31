const {
  Builder,
  Browser,
  By,
  until,
  WebDriverWait,
} = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.FIREFOX).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  test('displays the "choices" div after clicking the "Draw" button', async () => {
    // Find and click the "Draw" button
    await driver.get("http://localhost:8000");
    const drawButton = await driver.wait(
      until.elementLocated(By.id("draw")),
      1000
    );
    await drawButton.click();
    // Wait for the "choices" div to be visible
    const choicesDiv = await driver.findElement(By.id("choices"));
    await driver.wait(until.elementIsVisible(choicesDiv), 5000); // Adjust the wait time as needed

    // Check if the "choices" div is displayed
    const isChoicesDivDisplayed = await choicesDiv.isDisplayed();
    expect(isChoicesDivDisplayed).toBe(true);
  });

  //Check that clicking an “Add to Duo” button displays the div with id = “player-duo”
  test("Check that clicking an “Add to Duo” button displays the div with id = “player-duo”", async () => {
    // Find and click the "Add to Duo" button
    await driver.get("http://localhost:8000");
    const drawButton = await driver.wait(
      until.elementLocated(By.id("draw")),
      1000
    );
    await drawButton.click();
    const addToDuoBtn = await driver.wait(
      until.elementLocated(By.css("#choices > div:nth-child(1) > button"))
    );
    addToDuoBtn.click();
    // Wait for the "player-duo" div to be visible
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    await driver.wait(until.elementIsVisible(playerDuoDiv), 5000); // Adjust the wait time as needed

    // Check if the "player-duo" div is displayed
    const isPlayerDuoDivDisplayed = await playerDuoDiv.isDisplayed();
    expect(isPlayerDuoDivDisplayed).toBe(true);
  });

  //Check that when a bot is “Removed from Duo”, that it goes back to “choices”
  test("Check that when a bot is 'Removed from Duo', that it goes back to 'choices'", async () => {
    // Find and click the "Add to Duo" button
    await driver.get("http://localhost:8000");
    const drawButton = await driver.wait(
      until.elementLocated(By.id("draw")),
      1000
    );
    await drawButton.click();
    const addToDuoBtn = await driver.wait(
      until.elementLocated(By.css("#choices > div:nth-child(1) > button")) //click on the first card
    );
    addToDuoBtn.click();

    // Wait for the "player-duo" div to be visible
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    await driver.wait(until.elementIsVisible(playerDuoDiv), 5000); // Adjust the wait time as needed

    // Check if the "player-duo" div is displayed
    const isPlayerDuoDivDisplayed = await playerDuoDiv.isDisplayed();
    expect(isPlayerDuoDivDisplayed).toBe(true);

    //find the selected card and click on the remove from duo button
    const removeFromDuoBtn = await driver.wait(
      until.elementLocated(By.css("#player-duo > div > button"))
    );
    await removeFromDuoBtn.click();

    //now make sure there are five cards in the choices div,
    //this mean the card went back to the choices dive after click the remove from duo button
    const cards = await driver.findElements(By.css("#choices > div"));
    await expect(cards.length).toBe(5);
  });
});
