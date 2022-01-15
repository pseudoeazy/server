const Joke = require("../models/schemas/joke");

const addJoke = async () => {
  try {
    const newJoke = Joke({
      joketext: `A programmer was found dead in the shower. The
instructions read: lather, rinse, repeat.`,
      jokedate: `2017-06-01`,
    });
    console.log({ newJoke });
    const saveJoke = await newJoke.save();
    console.log({ saveJoke });
  } catch (err) {
    console.log({ err });
  }
};

addJoke();
