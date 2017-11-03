const runTestSteps = require('../run_test');
const mongoose = require('mongoose');

module.exports = (Suite, render) => {
  
  return {
    // C - REATE
    postSuite: async (ctx, next) => {
      try {
        const { request, res } = ctx;
        const suite = await Suite.create(request.body);
        
        if (suite) {
          ctx.status = 200;
          ctx.body = {
            suite: Object(suite)
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
    getAllSuites: async (ctx, next) => {
      try {
        const { req, res } = ctx;
        const suites = await Suite.find();
        ctx.assert(suites && suites.length, 400, 'No tests found');
        
        ctx.status = 200;
        return ctx.body = {
          suites
        }
          
      }
      catch(err) {
        if (err.message !== 'No tests found') return ctx.throw(500)
      }
      
    },
    getSuite: async (ctx, next) => {
      try {
        const { params: { _id } } = ctx;
        ctx.assert(_id, 400, 'You must select test to fetch');
        // not using casting to ObjectId here for no reason
        const suite = (await Suite.find({ _id }))[0];

        ctx.assert(suite, 400, 'Test suite not found');
        ctx.status = 200;
 
        return ctx.body = {
          suite
        }
          
      } catch(err) {
        ctx.throw(500, err.message)
      }
    },
    
    // U - pdate
    runCase: async (ctx, next) => {
      try {
        const { params: { suiteId, order }, io } = ctx;
        ctx.assert(suiteId, 400, 'You must select the test to run');

        const suite = await Suite.findOne({
              _id: mongoose.Types.ObjectId(suiteId)
              });
        ctx.assert(suite, 400, 'Test suite not found');
        
        const caseToUpdateId = suite.cases.findIndex(testCase => testCase.order == order);
        const caseToUpdate = suite.cases[caseToUpdateId];
        ctx.assert(caseToUpdate, 400, 'Test case not found');
        
        caseToUpdate.steps = Object.assign([], caseToUpdate.steps, await runTestSteps({ steps: caseToUpdate.steps, io }));
        suite.cases[caseToUpdateId] = caseToUpdate;
        await suite.save();

        ctx.status = 200;
        return ctx.body = {
          testCase: caseToUpdate
        }

      } catch(err) {
        ctx.throw(500, err.message)
      }
    },
      
    editSuite: async (ctx, next) => {
      try {
        const { params: { _id }, request } = ctx;
        ctx.assert(_id, 400, 'You must select test to edit');
        
        const suite = await Suite.update(
          { _id: mongoose.Types.ObjectId(_id) },
          { $set: request.body },
          { new: true }
        );
        
        ctx.assert(suite, 400, 'Updated test suite not found');
        ctx.status = 200;

        return ctx.body = {
          suite
        }

      } catch (err) {
        ctx.throw(500, err.message)
      }
    }

  } // returned Object
} // module.exports
