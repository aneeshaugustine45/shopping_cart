const mongoose = require("mongoose");

const state = {
  db: null,
};

module.exports.connect = function (done) {
  const url = "mongodb://127.0.0.1:27017/shopping";
  const dbname = "shopping";

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      state.db = mongoose.connection.db;
      done();
    })
    .catch((err) => {
      done(err);
    });
};

module.exports.get = function () {
  return state.db;
};
