const express = require('express');
const userRoutes = express.Router();
const cookieSession = require('cookie-session');

userRoutes.use(cookieSession({
  name: 'name',
  secret: 'abcdefg',
  maxAge: 24*60*60*1000
}));

module.exports = function(db){

//This post method creates a new user, stores it in the database, and generates a cookie session in the browser
  userRoutes.post("/", (req, res) => {
    let userObject = {name: req.body.name, pass: req.body.pass};
    req.session.name = req.body.name;
    db.collection("users").insertOne(userObject);
    res.status(201).send("Successfull registration");
  });

//This get method retrieves the list of users from the database
  userRoutes.get("/", (req, res) => {
    db.collection("users").find().toArray((err, userData) => {
      if (err){
        throw err
      }else{
        res.status(201).send(userData);
      }
    });
  });
//This put method logs the users in, and generates a cookie session with the correct name
  userRoutes.put("/login", (req, res) => {
    req.session.name = req.body.name;
    res.status(201).send("Successfull login");
  });

//This put method logs the user out, and clear the existing cookie
  userRoutes.delete("/logout", (req, res) => {
    res.clearCookie("name");
    res.status(201).send("Successfull logout");
  });

  return userRoutes;
}