# Tweeter Project

Tweeter is a simple, single-page Twitter clone. MongoDB is used for database management, while express is used to set up a server through nodeJS.

## Final Product

### A Sample tinyURL Table
!["Logged in"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Main%20Table.png)

### tinyURL Editing in Action
!["Logged out"](https://github.com/bartnic1/TinyApp/blob/master/URL%20Edit%20Page.png)

## Dependencies

- Express
- Node 5.10.x or above
- Body-parser
- Chance
- MongoDB
- md5
- Cookie-session
- Method-override
- Node sass
- Node sass middleware

## Getting Started

1. Clone a copy of this repository into a directory (git clone git@github.com:bartnic1/tweeter.git tweeter)
2. Install all dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
4. Navigate to <http://localhost:8080/> in your browser.
5. Register a new account, or if returning, log in to a previous account using the central form.
6. Once logged in, users may generate a new tweet. Press "Compose" at the top right to minimize the generate tweet form. Note that messages must be less than or equal to 140 characters, and greater than 0 characters.
7. Upon clicking "Tweet", your new message will appear in the feed below.
8. Users may also "like" tweets other than their own by selecting the heart icon (this pops up when a tweet is moused-over)
9. Subsequent resets of the server will maintain the tweet history, and likes for all users.


## Useful Features

- Allows users to register and login, generating a browser session with encrypted cookies
- Only logged-in users may like or create new tweets, though all users may view tweets previously made.
- Upon entering a session, tweets will show how long ago they were made
- Users may only like the tweets of other users, and if they really like them, can do so multiple times.
- All data is stored in a persistent database that mimics real-world functionality


## Future Additions

- Implement feature where user can only like other posts once, otherwise clicking 'like' again decrements the likes
- Implement support for hosting on an external server
- Allow user to upload their own avatar and maintain persistence throughout multiple sessions
