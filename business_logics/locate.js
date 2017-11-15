const selenium = require("selenium-webdriver");
const By = selenium.By;
const until = selenium.until;

const TIMEOUT = 15000;
const lower = (string) => `translate(${string}, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')`
const upper = (string) => `translate(${string}, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')`
    
module.exports = function locate({ target: { type, value }, driver }) {
    try {
        value = value.toLowerCase() || 'body';
        switch (type) {
            case 'id':
                return driver.wait(until.elementLocated(By.id(value)), TIMEOUT);

            case 'xpath':
                return driver.wait(until.elementLocated(By.xpath(value)), TIMEOUT);

            case 'linkText':
                return driver.wait(until.elementLocated(By.linkText(value)), TIMEOUT);

            case 'css':
                return driver.wait(until.elementLocated(By.css(value)), TIMEOUT)
            
            default:
                const XPATH = `//*[contains(${lower('@class')}, '${value}') or contains(${lower('text()')}, '${value}') or ${lower('@placeholder')}='${value}' or ${lower('@name')
                    }='${value}' or ${lower('@id')}='${value}' or contains(${lower('name()')}, '${value}')]`
                return driver.wait(until.elementLocated(By.xpath(XPATH)), TIMEOUT)

        }
    } catch (err) {
        console.log('about to throw', err)
        throw new Error(`Could not locate ${value}`)
    }
}
