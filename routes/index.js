/* @params: controller object, and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers, middlewares: { ensureUser }, router }) => {
  router
    .get('/tests', controllers.getAllCases)
    .post('/tests', controllers.postCase)
    .put('/tests/:_id/run', controllers.runCase)

  return router;
}
