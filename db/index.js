/**
* db index.js
**/

const db = require('mongoose');
db.Promise = Promise;

module.exports = (dbConfig) => {
  db.connect(dbConfig, { useMongoClient: true });
  return db;
};
