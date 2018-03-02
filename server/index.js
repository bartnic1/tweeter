"use strict";

// Mongo stuff
const {MongoClient} = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

// Basic express setup + sass:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const sass          = require("node-sass");
const sassMiddleware = require("node-sass-middleware");
const path           = require("path");

app.use(bodyParser.urlencoded({ extended: true }));

const srcPath = path.join(__dirname, 'scss-files');
const destPath = path.join(__dirname, '..', 'public', 'styles');

app.use(
  sassMiddleware({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'expanded',
    prefix: '/styles'
  }));

app.use(express.static("public"));


//flexboxfroggy.com
//css-tricks.com


// app.use(cookieSession({
//   name: 'name',
//   secret: 'abcdefg',
//   maxAge: 24*60*60*1000
// }));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // The `data-helpers` module provides an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).

  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const userRoutes = require("./routes/users");
  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
  app.use("/users", userRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  // DB will close automatically when the app shuts down
  });
});

