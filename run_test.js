const { convertToDataUrl } = require('./utils');
const { browsersConfig: { chrome, phantomJS }, selenium } = require('./config');
const By = selenium.By;
const until = selenium.until;
const { writeTest } = require("./business_logics")();


async function runTestCase({ steps, io }) {
  const driver = new selenium.Builder().
         withCapabilities(phantomJS).
         build();
  let results = [];
  const output = await steps.reduce(async (resolved, step, index) => {
    return await resolved.then(async () => {
      const result = await writeTest({ driver, step });

      // status of this run of the test case.
      // TODO: revise this logic for failed step but not terminated case run
      // const status = result.pass ? index < steps.length - 1 ? "pending" : "done" : "failed"
      // emits single step result
      // io.emit(`${ctx.user.id}`, { type: 'STEP_RESULT', payload: { result, status } })

      results.push(result);
      return result;
    })

  }, Promise.resolve())

  .then(async (_) => {
    console.log("All done!")
    return await driver.quit();
  })
  
  .catch(async (err) => {
    console.log("failure!", err)
    return await driver.quit();
  });
  
  console.log("finished finally", results.length, "quitted driver");
  return results;
}

module.exports = runTestCase;

// dev sample run
// const { steps } = require('./db/seed_data');
// runTestCase({ steps })
