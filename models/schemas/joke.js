const mongoose = require("mongoose");
const JokeSchema = mongoose.Schema({
  joketext: {
    type: String,
  },
  jokedate: {
    type: Date,
  },
});

module.exports = mongoose.model("Joke", JokeSchema);
