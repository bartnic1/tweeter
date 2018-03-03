"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();
const cookieSession = require('cookie-session');

tweetsRoutes.use(cookieSession({
  name: 'name',
  secret: 'abcdefg',
  maxAge: 24*60*60*1000
}));

module.exports = function(DataHelpers) {

  //Retrieves tweets from a database
  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  //Generates new tweets
  tweetsRoutes.post("/", function(req, res) {

    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    let cookiename = req.session.name;
    let newUserObj;
    //Only create a tweet if a cookie exists (i.e. a user is logged in)
    if(cookiename){
      let randomUser = userHelper.generateRandomUser();
      let avatars = randomUser.avatars;

      newUserObj = {
        name: cookiename,
        avatars: avatars,
        handle: `@${cookiename}` }
    }
    const user = cookiename ? newUserObj : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0,
      likedBy: {}
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  //Handles "likes" of certain tweets.
  tweetsRoutes.put("/", function(req, res) {
    let returnVal = DataHelpers.updateTweet(req);
    if(returnVal === "reset"){
      return res.send("reset");
    }
    res.send("Done");
  });

  return tweetsRoutes;
}
