const mangoose = require("mongoose");
const userSchema = new mangoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const userModel = mangoose.model("User", userSchema);
module.exports = userModel;
