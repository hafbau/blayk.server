const jwt = require('jsonwebtoken');

module.exports = ({ userModel }) => {
  return async (ctx, next) => {
    try {
      // TODO:
      return next();
    }
    catch (err) {
      console.log("got error in verify", err)
      
      return next();
    }
  }

}
