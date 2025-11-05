/*
 * JavaScript for Accessible University Demo Site
 * http://uw.edu/accesscomputing/AU
 *
 * before-form.js = Custom inaccessible form validation
 */

$(document).ready(function(event) {

  $('#submit').on('click',function(event) {
    var heading = $('<div>').addClass('errorHeading').text('ERROR');
    var errorMsg = $('<p>')
      .text('Your form has errors. Please correct them and resubmit.');
    $('#error').html(heading).append(errorMsg).show();
    $(document).scrollTop(1); // scroll up so users can see the message!
    event.preventDefault();
  });
});
