/*
 * JavaScript for Accessible University Demo Site
 * http://uw.edu/accesscomputing/AU
 *
 * before-modal.js = Inaccessible modal
 */

$(document).ready(function(event) {

  $('a[href="cheatsheet.html"]').on('click',function(event) {
    showModal();
    event.preventDefault();
  });

  // handle click on X or Ok button in modal dialog
  $(document).on('click','#modalXButton, #modalOkButton',function(event) {
    $('#modalContent').hide();
    $('#modalMask').hide();
  })

  function showModal() {

    var winWidth = $(window).width();
    var winHeight = $(window).height();
    var modalSize = 500;
    var modalLeft = ((winWidth-modalSize)/2) + 'px';
    var modalTop = ((winHeight-modalSize)/4) + 'px';

    $('#modalContent')
      .css({
        'top': modalTop,
        'left': modalLeft
      })
      .show();

    $('#modalMask').show();
  }
});
