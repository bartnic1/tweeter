$(document).ready(function(){
  let textNode = $(".new-tweet").find("textarea");
  let counter = $(textNode).siblings(".counter");
  $(textNode).on('keyup', function(){
    let charsLeft = 140 - +$(this).val().length;
    $(counter).text(charsLeft);
    if(charsLeft < 0){
      $(counter).css('color', '#FF0000');
    }else{
      $(counter).css('color', '#000000');
    }
  });
});