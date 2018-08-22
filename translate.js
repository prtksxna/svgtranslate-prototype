var mySVG = document.getElementById("svg_object");
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
}

function addTranslationField( label, id ) {
  var el = window.svgDoc.getElementById( id );
  var text = new OO.ui.TextInputWidget();
  text.on( 'change', function ( v ) {
    if ( v === '') {
      el.innerHTML = label;
    } else {
      el.innerHTML = v;
    }
  });

  var field = new OO.ui.FieldLayout(
    text, {
      label: label
    }
  );

  $( '#translation-form').append( field.$element);
}
