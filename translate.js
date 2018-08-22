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

    tspans.forEach( function ( tspan ) {
      if ( tspan === 'hr' ) {
        $( '#translation-form').append( $('<hr>'));
      } else {
        addTranslationField( tspan.innerHTML, tspan.id );
      }
    } );

    addButtons();
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
  });

  window.textInputs.push( text );

  var field = new OO.ui.FieldLayout(
    text, {
      label: label
    }
  );

  $( '#translation-form').append( field.$element);
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

  var upload = new OO.ui.ButtonWidget( {
    label: 'Upload to Commons',
    icon: 'logoWikimediaCommons',
    flags: ['primary', 'progressive']
  } );

  if ( window.localStorage.getItem( 'logged') !== 'in' ) {
      upload.setDisabled( true );
      upload.setLabel( 'Login to Upload to Commons')
  }

  $( '#button-holder').append( upload.$element, download.$element);
}

function validateAll() {
  var ok = true;
  window.textInputs.forEach( function (t) {
    if ( t.getValue() === '') {
      ok = false;
    }
  });
  return ok;
}
