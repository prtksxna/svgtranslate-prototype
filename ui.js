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
