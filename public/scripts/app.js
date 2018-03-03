/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Created this function to find time difference between now and previous tweets
//Only goes down to the hour, but can be easily modified to go to minutes and seconds.
function findTimeDifference(today, tweet){
  let diffSeconds = Math.floor(today/1000) - Math.floor(tweet/1000);
  let returnArray = [];
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
          returnArray.push(`${diffConverted[timeIndex]} year`);
        }else{
          returnArray.push(`${diffConverted[timeIndex]} years`);
        }
        break;
      case '1':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnArray.push(`${diffConverted[timeIndex]} month`);
        }else{
          returnArray.push(`${diffConverted[timeIndex]} months`);
        }
        break;
      case '2':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnArray.push(`${diffConverted[timeIndex]} day`);
        }else{
          returnArray.push(`${diffConverted[timeIndex]} days`);
        }
        break;
      case '3':
        if (diffConverted[timeIndex] === 0){
          break;
        }else if(diffConverted[timeIndex] === 1){
          returnArray.push(`${diffConverted[timeIndex]} hour`);
        }else{
          returnArray.push(`${diffConverted[timeIndex]} hours`);
        }
        break;
      default:
        break;
    }
  }
  if(returnArray.length === 0){
    return `Under an hour ago`;
  }
  let returnString = returnArray.join(", ") + ' ago';
  return returnString;
}
//This generates the html for a n)ew tweet
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
  $(`<span>${tweetData.likes}</span>`).addClass("likes").appendTo($footer);
  $('<span> likes</span>').addClass("likesText").appendTo($footer);
  $("<img>").addClass("icons like").attr("src", "/images/tweetLike.png").data('handle',`${tweetData.user.handle}`).appendTo($footer);
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

function showOptions() {
  $(".compose").css("visibility", "visible");
  $(".logout-span").css("visibility", "visible");
  $(".new-tweet").css("visibility", "visible");
  $(".users").css("visibility", "hidden");
}

function hideOptions() {
  $(".compose").css("visibility", "hidden");
  $(".logout-span").css("visibility", "hidden");
  $(".new-tweet").css("visibility", "hidden");
  $(".users").css("visibility", "visible");
  $(".welcome").text('');
}

function addUser(userFormData){
  $.post("/users/", userFormData).done(function(res){
    showOptions();
  })
}

function clearEntries(name, pass){
  name.val('');
  pass.val('');
  $('.notifications').text('');
}

let allowLikes = false;

//When the document loads, it first loads all the tweets into the database.
$(document).ready(function(){
  loadTweets();

//When the a new tweet is created, assuming it passes relevant conditions, the serialized data
//is sent to a server, after which it is immediately loaded on the screen using loadTweets().
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
    event.preventDefault();

    let name = $(".reg-name").find("input");
    let pass = $(".reg-pass").find("input");
    let userFormData = $(this).serialize();

    $.get("/users/", (res) => {
      //res = [{_id: slkdjf, name: "john", pass: "wayne"}...]
      if(res.length === 0){
        return addUser(userFormData);
      }else if(name.val() === ''){
        clearEntries(name, pass);
        return $(".notifications").text("Error: No name entered!");
      }else{
        for(let userFile of res){
          if(userFile.name === name.val()){
            clearEntries(name, pass);
            return $(".notifications").text("Error: Name already taken!");
          }
        }
        //Successful registration
        $(".welcome").text(`Welcome, ${name.val()}!`)
        clearEntries(name, pass);
        allowLikes = true;
        return addUser(userFormData);
      }
    })
  })

  //Check if username and password is correct. If so, clear entries for later use and make put request
  //to create user cookie.
  $("#loginForm").on('submit', function(event){
    event.preventDefault();
    let userFormData = $(this).serialize();
    let name = $(".login-name").find("input");
    let pass = $(".login-pass").find("input");
    $.get("/users/", (res) => {
      // console.log("User database:", res);
      for(let userFile of res){
        if(userFile.name === name.val()){
          if(userFile.pass === pass.val()){
            //Successful login
            $(".welcome").text(`Welcome, ${name.val()}!`)
            clearEntries(name, pass);
            return $.post("/users/login?_method=PUT", userFormData)
            .done((res) => {
              showOptions();
              allowLikes = true;
            });
          }
          clearEntries(name, pass);
          return $(".notifications").text("Error: Password incorrect!");
        }
      }
      clearEntries(name, pass);
      return $(".notifications").text("Error: Name not found!");
    });
  });

  $(".logout-button").on('click', function(event){
    $.post("/users/logout?_method=PUT").done(function(res){
      hideOptions();
      allowLikes = false;
    })
  });


  $("#tweets-container").on('click', function(event){
    if(allowLikes){
      let target = event.target;
      if(target.classList[1] === "like"){
        let likesCounter = $(target).siblings(".likes");
        let currentLikes = +likesCounter.text();
        likesCounter.text(currentLikes + 1);
        let userHandle = $(target).data('handle');
        console.log('handle', userHandle);
        console.log('currentlikes', likesCounter.text());
        //Now update database for persistency
        userObj = {handle: userHandle, likes: likesCounter.text()}
        $.post("/tweets/?_method=PUT", userObj);
    }

    }
  });
});