const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  topics: [String],
  notify: Object,
  notificationDate: Date,
  subscribeDate: Date,
  expirationTime: Number,
  sleepBefore: Date,
  notifyPermission: Boolean,
});

const User = mongoose.model('user', UserSchema);

module.exports = User;