/* @params: controller object, and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers, middlewares: { ensureUser }, router }) => {
  router
    .get('/tests', controllers.getAllCases)
    .get('/tests/:_id', controllers.getCase)
    .post('/tests', controllers.postCase)
    .put('/tests/:_id', controllers.editCase)
    .put('/tests/:_id/run', controllers.runCase)

  return router;
}
