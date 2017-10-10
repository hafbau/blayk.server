const runTestSteps = require('../run_test');

module.exports = (Case, render) => {
  
  return {
    // C - REATE
    postCase: async (ctx, next) => {
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
        ctx.assert(testCases && testCases.length, 400, 'No tests found');
        
        ctx.status = 200;
        return ctx.body = {
          testCases
        }
          
      }
      catch(err) {
        if (err.message !== 'No tests found') return ctx.throw(500)
      }
      
    },
    getCase: async (ctx, next) => {
      try {
        const { params: { _id } } = ctx;
        ctx.assert(_id, 400, 'You must select test to fetch');

        const testCase = await Case.findOne({ _id });
        ctx.assert(testCase, 400, 'Test case not found');
        ctx.status = 200;
 
        return ctx.body = {
          testCase
        }
          
      } catch(err) {
        console.log('error in runCase controller', err)
        ctx.throw(500, err.message)
      }
    },
    
    // U - pdate
    runCase: async (ctx, next) => {
      try {
        const { params: { _id }, io } = ctx;
        ctx.assert(_id, 400, 'You must select the test to run');

        const caseToUpdate = await Case.findOne({ _id });
        ctx.assert(caseToUpdate, 400, 'Test case not found');
        
        caseToUpdate.steps = Object.assign([], caseToUpdate.steps, await runTestSteps({ steps: caseToUpdate.steps, io }));
        await caseToUpdate.save();

        ctx.status = 200;
        return ctx.body = {
          testCase: caseToUpdate
        }

      } catch(err) {
        console.log('error in runCase controller', err)
        ctx.throw(500, err.message)
      }
    },
      
    editCase: async (ctx, next) => {
      try {
        const { params: { _id }, request } = ctx;
        ctx.assert(_id, 400, 'You must select test to edit');

        const testCase = await Case.update(
          { _id },
          { $set: request.body },
          { new: true }
        );
        
        ctx.assert(testCase, 400, 'Updated test case not found');
        ctx.status = 200;

        return ctx.body = {
          testCase
        }

      } catch (err) {
        console.log('error in runCase controller', err)
        ctx.throw(500, err.message)
      }
    }

  } // returned Object
} // module.exports
