"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => b.created_at - a.created_at;
      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          throw err;
        }else{
          callback(null, tweets.sort(sortNewestFirst));
        }
      });
    },

    updateTweet: function(req) {
      db.collection("tweets").updateOne({'user.handle': req.body.handle},
        {$set: {likes: req.body.likes}}, (err, res) => {if(err){throw err}});
    }

  };
}
