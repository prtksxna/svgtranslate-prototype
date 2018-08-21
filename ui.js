// Select file form
var form = new OO.ui.ActionFieldLayout(
  new OO.ui.TextInputWidget(),
  new OO.ui.ButtonWidget( {
    label: 'Translate',
    flags: [ 'primary', 'progressive' ]
  } ),
  {
    align: 'top',
    label: 'Select file to translate',
    help: 'Type a file name from Commons',
} )
$( '#select-form' ).append( form.$element );

// Login
showAccountMenu = function () {
  $logout = $( '<a>' ).text( 'Logout (TestUser)').attr( 'href', '#' );
  $lang = $( '<a>' ).text( 'Language settings').attr( 'href', '#' );
  $('nav').empty().append(
    $lang,
    '&nbsp;&middot;&nbsp;',
    $logout
  );

  $logout.on( 'click', function () {
    window.localStorage.setItem( 'logged', 'out' );
    window.location = window.location.pathname;
  })
}

$( '#login' ).on( 'click', function () {
  var menu = $( this ).parent();
  OO.ui.confirm( 'You will be redirected to Commons in order to confirm your indentity. Montage will not publish anything on Wikimedia projects using your account.' ).done( function () {
    window.localStorage.setItem( 'logged', 'in' );
    showAccountMenu();
  } );
} );

if ( window.localStorage.getItem( 'logged' ) === 'in' ) {
  showAccountMenu();
}
