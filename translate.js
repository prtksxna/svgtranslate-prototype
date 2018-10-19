var mySVG = document.getElementById("svg_object");
window.svgDoc = '';
window.textInputs = [];
mySVG.addEventListener("load",function() {
      window.svgDoc = mySVG.contentDocument;
      showTranslationFields( svgDoc )
 }, false);

$(function () {
  // A popup widget.
  window.popup = new OO.ui.PopupWidget( {
     $content: $( '<div>Pick the language that you’d like to translate to.</div>' ),
     padded: true,
     width: 250,
     height: 60,
     autoClose: true,
     hideWhenOutOfView: true
  } );

  $( 'body' ).append( popup.$element );
  // To display the popup, toggle the visibility to 'true'.
  popup.toggle( true );
  popup.$clippable.css('overflow', 'visible');

})

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

    tspans.forEach( function ( tspan, i ) {
      if ( tspan === 'hr' ) {
        $( '#translation-form').append( $('<hr>'));
      } else {
        if (tspan.id === '' ) {
          tspan.id = 'temp-' + i;
        }
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

  $( '#progress-holder').append( window.progress.$element );
}

function addTranslationField( label, id ) {
  var el = window.svgDoc.getElementById( id );
  var text = new OO.ui.TextInputWidget({
    validate: 'non-empty'
  });
  text.on( 'change', function ( v ) {
    window.uploaded = false;
    if ( v === '') {
      el.innerHTML = label;
    } else {
      el.innerHTML = v;
    }

    enableUploadButton();
  });


  text.$input.on('focus', function () {
    el.style.textShadow = '0 0 10px red';
  });

  text.$input.on('blur', function () {
    el.style.textShadow = '';
  })

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
  var downloadA = $('<a>').text('Download').attr('href','javascript:void(0);');
  var download = $('<span>').append( downloadA, ' or ').css('margin-top','7px');

  downloadA.on( 'click', function () {
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
      window.upload.setLabel( 'Upload to Commons'); // Was 'login to upload to commons'
  }

  $( '#button-holder').append( window.upload.$element, download);
}

function enableUploadButton() {
  if ( validateAll() ) {
    window.upload.setDisabled( false );
  } else {
    window.upload.setDisabled( true );
  }
}

function uploadClick() {
  $('.alert').slideDown();
  window.uploaded = true;
  $('html, body').animate({
        scrollTop: 0
    }, 100);
  return;

  if ( window.localStorage.getItem( 'logged') !== 'in' ) {
    OO.ui.confirm( 'You will be redirected to Commons in order to confirm your identity. Your translations will be automatically uploaded once you\'ve logged in.' ).done( function () {
      window.upload.setLabel('Upload to Commons')
      showUploadDialog();
    });
  } else {
    showUploadDialog();
  }
}

function showUploadDialog() {
  var messageDialog = new OO.ui.MessageDialog();
var windowManager = new OO.ui.WindowManager();
$( 'body' ).append( windowManager.$element );
windowManager.addWindows( [ messageDialog ] );

// Configure the message dialog.
windowManager.openWindow( messageDialog, {
  title: 'Thank you!',
  message: 'Your translations have been uploaded.',
  actions: [
    { label: 'See file on Commons', action: 'commons', icon: 'logoWikimediaCommons' },
    //{ label: 'Translate to another language', action: 'lang', icon: 'language', flags:['pogressive'] },
    { label: 'Translate another image', action: 'translate', icon: 'image', flags:['pogressive'] },
  ],
} ).closed.then( function ( data ) {
  if ( data && data.action ) {
    if ( data.action === 'translate') {
      window.location = 'index.html';
    } else if (data.action === 'lang') {
      window.location = 'translate.html';
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

  //window.progressField.setLabel( done + ' of ' + window.progressTotal + ' translations')
  window.progress.setProgress( ( ( done * 1.0 ) / window.progressTotal ) * 100);

  return ok;
}

function getN() {
  var done = 0;
  window.textInputs.forEach( function (t) {
    if ( t.getValue() === '') {
      ok = false;
    } else {
      done++;
    }
  });
  return done;
}

function addLangSelector() {
  var fromItems = [
    new OO.ui.MenuOptionWidget( {
      data: 'en',
      label: 'English',
    } ),
  ];

  var from = new OO.ui.DropdownWidget( {
    label: 'Select one',
    menu: { items: fromItems }
  } );

  var toItems = window.getLangs(true);
  toItems.unshift(new OO.ui.MenuSectionOptionWidget({
    label: "Others"
  }))

  JSON.parse(window.localStorage.getItem('langs')).forEach( function (lang) {
    toItems.unshift( new OO.ui.MenuOptionWidget( {
      label: lang.label,
      data: lang.data
    }))
  })

  toItems.unshift(new OO.ui.MenuSectionOptionWidget({
    label: "Preferred languages"
  }))

  var to = new OO.ui.DropdownWidget( {
    label: 'Select one',
    menu: { items: toItems }
  } );


  from.getMenu().selectItemByData( 'en');
  to.getMenu().selectItemByData( 'it');
  window.prevToValue = 'it';
  to.getMenu().on('choose', function (i) {
    if ( getN() > 0 && window.uploaded === false) {
      OO.ui.confirm( 'Switching to another language will lose the '+getN()+' translation(s) you\'ve already made. Are you sure you want to continue?' ).done(function (c) {
        if (c) {
          window.textInputs.forEach( function (t) {
            t.setValue('');
          });
          window.prevToValue = i.data;
        } else {
          to.getMenu().selectItemByData( window.prevToValue )
        }
      });
    } else if ( window.uploaded === true ) {
      window.textInputs.forEach( function (t) {
        t.setValue('');
        window.setTimeout( function() {
          t.setValidityFlag( true );
        }, 500 );
      });
      window.prevToValue = i.data;
    }
  })

  $('#lang-from').append( from.$element );
  $('#lang-to').append( to.$element );

  var toOffset = $('#lang-to').offset();
  window.popup.$element.css( {
    bottom: '',
    top: (toOffset.top - 49) + 'px',
    left: (toOffset.left + 35) + 'px'
  })

}
