const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  password: String,
  email: String,
  access_code:{type: String, default: ''},
});

const userModel = new mongoose.model('User',userSchema);
module.exports = {userModel};