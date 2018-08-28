$(document).ready( function () {
  $('#lang-no').on( 'click', function () {
    $('#lang-default').fadeOut();
  })
  $('#lang-yes').on( 'click', function () {
    OO.ui.alert('Show ULS to pick a language')
  })
})
