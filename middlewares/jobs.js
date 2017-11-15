module.exports = (Suite, scheduler) => ({
  async postCaseJob(ctx, next) {
    try {
      const { params: { suiteId, order } } = ctx;
      scheduler = await scheduler;
      const job = scheduler.create('runCase', { suiteId, order })
      
      job.repeatEvery('15 minutes')
      job.save();
      // return next();
    }
    catch (err) {
      console.log("got error in postJob", err)
      
      ctx.throw(err);
    }
  }

})
