const express = require('express');
const userRoutes = express.Router();
const cookieSession = require('cookie-session');

userRoutes.use(cookieSession({
  name: 'name',
  secret: 'abcdefg',
  maxAge: 24*60*60*1000
}));


userRoutes.post("/", (req, res) => {
  let userObject = {name: req.body.name, pass: req.body.pass};
  req.session.name = req.body.name;
  db.collection("users").insertOne(userObject);
  res.status(201).send("Successfull registration");
})

userRoutes.get("/", (req, res) => {
  db.collection("users").find().toArray((err, userData) => {
    if (err){
      throw err
    }else{
      // res.send(json(userData));
      res.status(201).send(userData);
      // res.json(userData);
      // res.status(201).send("hello");
    }
  });
});

userRoutes.post("/login", (req, res) => {
  res.session.name = req.body.name;
  res.status(201).send("Successfull login");
});

userRoutes.post("/logout", (req, res) => {
  res.clearCookie("name");
  res.status(201).send("Successfull logout");
});


module.exports = userRoutes;