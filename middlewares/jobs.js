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
            const { params: { suiteId, order }, body } = ctx;
            scheduler = await scheduler;
            await cancelJobIfExist({ scheduler, suiteId, order });

            const scheduleMinutes = convertToMinutes(body);
            if (scheduleMinutes) {
                const job = scheduler.create('runCase', { suiteId, order })
                job.repeatEvery(pluralize(scheduleMinutes, 'minute'))
                job.save();
            }
            // return next();
        }
        catch (err) {
            console.log("got error in postJob", err)
            
            ctx.throw(err);
        }
    }

});