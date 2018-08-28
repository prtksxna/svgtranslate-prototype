var mySVG = document.getElementById("svg_object");
window.svgDoc = '';
window.textInputs = [];
mySVG.addEventListener("load",function() {
      window.svgDoc = mySVG.contentDocument;
      showTranslationFields( svgDoc )
 }, false);


function showTranslationFields( svg ) {
    var texts = svg.getElementsByTagName( 'text' );
    texts = Array.prototype.slice.call( texts );

    var tspans = [];

    texts.forEach( function ( text ) {
      var text_tspans = text.getElementsByTagName( 'tspan');
      text_tspans = Array.prototype.slice.call( text_tspans );

      text_tspans.push('hr');

      tspans = tspans.concat( text_tspans )
    } );

    var nOfTranslations = 0;

    tspans.forEach( function ( tspan ) {
      if ( tspan === 'hr' ) {
        $( '#translation-form').append( $('<hr>'));
      } else {
        var field = addTranslationField( tspan.innerHTML, tspan.id );
        tspan.addEventListener( 'mouseover', function () {
          $( field ).find('input').css( 'background-color', '#fef6e7');
        })
        tspan.addEventListener( 'mouseout', function () {
          $( field ).find('input').css( 'background-color', '#fff');
        })
        tspan.addEventListener( 'click', function () {
          $( field ).find('input').focus();
        })
        nOfTranslations++
      }
    } );

    addButtons();
    addLangSelector();
    addProgressBar( nOfTranslations );
}

function addProgressBar( total) {
  window.progress = new OO.ui.ProgressBarWidget( { progress: 0 } );
  window.progressTotal = total;
  window.progressField = new OO.ui.FieldLayout( window.progress, {
    label: '0 of '+total+' translations',
    align: 'top'
  } );

  $( '#progress-holder').append( window.progressField.$element );
}

function addTranslationField( label, id ) {
  var el = window.svgDoc.getElementById( id );
  var text = new OO.ui.TextInputWidget({
    validate: 'non-empty'
  });
  text.on( 'change', function ( v ) {
    if ( v === '') {
      el.innerHTML = label;
    } else {
      el.innerHTML = v;
    }

    enableUploadButton();
  });

  window.textInputs.push( text );

  var field = new OO.ui.FieldLayout(
    text, {
      label: label
    }
  );

  $( '#translation-form').append( field.$element);
  return field.$element;
}

function addButtons() {
  var download = new OO.ui.ButtonWidget( {
    label: 'Download',
    icon: 'download'
  } );

  download.on( 'click', function () {
    var svgData = (new XMLSerializer).serializeToString(window.svgDoc)
    var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  })

  window.upload = new OO.ui.ButtonWidget( {
    label: 'Upload to Commons',
    icon: 'logoWikimediaCommons',
    flags: ['primary', 'progressive'],
    disabled: true
  } );

  window.upload.on( 'click', uploadClick );

  if ( window.localStorage.getItem( 'logged') !== 'in' ) {
      window.upload.setDisabled( true );
      window.upload.setLabel( 'Login to Upload to Commons')
  }

  $( '#button-holder').append( window.upload.$element, download.$element);
}

function enableUploadButton() {
  if ( validateAll() ) {
    window.upload.setDisabled( false );
  } else {
    window.upload.setDisabled( true );
  }
}

function uploadClick() {
  if ( window.localStorage.getItem( 'logged') !== 'in' ) {
    OO.ui.confirm( 'You will be redirected to Commons in order to confirm your indentity. SVG Translate will use this to upload your translations.' ).done( function () {
      window.upload.setLabel('Upload to Commons')
      showUploadDialog();
    });
  } else {
    showUploadDialog();
  }
}

function showUploadDialog() {
  OO.ui.MessageDialog.static.escapable = false;
  var messageDialog = new OO.ui.MessageDialog();
var windowManager = new OO.ui.WindowManager();
$( 'body' ).append( windowManager.$element );
windowManager.addWindows( [ messageDialog ] );

// Configure the message dialog.
windowManager.openWindow( messageDialog, {
  title: 'Thank you!',
  message: 'Your translations has been uploaded.',
  actions: [
    { label: 'See file on Commons', action: 'commons', icon: 'logoWikimediaCommons' },
    { label: 'Translate another', action: 'translate', icon: 'language', flags:['pogressive'] },
  ],
} ).closed.then( function ( data ) {
  if ( data && data.action ) {
    if ( data.action === 'translate') {
      window.location = 'index.html';
    } else {
      window.location = 'https://commons.wikimedia.org/wiki/File:100_Years_War_France_1435.svg';
    }
  }
} );
}

function validateAll() {
  var ok = true;
  var done = 0;
  window.textInputs.forEach( function (t) {
    if ( t.getValue() === '') {
      ok = false;
    } else {
      done++;
    }
  });

  window.progressField.setLabel( done + ' of ' + window.progressTotal + ' translations')
  window.progress.setProgress( ( ( done * 1.0 ) / window.progressTotal ) * 100);

  return ok;
}

function addLangSelector() {
  var fromItems = [
    new OO.ui.MenuSectionOptionWidget( {
      label: 'Recently used'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'en',
      label: 'English',
    } ),
    new OO.ui.MenuSectionOptionWidget( {
      label: 'Others'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ur',
      label: 'Urdu'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ja',
      label: 'Japanese'
    } ),
  ];

  var from = new OO.ui.DropdownWidget( {
    label: 'Select one',
    menu: { items: fromItems }
  } );

  var toItems = [
    new OO.ui.MenuSectionOptionWidget( {
      label: 'Recently used'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'hi',
      label: 'Hindi',
    } ),
    new OO.ui.MenuSectionOptionWidget( {
      label: 'Already translated'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ur',
      label: 'Urdu'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ja',
      label: 'Japanese'
    } ),
    new OO.ui.MenuSectionOptionWidget( {
      label: 'Others'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'it',
      label: 'Italian'
    } )
  ];

  var to = new OO.ui.DropdownWidget( {
    label: 'Select one',
    menu: { items: toItems }
  } );


  from.getMenu().selectItemByData( 'en');
  to.getMenu().selectItemByData( 'hi');

  $('#lang-from').append( from.$element );
  $('#lang-to').append( to.$element );

}
