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
    isPassing: { type: Boolean, default: false },
    job: {},
    lastRun: { type: Date },
    lastPassed: { type: Date },
    
    // identity related
    order: { type: Number },
    suite: {},
    steps: [Step],
    title: { type: String },
    
    // other options goes in meta
    meta: { type: Schema.Types.Mixed, default: {}},
    
    // timestamps
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  });

  const Suite = new Schema({
    userId: { type: String, required: true },
    // run related
    lastRun: { type: Date },
    lastPassed: { type: Date },
    isPassing: { type: Boolean, default: false },
    
    // identity related
    title: { type: String },
    cases: [Case],
    
    // other options goes in meta
    meta: { type: Schema.Types.Mixed, default: {} },
    
    // timestamps
    createdAt: { type: Date, default: Date.now() },
    updatedAt: {type: Date, default: Date.now() },

  }, {});

  // hooks
  Suite.pre('save', function(next) {
    const lastCase = this.cases[this.cases.length - 1];
   
    if (!lastCase.suite) {
      lastCase.suite = {
        id: this._id,
        title: this.title
      }

      this.cases[this.cases.length - 1] = lastCase;
    }
    return next()
  })
  // end of hooks

  const SuiteModel = db.model('Suite', Suite);
  return SuiteModel;
};
