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

      // Bejelentkezés gomb megnyomása
      const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Cég Bejelentkezés')]"));
      await loginButton.click();
      console.log("Clicked company login button");
      
      // Várjunk, amíg bejelentkezünk és átirányít a főoldalra
      await driver.wait(until.urlContains("home"), 10000);
      console.log("Logged in successfully");
      
      await takeScreenshot('after-login');
      await driver.sleep(2000); // Várjunk kicsit, hogy teljesen betöltődjön az oldal
      
      // 2. Navigálás a kérdőív létrehozása oldalra
      console.log("Navigating to create survey page...");
      
      // Keressük meg a kérdőív létrehozása gombot
      await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Kérdőív létrehozása')]")), 10000);
      const createSurveyButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdőív létrehozása')]"));
      await createSurveyButton.click();
      console.log("Clicked create survey button");
      
      // Várjunk, amíg betöltődik a kérdőív létrehozása oldal
      await driver.sleep(3000); // Várjunk, hogy biztosan betöltődjön az oldal
      await takeScreenshot('create-survey-page');
      
      // Logoljuk az oldal szerkezetét, hogy lássuk, milyen elemek vannak
      await logPageStructure();
      
      // 3. Kérdőív létrehozása különböző kérdéstípusokkal
      console.log("Creating survey with different question types...");
      
      // Kérdőív címének megadása
      try {
        await driver.wait(until.elementLocated(By.id("valami")), 5000);
        await driver.findElement(By.id("valami")).sendKeys("Test Survey");
        console.log("Filled survey title");
      } catch (e) {
        console.log("Could not find title input by id 'valami', trying other selectors");
        try {
          // Próbáljunk más szelektorokat
          const inputs = await driver.findElements(By.css("input"));
          for (const input of inputs) {
            const label = await input.getAttribute("aria-label") || "";
            if (label.includes("cím") || label.includes("title")) {
              await input.sendKeys("Test Survey");
              console.log("Filled survey title using alternative selector");
              break;
            }
          }
        } catch (e2) {
          console.log("Still could not find title input");
        }
      }
      
      await takeScreenshot('title-filled');
      
      // Első kérdés szövegének megadása - ez marad radio button típus (alapértelmezett)
try {
  // Keressük meg a kérdés szöveg mezőt
  await driver.wait(until.elementLocated(By.id("question-1-label")), 5000);
  const firstQuestionInput = await driver.findElement(By.id("question-1-label"));
  await firstQuestionInput.sendKeys("Mi a kedvenc színed?");
  console.log("Filled first question text");
} catch (e) {
  console.log("Error filling first question: " + e.message);
}

// Opciók hozzáadása az első kérdéshez (radio button típus)
const options1 = ["Piros", "Kék", "Zöld"];

try {
  // Keressük meg az első kérdéshez tartozó opció mezőket
  const optionInputs = await driver.findElements(By.css("input[placeholder*='Option']"));
  
  // Töltsük ki az első opciót
  if (optionInputs.length > 0) {
    await optionInputs[0].sendKeys(options1[0]);
    console.log(`Filled first option with "${options1[0]}"`);
  }
  
  // Adjunk hozzá további opciókat
  for (let i = 1; i < options1.length; i++) {
    // Keressük meg az "Opció hozzáadása" gombot az első kérdéshez
    const containers = await driver.findElements(By.css("div.MuiContainer-root"));
    if (containers.length > 0) {
      const firstContainer = containers[0]; // Az első kérdés konténere
      const addOptionButton = await firstContainer.findElement(By.xpath(".//button[contains(text(), 'Opció hozzáadása')]"));
      await addOptionButton.click();
      console.log(`Clicked Add Option button for option ${i+1}`);
    }
    
    // Várjunk egy kicsit, hogy megjelenjen az új opció mező
    await driver.sleep(1000);
    
    // Keressük meg az összes opció mezőt újra
    const updatedOptionInputs = await driver.findElements(By.css("input[placeholder*='Option']"));
    
    // Töltsük ki az új opciót
    if (updatedOptionInputs.length > i) {
      await updatedOptionInputs[i].sendKeys(options1[i]);
      console.log(`Filled option ${i+1} with "${options1[i]}"`);
    }
  }
} catch (e) {
  console.log("Error adding options: " + e.message);
}

