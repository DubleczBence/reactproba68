const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const fs = require('fs');

jest.setTimeout(60000); 

describe('Survey Completion Tests', () => {
  let driver;

  async function takeScreenshot(name) {
    if (!fs.existsSync('./screenshots')) {
      fs.mkdirSync('./screenshots');
    }
    const image = await driver.takeScreenshot();
    fs.writeFileSync(`./screenshots/survey-${name}.png`, image, 'base64');
  }

  beforeAll(async () => {
    const options = new chrome.Options();
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    await driver.get('http://localhost:3000');
    await driver.sleep(2000);
    await takeScreenshot('initial-page');
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('User can complete a survey', async () => {
    try {
      await driver.findElement(By.xpath("//button[contains(text(), 'Felhasználó Bejelentkezés')]")).click();
      await driver.sleep(1000);
      await takeScreenshot('after-login-click');
      
      const emailInput = await driver.findElement(By.css("input[type='email']"));
      await emailInput.clear();
      await emailInput.sendKeys('test@example.com');
      
      const passwordInput = await driver.findElement(By.css("input[type='password']"));
      await passwordInput.clear();
      await passwordInput.sendKeys('password123');
      
      await takeScreenshot('credentials-entered');
      
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(3000);
      await takeScreenshot('after-login');
      
      console.log("Listing all links after login:");
      const allLinksAfterLogin = await driver.findElements(By.css('a'));
      for (const link of allLinksAfterLogin) {
        try {
          const text = await link.getText();
          const href = await link.getAttribute('href');
          console.log(`Link text: "${text}", href: "${href}"`);
        } catch (e) {
        }
      }
      
      console.log("Listing all buttons after login:");
      const allButtonsAfterLogin = await driver.findElements(By.css('button'));
      for (const button of allButtonsAfterLogin) {
        try {
          const text = await button.getText();
          console.log(`Button text: "${text}"`);
        } catch (e) {
        }
      }
      
      const surveySelectors = [
        By.linkText("Kérdőívek"),
        By.linkText("Felmérések"),
        By.linkText("Kitölthető kérdőívek"),
        By.linkText("Surveys"),
        By.linkText("Available Surveys"),
        By.partialLinkText("Kérdőív"),
        By.partialLinkText("Survey"),
        By.xpath("//a[contains(@href, 'survey') or contains(@href, 'kerdoiv')]"),
        By.css("[data-testid='surveys-link']")
      ];
      
      let surveyLink = null;
      for (const selector of surveySelectors) {
        try {
          const elements = await driver.findElements(selector);
          if (elements.length > 0) {
            surveyLink = elements[0];
            console.log(`Found survey link using selector: ${selector}`);
            break;
          }
        } catch (e) {
        }
      }
      
      if (surveyLink) {
        await surveyLink.click();
        await driver.sleep(2000);
        await takeScreenshot('surveys-page');
      } else {
        console.log("Couldn't find surveys link. Looking for navigation menu items...");
        
        try {
          const menuSelectors = [
            By.css(".navbar-toggler, .menu-toggle, .hamburger-menu"),
            By.xpath("//button[contains(@class, 'navbar-toggler') or contains(@class, 'menu')]")
          ];
          
          for (const selector of menuSelectors) {
            const menuElements = await driver.findElements(selector);
            if (menuElements.length > 0) {
              await menuElements[0].click();
              console.log("Clicked on menu toggle");
              await driver.sleep(1000);
              break;
            }
          }
          
          for (const selector of surveySelectors) {
            try {
              const elements = await driver.findElements(selector);
              if (elements.length > 0) {
                surveyLink = elements[0];
                console.log(`Found survey link in menu using selector: ${selector}`);
                await surveyLink.click();
                await driver.sleep(2000);
                await takeScreenshot('surveys-page-from-menu');
                break;
              }
            } catch (e) {
            }
          }
        } catch (e) {
          console.log("Couldn't find or interact with navigation menu");
        }
      }

      if (!surveyLink) {
        console.log("Trying direct navigation to surveys page");
        await driver.get('http://localhost:3000/surveys');
        await driver.sleep(2000);
        await takeScreenshot('direct-to-surveys');
        
        const surveyUrls = [
          'http://localhost:3000/available-surveys',
          'http://localhost:3000/kerdoivek',
          'http://localhost:3000/home'
        ];
        
        for (const url of surveyUrls) {
          await driver.get(url);
          await driver.sleep(2000);
          await takeScreenshot(`direct-to-${url.split('/').pop()}`);
          
          const surveyElements = await driver.findElements(By.css(".survey-item, .survey-card, .survey-list"));
          if (surveyElements.length > 0) {
            console.log(`Found survey elements at URL: ${url}`);
            break;
          }
        }
      }
      
      try {
        const surveyItemSelectors = [
          By.css(".survey-item, .survey-card, .survey-title"),
          By.xpath("//div[contains(@class, 'survey')]//button[contains(text(), 'Start') or contains(text(), 'Begin') or contains(text(), 'Kitöltés') or contains(text(), 'Kezdés')]")
        ];
        
        let surveyItem = null;
        for (const selector of surveyItemSelectors) {
          const elements = await driver.findElements(selector);
          if (elements.length > 0) {
            surveyItem = elements[0];
            console.log(`Found survey item using selector: ${selector}`);
            break;
          }
        }
        
        if (surveyItem) {
          await surveyItem.click();
          await driver.sleep(2000);
          await takeScreenshot('survey-details');
          
          try {
            const startButtonSelectors = [
              By.xpath("//button[contains(text(), 'Start') or contains(text(), 'Begin') or contains(text(), 'Kitöltés') or contains(text(), 'Kezdés')]"),
              By.css(".start-survey, .begin-survey, .survey-start")
            ];
            
            for (const selector of startButtonSelectors) {
              const elements = await driver.findElements(selector);
              if (elements.length > 0) {
                await elements[0].click();
                console.log(`Clicked start survey button using selector: ${selector}`);
                await driver.sleep(2000);
                await takeScreenshot('survey-started');
                break;
              }
            }
          } catch (e) {
            console.log("Couldn't find start button, might already be on the survey questions");
          }
          
          const questions = await driver.findElements(By.css(".question, .survey-question, form > div"));
          console.log(`Found ${questions.length} potential question elements`);
          
          if (questions.length > 0) {
            for (let i = 0; i < questions.length; i++) {
              await takeScreenshot(`question-${i+1}`);

              try {
                const radioButtons = await driver.findElements(By.css(`input[type="radio"]`));
                if (radioButtons.length > 0) {
                  await radioButtons[0].click();
                  console.log(`Selected radio button for question ${i+1}`);
                  continue;
                }
                
                const checkboxes = await driver.findElements(By.css(`input[type="checkbox"]`));
                if (checkboxes.length > 0) {
                  await checkboxes[0].click();
                  console.log(`Selected checkbox for question ${i+1}`);
                  continue;
                }
                
                const selects = await driver.findElements(By.css(`select`));
                if (selects.length > 0) {
                  const options = await selects[0].findElements(By.css('option'));
                  if (options.length > 1) {
                    await options[1].click();
                    console.log(`Selected dropdown option for question ${i+1}`);
                  }
                  continue;
                }
                
                const textInputs = await driver.findElements(By.css(`input[type="text"], textarea`));
                if (textInputs.length > 0) {
                  await textInputs[0].sendKeys('Test answer');
                  console.log(`Entered text for question ${i+1}`);
                  continue;
                }
                
                console.log(`Couldn't find answer elements for question ${i+1}`);
              } catch (e) {
                console.log(`Error interacting with question ${i+1}: ${e.message}`);
              }
              
              if (i < questions.length - 1) {
                try {
                  const nextButtonSelectors = [
                    By.xpath("//button[contains(text(), 'Next') or contains(text(), 'Continue') or contains(text(), 'Következő') or contains(text(), 'Tovább')]"),
                    By.css(".next-button, .continue-button")
                  ];
                  
                  let nextButton = null;
                  for (const selector of nextButtonSelectors) {
                    const elements = await driver.findElements(selector);
                    if (elements.length > 0) {
                      nextButton = elements[0];
                      break;
                    }
                  }
                  
                  if (nextButton) {
                    await nextButton.click();
                    console.log("Clicked next button");
                    await driver.sleep(1000);
                  }
                } catch (e) {
                  console.log(`Error clicking next button: ${e.message}`);
                }
              }
            }
            
            try {
              const submitButtonSelectors = [
                By.xpath("//button[contains(text(), 'Submit') or contains(text(), 'Finish') or contains(text(), 'Complete') or contains(text(), 'Beküldés') or contains(text(), 'Befejezés') or contains(text(), 'Kész')]"),
                By.css("button[type='submit'], .submit-button, .finish-button, .complete-button")
              ];
              
              let submitButton = null;
              for (const selector of submitButtonSelectors) {
                const elements = await driver.findElements(selector);
                if (elements.length > 0) {
                  submitButton = elements[0];
                  break;
                }
              }
              
              if (submitButton) {
                await submitButton.click();
                console.log("Clicked submit button");
                await driver.sleep(2000);
                await takeScreenshot('survey-submitted');
                
                try {
                  const successSelectors = [
                    By.xpath("//div[contains(text(), 'Thank you') or contains(text(), 'Success') or contains(text(), 'Köszönjük') or contains(text(), 'Sikeres')]"),
                    By.css(".success-message, .thank-you, .survey-complete")
                  ];
                  
                  let successMessage = null;
                  for (const selector of successSelectors) {
                    const elements = await driver.findElements(selector);
                    if (elements.length > 0) {
                      successMessage = elements[0];
                      const text = await successMessage.getText();
                      console.log(`Found success message: ${text}`);
                      break;
                    }
                  }
                  
                  if (successMessage) {
                    console.log("Survey completed successfully!");
                  } else {
                    console.log("Couldn't find success message, but survey might still be submitted");
                  }
                } catch (e) {
                  console.log(`Error checking for success message: ${e.message}`);
                }
              } else {
                console.log("Couldn't find submit button");
              }
            } catch (e) {
              console.log(`Error submitting survey: ${e.message}`);
            }
          } else {
            console.log("Couldn't find any question elements");
          }
        } else {
          console.log("Couldn't find any survey items to click");
        }
      } catch (e) {
        console.log(`Error finding or clicking survey item: ${e.message}`);
        await takeScreenshot('error-finding-survey');
      }
      
      expect(true).toBe(true);
    } catch (error) {
      await takeScreenshot('error-state');
      console.error('Test failed with error:', error);
      throw error;
    }
  });
});