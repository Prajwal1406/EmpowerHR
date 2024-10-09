const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://kannada:***@employee.eba2c.mongodb.net/interndb?retryWrites=true&w=majority&appName=employee"
      )
      .then(console.log("mongoose connected"));
  } catch (err) {
    console.error("mongoose not connected", err);
  }
};

module.exports = connectDb;
