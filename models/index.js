/**
 *  Case Schema
 *
 *  Define test Case Model
 *  @param {Object} Schema
 *  @return {Object}
 **/

module.exports = (db, decorate) => {
  const Schema = db.Schema;
  const Step = new Schema({
    // run / result related
    screenshot: { type: String },
    lastPassed: { type: Date },
    lastRun: { type: Date },
    pass: { type: Boolean, default: false },

    // identity related
    order: { type: Number },

    category: { type: String },
    options: {},
    target: {},
    type: { type: String },

    // other options goes in meta
    // sample are some result details
    // e.g resultMessage, error, console etc
    meta: {},

  });

  const Case = new Schema({
    // run related
    lastRun: { type: Date },
    lastPassed: { type: Date },
    isPassing: { type: Boolean, default: false },
    
    // identity related
    title: { type: String },
    suite: {},
    steps: [Step],
    
    // other options goes in meta
    meta: {},
    
    // timestamps
    createdAt: { type: Date, default: Date.now() },
    updatedAt: {type: Date, default: Date.now() },

  }, {});

  // hooks
  Case.pre('save', function(next) {
    if (this.steps) {
      // updates lastPassed, isPassing, lastRun      
    }
  })

  return db.model('Case', Case);
};
