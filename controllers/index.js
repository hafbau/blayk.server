const mongoose = require('mongoose');
const runTestSteps = require('../run_test');
const slack = require('../integrations/slack');
const jira = require('../integrations/jira');

module.exports = (Suite, render) => {
  
  return {
    // C - REATE
    postSuite: async (ctx, next) => {
      try {
        const { request, res } = ctx;
        const suite = await Suite.create(request.body);
        ctx.assert(suite, 400, 'Unable to create suite')
        ctx.status = 200;
        
        ctx.body = {
          suite: Object(suite)
        }
        return next()
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
      catch (err) {
        if (err.message !== 'No tests found') return ctx.throw(ctx.status || 500)
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
          
      } catch (err) {
        ctx.throw(ctx.status || 500, err.message)
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
        
        const meta = caseToUpdate.meta || {};
        meta.runType = 'immediate';
        meta.runAt = Date.now();

        caseToUpdate.meta = meta;
        caseToUpdate.lastRun = Date.now();
        caseToUpdate.steps = Object.assign([], caseToUpdate.steps, await runTestSteps({ steps: caseToUpdate.steps, io }));

        suite.cases[caseToUpdateId] = caseToUpdate;
        await suite.save();
        // trigger integrated services
        // const slackEndpoint = suite.meta && suite.meta.slack;
        // await slack(caseToUpdate, slackEndpoint);

        ctx.status = 200;
        return ctx.body = {
          testCase: caseToUpdate
        }

      } catch (err) {
        ctx.throw(ctx.status || 500, err.message)
      }
    },
      
    editSuite: async (ctx, next) => {
      try {
        const { params: { _id }, request } = ctx;
        ctx.assert(_id, 400, 'You must select test to edit');
            
        const suite = await Suite.findByIdAndUpdate(
          mongoose.Types.ObjectId(_id),
          { $set: request.body },
          { new: true }
        );
        ctx.assert(suite, 400, 'Updated test suite not found');
        ctx.status = 200;

        return ctx.body = {
          suite
        }

      } catch (err) {
        ctx.throw(ctx.status || 500, err.message)
      }
    },

    saveIssue: async (ctx, next) => {
        try {
            const { request: { body } } = ctx;
            let jiraResponse = await jira(body)
            ctx.status = 200;
          
            if (typeof jiraResponse == 'string') jiraResponse = JSON.parse(jiraResponse)
            return ctx.body = { success: 'dunno', jiraResponse };
        } catch (err) {
            console.log('error in saveIssue control', err)
            ctx.throw(ctx.status || 500, err.message)
        }
    },

    // D - estroy
    deleteSuite: async (ctx, next) => {
      try {
        const { params: { _id }, request } = ctx;
        ctx.assert(_id, 400, 'You must select test to delete');
        
        const suite = await Suite.findOneAndRemove(
          { _id: mongoose.Types.ObjectId(_id) },
          { single: true }
        );
        // ctx.assert(suite, 400, 'Updated test suite not found');
        ctx.status = 200;

        return ctx.body = {
          success: true
        }

      } catch (err) {
        ctx.throw(ctx.status || 500, err.message)
      }
    }
  } // returned Object
} // module.exports
