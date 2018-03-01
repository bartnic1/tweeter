/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
// Fake data taken from tweets.json

const data = [
  {
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
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];

function createTweetElement(tweetData){
  $( "#greatphoto" ).attr( "alt", "Beijing Brush Seller" );
  let $tweet = $("<div>").addClass("tweet");
  //Translate into a full date, for now (will change later)
  let today = new Date().getTime();
  let timeDifference = Math.floor((today - tweetData.created_at)/(1000*3600*24));

  // Header elements
  let $header = $("<header>");
  $("<img>").addClass("avatar").attr("src", tweetData.user.avatars.small).appendTo($header);
  $(`<p>`).text(tweetData.user.name).addClass("name").appendTo($header);
  $(`<p>`).text(tweetData.user.handle).addClass("handle").appendTo($header);
  // Article elements
  let $article = $("<article>");
  $(`<p>`).text(tweetData.content.text).addClass("content").appendTo($article);
  // Footer elements
  let $footer = $("<footer>")
  $(`<span>${timeDifference} days ago</span>`).addClass("created-at").appendTo($footer);
  $("<img>").addClass("icons like").attr("src", "/images/tweetLike.png").appendTo($footer);
  $("<img>").addClass("icons retweet").attr("src", "/images/tweetRetweet.png").appendTo($footer);
  $("<img>").addClass("icons flag").attr("src", "/images/tweetFlag.png").appendTo($footer);
  $tweet.append($header);
  $tweet.append($article);
  $tweet.append($footer);
  return $tweet;
}

function renderTweets(data){
  if($('#tweets-container').children().length !== 0){
    $('#tweets-container').prepend(createTweetElement(data[data.length - 1]));
  }
  else{
    for(var tweetData of data){
      $('#tweets-container').append(createTweetElement(tweetData));
    }
  }
}

function loadTweets(){
  $.get("/tweets/", function(tweetJSONdata){
    renderTweets(tweetJSONdata);
  });
}

$(document).ready(function(){
  renderTweets(data);

  $("#tweetForm").on('submit', function(event){
    event.preventDefault();
    let errorMessage = $(".new-tweet").find(".error-message")
    let tweetTextLength = $(".new-tweet").find("textarea").val().length;
    if(tweetTextLength === 0){
      return errorMessage.text("Error: No tweet present");
    }
    else if(tweetTextLength > 140){
      return errorMessage.text("Error: Message too long");
    }
    errorMessage.text('');
    let formData = $(this).serialize();
    $.post("/tweets/", formData).done(function(){
      loadTweets();
    });
  });

  $(".compose").on('click', function(event){
    $(".new-tweet").slideToggle("fast");
    //Could possibly only enable focus if opening the dialog box, but not sure if necessary
    $(".new-tweet").find("textarea").focus();
  });

});