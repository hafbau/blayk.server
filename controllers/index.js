const runTestSteps = require('../run_test');

module.exports = (Case, render) => {
  
  return {
    // C - REATE
    postCase: async (ctx, next) => {
      console.log('got here post')
      try {
        const { request, res } = ctx;
        const testCase = await Case.create(request.body);

        if (testCase) {
          ctx.status = 200;
          ctx.body = {
            testCase
          }
          return next()
        }
      }
      catch (err) {
        ctx.status = ctx.status || 500;
        ctx.throw(err)
      }
    },

    // R - EAD
    getAllCases: async (ctx, next) => {
      try {
        const { req, res } = ctx;
        const testCases = await Case.find();

        if (testCases && testCases.length) {
          ctx.status = 200;
          return ctx.body = {
            testCases
          }
        } else {
          return ctx.throw(403, 'No tests found')
        }
      }
      catch(err) {
        if (err.message !== 'No tests found') return ctx.throw(500)
      }

    },

    // U - pdate
    runCase: async (ctx, next) => {
      try {
        const { params: { _id }, io } = ctx;
        if (!_id) ctx.throw(400, 'No test to run');

        const caseToUpdate = await Case.findOne({ _id });
        if (caseToUpdate) {
          caseToUpdate.steps = Object.assign([], caseToUpdate.steps, await runTestSteps({ steps: caseToUpdate.steps, io }));
          await caseToUpdate.save();

          ctx.status = 200;
          return ctx.body = {
            testCase: caseToUpdate
          }
          
        }
        ctx.throw(400, 'Test case not found');

      } catch(err) {
        console.log('error in runCase controller', err)
        ctx.throw(500, err.message)
      }
    }

  }
}
