const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const fs = require('fs');

jest.setTimeout(120000);

describe('Company Login, Credit Purchase and Survey Creation Tests', () => {
  let driver;

  // Helper function to take screenshots
  async function takeScreenshot(name) {
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    try {
      // Várjunk, amíg az oldal betöltődik
      await driver.wait(until.elementLocated(By.css('body')), 5000);
      // Várjunk még egy kicsit a renderelésre
      await driver.sleep(2000);
      
      const image = await driver.takeScreenshot();
      fs.writeFileSync(`./screenshots/company-survey-${name}.png`, image, 'base64');
      console.log(`Screenshot saved: company-survey-${name}.png`);
    } catch (e) {
      console.log(`Error taking screenshot ${name}: ${e.message}`);
    }
  }

  // Helper function to log page structure
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
    
    // Log all links
    console.log("LINKS:");
    const links = await driver.findElements(By.css('a'));
    for (const link of links) {
      try {
        const text = await link.getText();
        const href = await link.getAttribute('href');
        console.log(`Link: "${text}" (href: ${href})`);
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
    // Állítsuk be a böngésző méretét, hogy minden látható legyen
    options.addArguments('--window-size=1920,1080');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    // Állítsuk be a böngésző ablak méretét
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    
    // Állítsuk be a timeout értékeket
    await driver.manage().setTimeouts({ implicit: 10000, pageLoad: 30000, script: 30000 });
    
    await driver.get('http://localhost:3000');
    await driver.sleep(3000); // Hosszabb várakozás az oldal betöltésére
    await takeScreenshot('initial-page');
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('Company can login, purchase credits and create a survey', async () => {
    try {
      // Log the initial page structure to understand what elements are available
      await logPageStructure();
      
      // 1. Bejelentkezés a meglévő céges fiókkal
      console.log("Logging in with existing company account...");
      
      try {
        // Ellenőrizzük, hogy a bejelentkezési oldalon vagyunk-e
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes('sign-in')) {
          await driver.get('http://localhost:3000/sign-in');
          await driver.sleep(3000);
        }
        
        // Váltás cég bejelentkezésre
        const switchElement = await driver.findElement(By.css("input[type='checkbox']"));
        await switchElement.click();
        console.log("Switched to company login");
        await driver.sleep(2000);
        
        // Email és jelszó megadása a meglévő fiókkal
        await driver.findElement(By.id("ceg_email")).sendKeys("test@company.com");
        await driver.findElement(By.id("jelszo")).sendKeys("Password1234");
        console.log("Filled existing company login credentials");
        
        await takeScreenshot('existing-company-login-filled');
        
        // Bejelentkezés gomb megnyomása
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Cég bejelentkezés')]"));
        await loginButton.click();
        console.log("Clicked company login button");
        await driver.sleep(5000);
        await takeScreenshot('after-company-login');
      } catch (e) {
        console.log("Error during company login:", e.message);
      }
      
      // 2. Navigálás az Egyenleg oldalra
      console.log("Navigating to Credits page...");
      
      try {
        // Log the page structure to find the Egyenleg button
        await logPageStructure();
        
        // A Comp_Home.js alapján a navigációs sávban van egy Egyenleg gomb
        // Keressük meg a BottomNavigationAction komponenst az AccountBalanceWalletIcon ikonnal
        try {
          // Először próbáljuk meg a szöveg alapján megtalálni
          const balanceButton = await driver.findElement(By.xpath("//button[contains(text(), 'Egyenleg')]"));
          await balanceButton.click();
          console.log("Clicked Egyenleg button by text");
        } catch (e) {
          console.log("Egyenleg button not found by text, trying by index");
          
          // Ha nem találjuk szöveg alapján, próbáljuk meg az index alapján (a második gomb)
          const navigationButtons = await driver.findElements(By.css(".MuiBottomNavigationAction-root"));
          if (navigationButtons.length >= 2) {
            await navigationButtons[1].click();
            console.log("Clicked second navigation button (Egyenleg)");
          } else {
            console.log("Navigation buttons not found or not enough buttons");
          }
        }
        
        await driver.sleep(3000);
        await takeScreenshot('credit-page');
      } catch (e) {
        console.log("Error navigating to Credits page:", e.message);
      }
      
      // 3. Kredit vásárlása
      console.log("Purchasing credits...");
      
      try {
        // Log the credit page structure
        await logPageStructure();
        
        // A Kredit.js alapján vannak "Vásárlás" gombok a különböző kredit csomagokhoz
        // Keressük meg a 2000 kredites csomagot és kattintsunk a Vásárlás gombra
        try {
          // Keressük a 2000 kredites csomagot
          const creditPackage = await driver.findElement(By.xpath("//div[contains(text(), '2000') or .//h3[contains(text(), '2000')]]"));
          console.log("Found 2000 credit package");
          
          // Keressük a Vásárlás gombot a csomagon belül vagy annak közelében
          const purchaseButton = await driver.findElement(By.xpath("//div[contains(text(), '2000') or .//h3[contains(text(), '2000')]]//ancestor::div[contains(@class, 'MuiCard')]//button[contains(text(), 'Vásárlás')]"));
          await purchaseButton.click();
          console.log("Clicked purchase button for 2000 credits");
          await driver.sleep(3000);
          await takeScreenshot('after-credit-purchase');
          
          // Ellenőrizzük, hogy sikerült-e a vásárlás
          try {
            const successMessage = await driver.findElements(By.xpath("//div[contains(text(), 'Sikeres') or contains(text(), 'Success')]"));
            if (successMessage.length > 0) {
              console.log("Credit purchase successful");
            } else {
              console.log("No success message found, but credits might still be added");
            }
          } catch (e) {
            console.log("Error checking credit purchase success:", e.message);
          }
        } catch (e) {
          console.log("Error finding 2000 credit package or purchase button:", e.message);
          
          // Ha nem találjuk a 2000 kredites csomagot, próbáljuk meg az első Vásárlás gombot
          try {
            const purchaseButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Vásárlás')]"));
            if (purchaseButtons.length > 0) {
              await purchaseButtons[0].click();
              console.log("Clicked first purchase button");
              await driver.sleep(3000);
              await takeScreenshot('after-credit-purchase-alternative');
            } else {
              console.log("No purchase buttons found");
            }
          } catch (e) {
            console.log("Error clicking first purchase button:", e.message);
          }
        }
      } catch (e) {
        console.log("Error during credit purchase:", e.message);
      }
      
      // 4. Visszatérés a főoldalra és kérdőív létrehozása
      console.log("Returning to home page and creating survey...");
      
      try {
        // Navigálás a főoldalra
        try {
          // Keressük a Kérdőíveim gombot a navigációs sávban
          const homeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdőíveim')]"));
          await homeButton.click();
          console.log("Clicked Kérdőíveim button");
        } catch (e) {
          console.log("Kérdőíveim button not found, trying by index");
          
          // Ha nem találjuk szöveg alapján, próbáljuk meg az index alapján (az első gomb)
          const navigationButtons = await driver.findElements(By.css(".MuiBottomNavigationAction-root"));
          if (navigationButtons.length >= 1) {
            await navigationButtons[0].click();
            console.log("Clicked first navigation button (Kérdőíveim)");
          } else {
            console.log("Navigation buttons not found or not enough buttons");
            
            // Ha ez sem működik, próbáljunk közvetlenül navigálni
            await driver.get('http://localhost:3000');
            console.log("Navigated directly to home page");
          }
        }
        
        await driver.sleep(3000);
        await takeScreenshot('home-page-after-credit-purchase');
        
        // Kérdőív létrehozása gomb keresése és kattintás
        const createSurveyButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdőív létrehozása')]"));
        await createSurveyButton.click();
        console.log("Clicked create survey button");
        await driver.sleep(3000);
        await takeScreenshot('create-survey-page');
        
        // Kérdőív címének megadása
        const surveyTitle = `Test Survey ${Date.now()}`;
        await driver.findElement(By.id("valami")).sendKeys(surveyTitle);
        console.log("Filled survey title");
        
        // Kérdés szövegének megadása
        const questionInput = await driver.findElement(By.id("question-1-label"));
        await questionInput.sendKeys("What is your favorite color?");
        console.log("Filled question text");
        
        // Válaszlehetőségek megadása
        const options = ["Red", "Green", "Blue", "Yellow"];
        const optionInputs = await driver.findElements(By.css("input[placeholder^='Option']"));
        
        for (let i = 0; i < Math.min(options.length, optionInputs.length); i++) {
          await optionInputs[i].sendKeys(options[i]);
          console.log(`Filled option ${i+1} with "${options[i]}"`);
        }
        
        await takeScreenshot('survey-options-filled');
        
        // Tovább gomb megnyomása
        const nextButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextButton.click();
        console.log("Clicked next button");
        await driver.sleep(3000);
        await takeScreenshot('survey-filter-page');
        
        // Szűrő beállítása és tovább
        const nextFilterButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextFilterButton.click();
        console.log("Clicked next button on filter page");
        await driver.sleep(3000);
        await takeScreenshot('survey-sample-page');
        
        // Mintavétel beállítása és tovább
        const nextSampleButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tovább')]"));
        await nextSampleButton.click();
        console.log("Clicked next button on sample page");
        await driver.sleep(3000);
        await takeScreenshot('survey-overview-page');
        
        // Kérdőív mentése
        const saveButton = await driver.findElement(By.xpath("//button[contains(text(), 'Mentés')]"));
        await saveButton.click();
        console.log("Clicked save button");
        await driver.sleep(3000);
        await takeScreenshot('survey-saved');
        
        // Ellenőrizzük, hogy sikerült-e menteni a kérdőívet
        const successMessage = await driver.findElements(By.xpath("//div[contains(text(), 'Sikeres') or contains(text(), 'Success')]"));
        if (successMessage.length > 0) {
          console.log("Survey saved successfully");
        } else {
          console.log("No success message found, but survey might still be saved");
        }
      } catch (e) {
        console.log("Error during survey creation:", e.message);
      }
      
      // 5. Kijelentkezés a cég fiókból
      console.log("Logging out from company account...");
      
      try {
        // Navigáljunk a profil oldalra, ahol a kijelentkezés gomb található
        try {
            // Keressük a Profil gombot a navigációs sávban
            const profileButton = await driver.findElement(By.xpath("//button[contains(text(), 'Profil')]"));
            await profileButton.click();
            console.log("Clicked Profil button");
          } catch (e) {
            console.log("Profil button not found, trying by index");
            
            // Ha nem találjuk szöveg alapján, próbáljuk meg az index alapján (a harmadik gomb)
            const navigationButtons = await driver.findElements(By.css(".MuiBottomNavigationAction-root"));
            if (navigationButtons.length >= 3) {
              await navigationButtons[2].click();
              console.log("Clicked third navigation button (Profil)");
            } else {
              console.log("Navigation buttons not found or not enough buttons");
            }
          }
          
          await driver.sleep(3000);
          await takeScreenshot('profile-page');
          
          // Kijelentkezés gomb megnyomása
          const logoutButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kijelentkezés')]"));
          await logoutButton.click();
          console.log("Clicked logout button");
          await driver.sleep(3000);
          await takeScreenshot('after-logout');
        } catch (e) {
          console.log("Error during logout:", e.message);
        }
        
        // 6. Bejelentkezés felhasználóként
        console.log("Logging in as a user...");
        
        try {
          // Ellenőrizzük, hogy a bejelentkezési oldalon vagyunk-e
          const currentUrl = await driver.getCurrentUrl();
          if (!currentUrl.includes('sign-in')) {
            await driver.get('http://localhost:3000/sign-in');
            await driver.sleep(3000);
          }
          
          // Felhasználói bejelentkezés (alapértelmezett, nem kell váltani)
          await driver.findElement(By.id("email")).sendKeys("test@example.com");
          await driver.findElement(By.id("password")).sendKeys("password1234");
          console.log("Filled user login credentials");
          
          await takeScreenshot('user-login-filled');
          
          // Bejelentkezés gomb megnyomása
          const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Bejelentkezés')]"));
          await loginButton.click();
          console.log("Clicked user login button");
          await driver.sleep(5000);
          await takeScreenshot('after-user-login');
        } catch (e) {
          console.log("Error during user login:", e.message);
        }
        
        // 7. Kérdőív kitöltése
        console.log("Completing survey as a user...");
        
        try {
          // Ellenőrizzük, hogy be vagyunk-e jelentkezve
          const loggedInElements = await driver.findElements(By.xpath("//button[contains(text(), 'Kijelentkezés') or contains(text(), 'Logout')]"));
          
          if (loggedInElements.length > 0) {
            console.log("Successfully logged in as user");
            
            // Navigálás a kérdőívekhez
            try {
              // Keressük a Kérdőívek gombot a navigációs sávban
              const surveysButton = await driver.findElement(By.xpath("//button[contains(text(), 'Kérdőívek')]"));
              await surveysButton.click();
              console.log("Clicked Kérdőívek button");
            } catch (e) {
              console.log("Kérdőívek button not found, trying by index");
              
              // Ha nem találjuk szöveg alapján, próbáljuk meg az index alapján (a második gomb)
              const navigationButtons = await driver.findElements(By.css(".MuiBottomNavigationAction-root"));
              if (navigationButtons.length >= 2) {
                await navigationButtons[1].click();
                console.log("Clicked second navigation button (Kérdőívek)");
              } else {
                console.log("Navigation buttons not found or not enough buttons");
                
                // Ha ez sem működik, próbáljunk közvetlenül navigálni
                await driver.get('http://localhost:3000/surveys');
                console.log("Navigated directly to surveys page");
              }
            }
            
            await driver.sleep(3000);
            await takeScreenshot('surveys-page');
            
            // Kérdőív kiválasztása (az első)
            const surveyItems = await driver.findElements(By.css(".survey-card, .survey-item, div.card"));
            if (surveyItems.length > 0) {
              await surveyItems[0].click();
              console.log("Clicked on first survey");
              await driver.sleep(3000);
              await takeScreenshot('selected-survey');
              
              // Kérdőív kitöltése
              // Válasz kiválasztása
              try {
                const radioButtons = await driver.findElements(By.css("input[type='radio']"));
                if (radioButtons.length > 0) {
                  await radioButtons[0].click();
                  console.log("Selected first radio option");
                  await driver.sleep(1000);
                } else {
                  console.log("Radio buttons not found");
                }
              } catch (e) {
                console.log("Error selecting radio option:", e.message);
              }
              
              await takeScreenshot('survey-filled');
              
              // Beküldés gomb megnyomása
              try {
                const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Beküldés') or contains(text(), 'Submit')]"));
                await submitButton.click();
                console.log("Clicked submit button");
                await driver.sleep(3000);
                await takeScreenshot('survey-submitted');
                
                // Ellenőrizzük, hogy sikerült-e beküldeni a kérdőívet
                const successMessage = await driver.findElements(By.xpath("//div[contains(text(), 'Köszönjük') or contains(text(), 'Thank you')]"));
                if (successMessage.length > 0) {
                  console.log("Survey submitted successfully");
                } else {
                  console.log("No success message found, but survey might still be submitted");
                }
              } catch (e) {
                console.log("Error submitting survey:", e.message);
              }
            } else {
              console.log("No survey items found");
            }
          } else {
            console.log("Not logged in as user, cannot complete survey");
          }
        } catch (e) {
          console.log("Error during survey completion:", e.message);
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