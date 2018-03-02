/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Created this function to find time difference between now and previous tweets
//Only goes down to the hour, but can be easily modified to go to minutes and seconds.
function findTimeDifference(today, tweet){
  let diffSeconds = Math.floor(today/1000) - Math.floor(tweet/1000);
  let returnString = '';
  //Function converts epoch seconds to years, months, days, hours, minutes, seconds.
  //Note: This uses average seconds in a year, month etc. While the time elapsed is not perfectly precise,
  //it is more than sufficient for this application.
  function getTimeElapsed(epochSeconds){
    // time = [[years,yearSeconds], [months,monthSeconds], [days, daySeconds], [hours, hourSeconds]]
    let time = [[0,31556926], [0,2629743], [0,86400], [0,3600]];
    for(let timeIndex in time){
      time[timeIndex][0] = Math.floor(epochSeconds/time[timeIndex][1]);
      epochSeconds -= time[timeIndex][0]*time[timeIndex][1];
    }
    return timeArray = [time[0][0], time[1][0], time[2][0], time[3][0]];
  }
  let diffConverted = getTimeElapsed(diffSeconds);
  for (let timeIndex in diffConverted){
    switch(timeIndex){
      case '0':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnString += `${diffConverted[timeIndex]} year, `;
        }else{
          returnString += `${diffConverted[timeIndex]} years, `;
        }
        break;
      case '1':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnString += `${diffConverted[timeIndex]} month, `;
        }else{
          returnString += `${diffConverted[timeIndex]} months, `;
        }
        break;
      case '2':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnString += `${diffConverted[timeIndex]} day, `;
        }else{
          returnString += `${diffConverted[timeIndex]} days, `;
        }
        break;
      case '3':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnString += `${diffConverted[timeIndex]} hour ago`;
        }else{
          returnString += `${diffConverted[timeIndex]} hours ago`;
        }
        break;
      default:
        break;
    }
  }
  if(returnString === ''){
    returnString = `Under an hour ago`;
  }
  return returnString;
}

//This generates the html for a new tweet
function createTweetElement(tweetData){
  $( "#greatphoto" ).attr( "alt", "Beijing Brush Seller" );
  let $tweet = $("<div>").addClass("tweet");
  let today = new Date().getTime();
  let timeDifference = findTimeDifference(today, tweetData.created_at);
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
  $(`<span>${timeDifference}</span>`).addClass("created-at").appendTo($footer);
  $("<img>").addClass("icons like").attr("src", "/images/tweetLike.png").appendTo($footer);
  $("<img>").addClass("icons retweet").attr("src", "/images/tweetRetweet.png").appendTo($footer);
  $("<img>").addClass("icons flag").attr("src", "/images/tweetFlag.png").appendTo($footer);
  $tweet.append($header);
  $tweet.append($article);
  $tweet.append($footer);
  return $tweet;
}

//This renders a new tweet onto the page. If the tweet-container is empty, load all tweets first.
//Otherwise, only load the latest tweet that has been posted by the user.
function renderTweets(data){
  if($('#tweets-container').children().length !== 0){
    $('#tweets-container').prepend(createTweetElement(data[0]));
  }
  else{
    for(var tweetData of data){
      $('#tweets-container').append(createTweetElement(tweetData));
    }
  }
}

//This function loads the tweet data from the database and passes it into the render tweets function.
function loadTweets(){
  $.get("/tweets/", function(tweetJSONdata){
    renderTweets(tweetJSONdata);
  });
}

function addUser(userFormData){
  $.post("/users", userFormData).done(function(res){
    console.log(res);
    $("#rollUserForms").slideToggle("fast");
  })
}


//When the document loads, it first loads all the tweets in hte database.
//When the a new tweet is created, assuming it passes relevant conditions, the serialized data
//is sent to a server, after which it is immediately loaded on the screen using loadTweets().
$(document).ready(function(){
  loadTweets();
  $("#tweetForm").on('submit', function(event){
    event.preventDefault();
    let errorMessage = $(".new-tweet").find(".error-message")
    let tweetTextArea = $(".new-tweet").find("textarea");
    if(tweetTextArea.val().length === 0){
      return errorMessage.text("Error: No tweet present");
    }
    else if(tweetTextArea.val().length > 140){
      return errorMessage.text("Error: Message too long");
    }
    let formData = $(this).serialize();
    //Reset form upon submission
    errorMessage.text('');
    tweetTextArea.val('');
    $(this).find(".counter").text(140);
    //Send data to server
    $.post("/tweets/", formData).done(function(){
      loadTweets();
    });
  });

  //This jQuery script allows the new tweet form to slide up and down upon clicking the compose button.
  $(".compose").on('click', function(event){
    $(".new-tweet").slideToggle("fast");
    $(".new-tweet").find("textarea").focus();
  });

  //If database has no users, then add a user. Else, check if username taken. If not, add user.
  $("#registerForm").on('submit', function(event){
    let name = $("#registerForm").find(".name").find("input").val();
    event.preventDefault();
    let userFormData = $(this).serialize();

    $.get("/users/", (res) => {
      console.log(res);
      if(res.length === 0){
        return addUser(userFormData);
      }else if(name === ''){
        return $(".notifications").text("Error: No name entered!");
      }else{
        for(let userFile of res){
          if(userFile.name === name){
            return $(".notifications").text("Error: Name already taken!");
          }
        }
        return addUser(userFormData);
      }
    })
  })

  $("#loginForm").on('submit', function(event){
    event.preventDefault();
    let userFormData = $(this).serialize();
    let name = $("#loginForm").find(".name").find("input").val();
    let pass = $("#loginForm").find(".pass").find("input").val();
    $.get("/users", function(res){
      console.log(res);
      for(let userFile of res){
        if(userFile.name === name){
          if(userFile.pass === pass){
            return $.post("/login", userFormData).done(()=>{$("#rollUserForms").slideToggle("fast")});
          }
          return $(".notifications").text("Error: Password incorrect!");
        }
      }
      return $(".notifications").text("Error: Name not found!");
    });
  });

  $(".logout-button").on('click', function(event){
    $.post("/logout").done(function(){
      $("#rollUserForms").slideToggle("fast")
    })
  });



});