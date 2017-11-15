/* @params: controller object, and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers, middlewares: { ensureUser, jobs }, router }) => {
  router
    .get('/tests', controllers.getAllSuites)
    .get('/tests/:_id', controllers.getSuite)
    .post('/tests', controllers.postSuite)
    .put('/tests/:_id', controllers.editSuite)

    .put('/tests/:suiteId/cases/:order/run', controllers.runCase)
  
    .post('/scheduleTest/:suiteId/cases/:order', jobs.postCaseJob)

  return router;
}
