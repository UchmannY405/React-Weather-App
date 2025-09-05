const mongoose = require("mongoose");
const connectionStr = process.env.MONGO_URI;

const connectDB = () => {
  return mongoose.connect(connectionStr);
};
module.exports = connectDB;
