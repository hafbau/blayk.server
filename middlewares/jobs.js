const mongoose = require('mongoose');
const {
    scheduleHelpers: {
        cancelJobIfExist,
        convertToMinutes,
        pluralize
    }
} = require('../utils');

module.exports = (Suite, scheduler) => ({
    async postCaseJob(ctx, next) {
        try {
            const { params: { suiteId, order }, request } = ctx;
            scheduler = await scheduler;
            await cancelJobIfExist({ scheduler, suiteId, order });

            const scheduleMinutes = convertToMinutes(request.body);
            if (scheduleMinutes) {
                const job = scheduler.create('runCase', { suiteId, order })
                job.repeatEvery(pluralize(scheduleMinutes, 'minute'))
                job.save();
            }
            // Save job schedule on case
            const suite = await Suite.findOne({ _id: mongoose.Types.ObjectId(suiteId) });
            ctx.assert(suite, 400, "Suite not found");
            const testCaseId = suite.cases.findIndex(testCase => String(testCase.order) === String(order));
            ctx.assert(testCaseId > -1, 400, "Case not found");
            
            if (scheduleMinutes) suite.cases[testCaseId].job = request.body;
            if (!scheduleMinutes) suite.cases[testCaseId].job = undefined;
            await suite.save();
            
            // TODO: Send status & Cancel message if no schedule/minutes
            // throw new Error("Could not schedule run")
            
            // return next();
        }
        catch (err) {
            console.log("got error in postJob", err)
            
            ctx.throw(err);
        }
    }

});