const User = require('../models/user');
const webpush = require('web-push');

let getUsers = () => {
  return User.find({});
};

let getActiveUsers = (skip = 0, take = 10) => {
  return User.find({
    sleepBefore: null,
    notifyPermission: true,
    expirationTime: {$gt: Date.now()},
  }).
      limit(take).
      skip(skip);
};

let getUsersByTopics = (topics = [])  => {
  return User.find({topics: {$in: topics}});
};

let sendNotification = (users, notification) => {
  for (let user of users) {
    let notifyObject = user.notify;
    webpush.sendNotification(notifyObject, JSON.stringify(notification)).
        then(() => {

        }).catch((err) => {
      console.error(user._id + 'Time: ' + (new Date()).toISOString() +
          ', Error during notify: ',
          err);
    });
  }
};

const Notify = {
  getUsers,
  getActiveUsers,
  getUsersByTopics,
  sendNotification,
};

module.exports = Notify;