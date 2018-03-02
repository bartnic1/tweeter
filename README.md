# Tweeter Project

Tweeter is a simple, single-page Twitter clone. MongoDB is used for database management, while express is used to set up a server through nodeJS.

## Getting Started

1. Clone a copy of this repository into a directory (git clone git@github.com:bartnic1/tweeter.git tweeter)
2. Install all dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Navigate to <http://localhost:8080/> in your browser.
5. If not already open, press the "Compose" button at the top right of the screen (on the navbar).
6. In the compose tweet form that appears below, enter in a message (Note: It should be less than or equal to 140 characters, but not zero - otherwise an error will be displayed).
7. Upon clicking "Tweet", your new message will appear in the feed below.
8. Subsequent resets of the server will maintain this tweet history and display it in the browser.


## Dependencies

- Express
- Node 5.10.x or above
- Body-parser
- Chance
- MongoDB
- md5

## Useful Features

## Glitches



//Pseudocode:

When user registers, an ajax request determines whether the username has been taken.
If not, then the username and password are added to the database.

Now a cookie has to be generated, set with the user ID.
Each time a new tweet is sent, an object is created with both the userID and the body.

If there is no user cookie, then the userID is empty. So the object being sent will have an empty value
for that key.

