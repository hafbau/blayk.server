const Agenda = require('agenda');
const agenda = new Agenda();
const mongoose = require('mongoose');

const assert = require('assert');
const runTestSteps = require('../run_test');
const slack = require('../integrations/slack');


module.exports = async (db, Suite) => {
    agenda
    .database(db)
    //.processEvery('one minute');

    agenda.define('runCase', (job, done) => runCase(job, done, Suite) );
    
    await new Promise(resolve => {
        agenda.on('ready', () => resolve() );
    })
    
    agenda.start();
    return agenda;
}

async function runCase(job, done, Suite) {
    try {
        const { data: { suiteId, order } } = job.attrs;
        assert(suiteId, 'You must select the test to run');
    
        const suite = await Suite.findOne({
            _id: mongoose.Types.ObjectId(suiteId)
        });
        assert(suite, 'Test suite not found');
    
        const caseToUpdateId = suite.cases.findIndex(testCase => testCase.order == order);
        const caseToUpdate = suite.cases[caseToUpdateId];
        assert(caseToUpdate, 400, 'Test case not found');

        const meta = caseToUpdate.meta || {};
        meta.runType = 'scheduled';
        meta.runAt = Date.now();

        caseToUpdate.meta = meta;
        caseToUpdate.steps = Object.assign([], caseToUpdate.steps, await runTestSteps({ steps: caseToUpdate.steps }));

        suite.cases[caseToUpdateId] = caseToUpdate;
        await suite.save();

        // trigger integrated services
        slack(caseToUpdate.steps);
    
    } catch (err) {
        throw (500, err.message)

    } finally {
        done();
    }
}

function failGracefully() {
    console.log('Premature shutdown detected, stopping jobs...');
    agenda.stop(() => process.exit(0));
}

process.on('SIGTERM', failGracefully);
process.on('SIGINT', failGracefully);