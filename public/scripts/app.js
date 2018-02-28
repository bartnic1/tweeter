/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}

function createTweetElement(tweetData){
  $( "#greatphoto" ).attr( "alt", "Beijing Brush Seller" );
  let $tweet = $("<div>").addClass("tweet");
  //Translate into a full date, for now (will change later)
  let myDate =  new Date(tweetData.created_at);
  // Header elements
  let $header = $("<header>");
  $("<img>").addClass("avatar").attr("src", tweetData.user.avatars.small).appendTo($header);
  $(`<p><strong>${tweetData.user.name}</strong></p>`).addClass("name").appendTo($header);
  $(`<p>${tweetData.user.handle}</p>`).addClass("handle").appendTo($header);
  // Article elements
  let $article = $("<article>");
  $(`<p>${tweetData.content.text}</p>`).addClass("content").appendTo($article);
  // Footer elements
  let $footer = $("<footer>")
  $(`<span>${myDate}</span>`).addClass("created-at").appendTo($footer);
  $("<img>").addClass("icons like").attr("src", "/images/tweetLike.png").appendTo($footer);
  $("<img>").addClass("icons retweet").attr("src", "/images/tweetRetweet.png").appendTo($footer);
  $("<img>").addClass("icons flag").attr("src", "/images/tweetFlag.png").appendTo($footer);
  $tweet.append($header);
  $tweet.append($article);
  $tweet.append($footer);
  return $tweet;
}


$(document).ready(function(){

  var $tweet = createTweetElement(tweetData);
  // Test / driver code (temporary)
  console.log($tweet); // to see what it looks like
  $('#tweets-container').append($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
});

