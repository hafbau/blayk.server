const selenium = require("selenium-webdriver");
const By = selenium.By;
const until = selenium.until;

const TIMEOUT = 15000;
const lower = (string) => `translate(${string}, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')`
const upper = (string) => `translate(${string}, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')`
    
module.exports = function locate({ target: { type, value }, driver }) {
    try {
        value = value.toLowerCase();
        switch (type) {
            case 'css':
                return driver.wait(until.elementLocated(By.css(value)), TIMEOUT)
            
            default:
                const XPATH = `//*[contains(${lower('text()')}, '${value}') or ${lower('@placeholder')}='${value}' or ${lower('@name')
        }='${value}' or ${lower('@id')}='${value}']`
                return driver.wait(until.elementLocated(By.xpath(XPATH)), TIMEOUT)

        }
    } catch (err) {
        throw new Error(`Could not locate ${value}`)
    }
}
