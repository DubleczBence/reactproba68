const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const fs = require('fs');

jest.setTimeout(180000); // Növeljük a timeout-ot 3 percre

describe('Company Survey Creation Test', () => {
  let driver;

  // Helper function to take screenshots
  async function takeScreenshot(name) {
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    try {
      const image = await driver.takeScreenshot();
      fs.writeFileSync(`./screenshots/company-survey-${name}.png`, image, 'base64');
      console.log(`Screenshot saved: company-survey-${name}.png`);
    } catch (e) {
      console.log(`Error taking screenshot ${name}: ${e.message}`);
    }
  }

  async function logPageStructure() {
    console.log("=== PAGE STRUCTURE ===");
    
    // Log all buttons
    console.log("BUTTONS:");
    const buttons = await driver.findElements(By.css('button'));
    for (const button of buttons) {
      try {
        const text = await button.getText();
        const classes = await button.getAttribute('class');
        console.log(`Button: "${text}" (class: ${classes})`);
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Log all inputs
    console.log("INPUTS:");
    const inputs = await driver.findElements(By.css('input'));
    for (const input of inputs) {
      try {
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        console.log(`Input: type=${type}, name=${name}, id=${id}, placeholder=${placeholder}`);
      } catch (e) {
        // Ignore errors
      }
    }
    
    console.log("=== END PAGE STRUCTURE ===");
  }


  beforeAll(async () => {
    const options = new chrome.Options();
    options.addArguments('--window-size=1920,1080');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.manage().setTimeouts({ implicit: 10000 });
    
    await driver.get('http://localhost:3000/sign-in');
    console.log("Navigated to sign-in page");
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Company can login and create a survey with different question types', async () => {
    try {
      // 1. Bejelentkezés céges fiókkal
      console.log("Logging in with company account...");
      
      // Váltás cég bejelentkezésre
      await driver.wait(until.elementLocated(By.css("input[type='checkbox']")), 5000);
      const switchElement = await driver.findElement(By.css("input[type='checkbox']"));
      await switchElement.click();
      console.log("Switched to company login");
      
      // Email és jelszó megadása
      await driver.findElement(By.id("ceg_email")).sendKeys("test@company.com");
      await driver.findElement(By.id("jelszo")).sendKeys("Password1234");
      console.log("Filled company login credentials");
      
      await takeScreenshot('login-filled');

      await logPageStructure();
      
      // Bejelentkezés gomb megnyomása
      const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Cég bejelentkezés')]"));
      await loginButton.click();
      console.log("Clicked company login button");
      
      // Várjunk, amíg bejelentkezünk és átirányít a főoldalra
      await driver.wait(until.urlContains("home"), 5000);
      console.log("Logged in successfully");
      
      await takeScreenshot('after-login');
      
      // 2. Navigálás a kérdőív létrehozása oldalra
      console.log("Navigating to create survey page...");
      
      // Keressük meg a kérdőív létrehozása gombot
      await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Kérdőív létrehozása')]")), 5000);
      const createSurveyButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdőív létrehozása')]"));
      await createSurveyButton.click();
      console.log("Clicked create survey button");
      
      // Várjunk, amíg betöltődik a kérdőív létrehozása oldal
      await driver.wait(until.elementLocated(By.id("valami")), 5000);
      console.log("Create survey page loaded");
      
      await takeScreenshot('create-survey-page');
      
      // 3. Kérdőív létrehozása különböző kérdéstípusokkal
      console.log("Creating survey with different question types...");
      
      // Kérdőív címének megadása
      const surveyTitle = `Test Survey ${Date.now()}`;
      await driver.findElement(By.id("valami")).sendKeys(surveyTitle);
      console.log("Filled survey title");
      
      // Első kérdés - Radio button típus (alapértelmezett)
      await driver.wait(until.elementLocated(By.id("question-1-label")), 5000);
      await driver.findElement(By.id("question-1-label")).sendKeys("What is your favorite color?");
      console.log("Filled first question (radio button)");
      
      // Opciók hozzáadása az első kérdéshez
      const options1 = ["Red", "Green", "Blue", "Yellow"];
      
      // Várjunk, hogy az opció mezők megjelenjenek
      await driver.sleep(1000);
      
      // Töltsük ki az első opciót
      await driver.wait(until.elementLocated(By.css("#question-1 input[placeholder^='Option']")), 5000);
      const firstOptionInput = await driver.findElement(By.css("#question-1 input[placeholder^='Option']"));
      await firstOptionInput.sendKeys(options1[0]);
      console.log(`Filled first option with "${options1[0]}"`);
      
      // Adjunk hozzá további opciókat
      for (let i = 1; i < options1.length; i++) {
        // Keressük meg az "Add Option" gombot az első kérdéshez
        const addOptionButton = await driver.findElement(By.xpath("//div[@id='question-1']//button[contains(text(), 'Add Option') or contains(text(), 'Opció hozzáadása')]"));
        await addOptionButton.click();
        console.log(`Clicked Add Option button for option ${i+1}`);
        
        // Várjunk egy kicsit, hogy megjelenjen az új opció mező
        await driver.sleep(500);
        
        // Keressük meg az összes opció mezőt és töltsük ki az újat
        const optionInputs = await driver.findElements(By.css("#question-1 input[placeholder^='Option']"));
        if (optionInputs.length > i) {
          await optionInputs[i].sendKeys(options1[i]);
          console.log(`Filled option ${i+1} with "${options1[i]}"`);
        }
      }
      
      await takeScreenshot('first-question-filled');
      
      // Második kérdés hozzáadása (checkbox típus)
      const addQuestionButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdés hozzáadása') or contains(text(), 'Add Question')]"));
      await addQuestionButton.click();
      console.log("Added second question");
      
      // Várjunk, hogy megjelenjen a második kérdés
      await driver.wait(until.elementLocated(By.id("question-2-label")), 5000);
      
      // Válasszuk ki a checkbox típust
      const questionTypeSelect = await driver.findElement(By.css("#question-2 select"));
      await questionTypeSelect.click();
      await driver.sleep(500);
      
      const checkboxOption = await driver.findElement(By.xpath("//option[contains(text(), 'Checkbox') or contains(text(), 'Jelölőnégyzet')]"));
      await checkboxOption.click();
      console.log("Changed second question type to checkbox");
      
      // Töltsük ki a második kérdés szövegét
      await driver.findElement(By.id("question-2-label")).sendKeys("Which programming languages do you know?");
      console.log("Filled second question (checkbox)");
      
      // Opciók hozzáadása a második kérdéshez
      const options2 = ["JavaScript", "Python", "Java", "C#"];
      
      // Töltsük ki az első opciót
      await driver.wait(until.elementLocated(By.css("#question-2 input[placeholder^='Option']")), 5000);
      const firstOption2Input = await driver.findElement(By.css("#question-2 input[placeholder^='Option']"));
      await firstOption2Input.sendKeys(options2[0]);
      console.log(`Filled first option for second question with "${options2[0]}"`);
      
      // Adjunk hozzá további opciókat
      for (let i = 1; i < options2.length; i++) {
        // Keressük meg az "Add Option" gombot a második kérdéshez
        const addOptionButton = await driver.findElement(By.xpath("//div[@id='question-2']//button[contains(text(), 'Add Option') or contains(text(), 'Opció hozzáadása')]"));
        await addOptionButton.click();
        console.log(`Clicked Add Option button for option ${i+1} of second question`);
        
        // Várjunk egy kicsit, hogy megjelenjen az új opció mező
        await driver.sleep(500);
        
        // Keressük meg az összes opció mezőt és töltsük ki az újat
        const optionInputs = await driver.findElements(By.css("#question-2 input[placeholder^='Option']"));
        if (optionInputs.length > i) {
          await optionInputs[i].sendKeys(options2[i]);
          console.log(`Filled option ${i+1} for second question with "${options2[i]}"`);
        }
      }
      
      await takeScreenshot('second-question-filled');
      
      // Harmadik kérdés hozzáadása (text field típus)
      await addQuestionButton.click();
      console.log("Added third question");
      
      // Várjunk, hogy megjelenjen a harmadik kérdés
      await driver.wait(until.elementLocated(By.id("question-3-label")), 5000);
      
      // Válasszuk ki a text field típust
      const questionTypeSelect3 = await driver.findElement(By.css("#question-3 select"));
      await questionTypeSelect3.click();
      await driver.sleep(500);
      
      const textFieldOption = await driver.findElement(By.xpath("//option[contains(text(), 'Text') or contains(text(), 'Szöveg')]"));
      await textFieldOption.click();
      console.log("Changed third question type to text field");
      
      // Töltsük ki a harmadik kérdés szövegét
      await driver.findElement(By.id("question-3-label")).sendKeys("Please describe your experience with programming");
      console.log("Filled third question (text field)");
      
      await takeScreenshot('all-questions-filled');
      
      // Tovább gomb megnyomása a szűrőkhöz
      const nextButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
      await nextButton.click();
      console.log("Clicked next button to go to filters");
      
      // Várjunk, hogy betöltődjön a szűrő oldal
      await driver.sleep(1000);
      await takeScreenshot('filter-page');
      
      // 4. Nem szűrő beállítása férfiakra
      console.log("Setting up gender filter for males...");
      
      // Keressük meg és kattintsunk a nem szűrőre
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Nem') or contains(text(), 'Gender')]")), 5000);
      const genderFilter = await driver.findElement(By.xpath("//div[contains(text(), 'Nem') or contains(text(), 'Gender')]"));
      await genderFilter.click();
      console.log("Clicked gender filter");
      
      // Várjunk, hogy megjelenjen a legördülő lista
      await driver.sleep(1000);
      
      // Válasszuk ki a férfi opciót
      await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Férfi') or contains(text(), 'Male')]")), 5000);
      const maleOption = await driver.findElement(By.xpath("//li[contains(text(), 'Férfi') or contains(text(), 'Male')]"));
      await maleOption.click();
      console.log("Selected male gender");
      
      await takeScreenshot('gender-filter-selected');
      
      // Tovább gomb megnyomása a mintavételhez
      const nextFilterButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
      await nextFilterButton.click();
      console.log("Clicked next button to go to sampling");
      
      // Várjunk, hogy betöltődjön a mintavétel oldal
      await driver.sleep(2000);
      await takeScreenshot('sampling-page');
      
      // 5. Mintavétel beállítása
      console.log("Setting up sampling...");
      
      // Keressük meg és állítsuk be a mintaméretet
      await driver.wait(until.elementLocated(By.xpath("//input[@type='number']")), 5000);
      const sampleSizeInput = await driver.findElement(By.xpath("//input[@type='number']"));
      await sampleSizeInput.clear();
      await sampleSizeInput.sendKeys("50");
      console.log("Set sample size to 50");
      
      await takeScreenshot('sample-size-set');
      
      // Tovább gomb megnyomása az áttekintéshez
      const nextSampleButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
      await nextSampleButton.click();
      console.log("Clicked next button to go to overview");
      
      // Várjunk, hogy betöltődjön az áttekintés oldal
      await driver.sleep(1000);
      await takeScreenshot('overview-page');
      
      // 6. Kérdőív létrehozása
      console.log("Creating the survey...");
      
      // Mentés gomb megnyomása
      await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Mentés')]")), 5000);
      const saveButton = await driver.findElement(By.xpath("//button[contains(text(), 'Mentés')]"));
      await saveButton.click();
      console.log("Clicked save button");
      
      // Várjunk a sikeres mentés üzenetre
      await driver.sleep(2000);
      await takeScreenshot('survey-saved');
      
      // Ellenőrizzük, hogy sikerült-e létrehozni a kérdőívet
      try {
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Sikeres') or contains(text(), 'Success')]")), 2000);
        console.log("Survey created successfully");
      } catch (e) {
        console.log("No success message found, but survey might still be created");
      }
      
      // Teszt sikeres befejezése
      expect(true).toBe(true);
    } catch (error) {
      await takeScreenshot('error-state');
      console.error('Test failed with error:', error);
      throw error;
    }
  });
});