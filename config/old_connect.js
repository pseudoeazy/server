// const mongoose = require("mongoose");
// const config = require("../config/config");

// mongoose.set("useCreateIndex", true);
// const dbConnect = async () => {
//   try {
//     // connect to database
//     await mongoose.connect(config.mongoUri, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Database connected via:", config.mongoUri);
//   } catch (e) {
//     console.log(`unable to connect to database: ${config.mongoUri} Error:`, e);
//   }
// };

// module.exports = dbConnect;