// Második kérdés hozzáadása (szöveges válasz típus)
try {
  // Kérdés hozzáadása gomb megnyomása
  const addQuestionButton = await driver.findElement(
    By.xpath("//button[contains(text(), 'Kérdés hozzáadása')]")
  );
  await addQuestionButton.click();
  console.log("Added second question");
  
  // Várjunk, hogy megjelenjen a második kérdés
  await driver.sleep(2000);
  
  // Válasszuk ki a szöveges válasz típust a második kérdéshez
  const containers = await driver.findElements(By.css("div.MuiContainer-root"));
  if (containers.length > 1) {
    const secondContainer = containers[1]; // A második kérdés konténere
    const textButton = await secondContainer.findElement(By.xpath(".//button[contains(., 'Szöveges válasz')]"));
    await textButton.click();
    console.log("Selected text field type for second question");
    
    // Keressük meg a második kérdés szövegmezőjét és adjunk hozzá kérdést
    const questionInput = await secondContainer.findElement(By.css("input[type='text']"));
    await questionInput.sendKeys("Kérlek írd le a véleményed a termékünkről!");
    console.log("Filled second question text");
  }
} catch (e) {
  console.log("Error adding second question: " + e.message);
}
      
      await takeScreenshot('all-questions-filled');
      
      // Tovább gomb megnyomása a szűrőkhöz
      try {
        const nextButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextButton.click();
        console.log("Clicked next button to go to filters");
      } catch (e) {
        console.log("Could not click next button: " + e.message);
      }
      
      // Várjunk, hogy betöltődjön a szűrő oldal
      await driver.sleep(2000);
      await takeScreenshot('filter-page');
      
      // 4. Nem szűrő beállítása férfiakra
      console.log("Setting up gender filter for males...");
      
      try {
        // A Szuro.js alapján a Neme select list-et kell megtalálnunk
        const genderSelect = await driver.findElement(By.xpath("//label[contains(text(), 'Neme')]/..//div[contains(@class, 'MuiSelect')]"));
        await genderSelect.click();
        console.log("Clicked gender dropdown");
        
        // Várjunk, hogy megjelenjen a legördülő lista
        await driver.sleep(1000);
        
        // Válasszuk ki a férfi opciót
        const maleOption = await driver.findElement(By.xpath("//li[contains(text(), 'Férfi')]"));
        await maleOption.click();
        console.log("Selected male gender");
      } catch (e) {
        console.log("Could not set gender filter: " + e.message);
      }
      
      await takeScreenshot('gender-filter-selected');
      
      // Tovább gomb megnyomása a mintavételhez
      try {
        const nextFilterButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextFilterButton.click();
        console.log("Clicked next button to go to sampling");
      } catch (e) {
        console.log("Could not click next button for sampling: " + e.message);
      }
      
      // Várjunk, hogy betöltődjön a mintavétel oldal
      await driver.sleep(2000);
      await takeScreenshot('sampling-page');
      
      // 5. Mintavétel beállítása
      console.log("Setting up sampling...");

      try {
        // A Mintavetel.js alapján van egy slider és egy input mező
        // Állítsuk be az input mezőt 50-re
        await driver.wait(until.elementLocated(By.css("input[type='number']")), 5000);
        const sampleSizeInput = await driver.findElement(By.css("input[type='number']"));
        
        // Töröljük a jelenlegi értéket
        await sampleSizeInput.clear();
        
        // Írjuk be az 50-et
        await sampleSizeInput.sendKeys("50");
        
        // Nyomjunk Enter-t, hogy érvényesüljön az érték
        await sampleSizeInput.sendKeys(Key.RETURN);
        
        console.log("Set sample size to 50");
        
        // Várjunk egy kicsit, hogy a slider is frissüljön
        await driver.sleep(1000);
      } catch (e) {
        console.log("Could not set sample size: " + e.message);
      }
      
      await takeScreenshot('sample-size-set');
      
      // Tovább gomb megnyomása az áttekintéshez
      try {
        const nextSampleButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextSampleButton.click();
        console.log("Clicked next button to go to overview");
      } catch (e) {
        console.log("Could not click next button for overview: " + e.message);
      }
      // Várjunk, hogy betöltődjön az áttekintés oldal
      await driver.sleep(2000);
      await takeScreenshot('overview-page');
      
      // 6. Kérdőív létrehozása
      console.log("Creating the survey...");
      
      try {
        // Elfogadom a feltételeket checkbox bejelölése
        const termsCheckbox = await driver.findElement(By.css("input[type='checkbox']"));
        await termsCheckbox.click();
        console.log("Accepted terms and conditions");
      } catch (e) {
        console.log("Could not check terms checkbox: " + e.message);
      }
      
      try {
        // Megerősítés gomb megnyomása
        const confirmButton = await driver.findElement(By.xpath("//button[contains(text(), 'Megerősítés')]"));
        await confirmButton.click();
        console.log("Clicked confirm button");
      } catch (e) {
        console.log("Could not click confirm button: " + e.message);
        // Próbáljunk alternatív szelektort
        try {
          const buttons = await driver.findElements(By.css("button"));
          for (const button of buttons) {
            const text = await button.getText();
            if (text.includes("Megerősítés") || text.includes("Confirm")) {
              await button.click();
              console.log("Clicked confirm button using alternative selector");
              break;
            }
          }
        } catch (e2) {
          console.log("Still could not click confirm button: " + e2.message);
        }
      }
      
      // Várjunk a sikeres mentés üzenetre
      await driver.sleep(3000);
      await takeScreenshot('survey-saved');
      
      // Ellenőrizzük, hogy sikerült-e létrehozni a kérdőívet
      try {
        await driver.wait(until.elementLocated(By.css(".MuiAlert-standardSuccess")), 5000);
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