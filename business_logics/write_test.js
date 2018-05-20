const fs = require('fs');
const media = require('media');
const { convertToDataUrl } = require('../utils');

const selenium = require("selenium-webdriver");
// const By = selenium.By;
const until = selenium.until;
const TIMEOUT = 5000;

const locate = require('./locate');

media.init({ apiUrl: 'http://localhost:4002' });

module.exports = async ({ driver, step }) => {
  const { caseId, id, options, order, type, target } = step;
  console.log(`carrying out step ${order}`)
  const result = Object.assign({}, JSON.parse(JSON.stringify(step)));
  result.pass = true;
  result.meta = {};
  try {
    switch (type) {
      // Operations
      case 'click':
        await locate({ target, driver }).click();
        break;

      case 'get':
        await driver.get(validateUrl(options.value));
        break;
        
      case 'sendKeys':
        await locate({ target, driver }).sendKeys(escapeValue(options.value));
        break;
        
      // Assertions
      case 'textContains':
        await driver.wait(
          until.elementTextContains(
            locate({ target, driver }), escapeValue(options.value)
          ),
          TIMEOUT
        );
        break;

        case 'textNotContains':
          await driver.wait(
            until.elementTextContains(
              locate({ target, driver }), escapeValue(options.value)
            ),
            TIMEOUT
          )
          .then(el => {
            result.pass = false;
            return result.meta.message = `Expectation of not >${options.value}< is false`;
          })
          .catch(err => {
            if (err.name === "TimeoutError") return result.meta.message = `Expectation of not >${options.value}< is true`;
            // some other error is a failure
            result.pass = false;
            result.meta.error = err;
            return result.meta.message = err.message;
          });
          break;

      // Default should throw
      default:
        throw new Error(`Do not know how to perform ${type}`)
    }

    const file = await driver.takeScreenshot();
    const tempFile = await saveScreenshot({ file });
    result.screenshot = await media.upload(fs.createReadStream(tempFile));
  
    result.meta.imageDataUrl = convertToDataUrl({ data: file })
    return result;
  }
  catch(err) {
    result.pass = false;
    result.meta.error = err;
    result.meta.message = err.message
    
    console.log("got error in writeTest =>", err)
    return result
  }
}

function escapeValue(value) {
  // TODO
  return value
}

function saveScreenshot({ file, saveAs = `/tmp/screenShot.png` }) {
  console.log(`saving screenshot as ${saveAs}`)
  return new Promise((resolve, reject) => {

    fs.writeFile(saveAs, file, 'base64', (err) => {
      if (err) reject(err);
      console.log(`saved successfully`);
      resolve(saveAs)
    })
  })
}

function validateUrl(url) {
  // TODO
  return url;
}
