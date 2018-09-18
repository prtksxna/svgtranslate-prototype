// close tutorial
$('.close').on('click', function () {
  $('.tutorial').slideUp();
  window.localStorage.setItem( 'tutorial', 'no' );
})

if ( window.localStorage.getItem( 'tutorial' ) === 'no' ) {
  $('.tutorial').hide();
}

// Select file form
var translateButton = new OO.ui.ButtonWidget( {
  label: 'Translate',
  flags: [ 'primary', 'progressive' ]
} );

translateButton.on( 'click', function () {
    window.location="translate.html"
} );

var form = new OO.ui.ActionFieldLayout(
  new OO.ui.TextInputWidget({
    placeholder: '100 Years War France 1435.svg'
  }),
  translateButton,
  {
    align: 'top',
    label: 'File name from Commons:',
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
  } );

  $lang.on( 'click', function () {
    openLangSettings();
  } );
}

$( '#login' ).on( 'click', function () {
  var menu = $( this ).parent();
  OO.ui.confirm( 'You will be redirected to Commons in order to confirm your indentity. SVG Translate will use this to upload your translations.' ).done( function () {
    window.localStorage.setItem( 'logged', 'in' );
    window.location = window.location.pathname;
    showAccountMenu();
  } );
} );

if ( window.localStorage.getItem( 'logged' ) === 'in' ) {
  showAccountMenu();
}

// Language settings
function SettingsDialog( config ) {
    SettingsDialog.parent.call( this, config );
}
OO.inheritClass( SettingsDialog, OO.ui.ProcessDialog );

SettingsDialog.static.name = 'settingsDialog';
SettingsDialog.static.title = 'Settings';
SettingsDialog.static.actions = [
    { action: 'save', label: 'Done', flags: [ 'primary', 'progressive' ]},
    { label: 'Cancel', flags: 'safe' }
];

SettingsDialog.prototype.initialize = function () {
    SettingsDialog.parent.prototype.initialize.apply( this, arguments );
    this.content = new OO.ui.PanelLayout( { padded: true, expanded: false } );
    this.content.$element.append(
      this.getSettingsElement(),
      '<br><br><br><br><br>'
    );
    this.$body.append( this.content.$element );
};

SettingsDialog.prototype.getSettingsElement = function () {
  // Set default
  if ( window.localStorage.getItem('langs') === null ) {
    var def = [
      {
        data: 'hi',
        label: 'Hindi'
      },
      {
        data: 'en',
        label: 'English'
      }
    ];
    window.localStorage.setItem( 'langs', JSON.stringify( def ) );
  }

  var langSelector = new OO.ui.MenuTagMultiselectWidget( {
    selected: JSON.parse( window.localStorage.getItem( 'langs' ) ),
    options: [
      {
        data: 'hi',
        label: 'Hindi'
      },
      {
        data: 'en',
        label: 'English'
      },
      {
        data: 'ur',
        label: 'Urdu',
      },
      {
        data: 'it',
        label: 'Italian'
      },
      {
        data: 'ja',
        label: 'Japanese'
      }
    ]
  } );

  langSelector.on( 'change', function ( items ) {
    var selected = items.map( function ( item ) {
      return {
        data: item.data,
        label: item.label
      };
    })
    window.localStorage.setItem( 'langs', JSON.stringify(selected ) );
  });

  var toolItems = [
    new OO.ui.MenuOptionWidget( {
      data: 'en',
      label: 'English'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ja',
      label: 'Japanese'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'it',
      label: 'Italian'
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'hi',
      label: 'Hindi',
    } ),
    new OO.ui.MenuOptionWidget( {
      data: 'ur',
      label: 'Urdu'
    } )
  ];

  var toolLang = new OO.ui.DropdownWidget( {
    label: 'Select one',
    menu: { items: toolItems }
  } );

  var field = new OO.ui.FieldLayout(
    langSelector, {
      align: 'top',
      label: 'Preferred languages to translate to/from:',
      help: "These languages are show near the top when you're switching between them in the translate page",
      helpInline: true
    }
  );

  var toolField = new OO.ui.FieldLayout(
    toolLang, {
      align: 'top',
      label: 'Tool\'s language:',
      help: "The tool itself will be shown in this language",
      helpInline: true
    }
  )

  return [ toolField.$element, field.$element ];
}

SettingsDialog.prototype.getActionProcess = function ( action ) {
    var dialog = this;
    if ( action ) {
        return new OO.ui.Process( function () {
            dialog.close( { action: action } );
        } );
    }
    return SettingsDialog.parent.prototype.getActionProcess.call( this, action );
};

var windowManager = new OO.ui.WindowManager();
$( 'body' ).append( windowManager.$element );

var dialog = new SettingsDialog();
windowManager.addWindows( [ dialog ] );

function openLangSettings () {
  windowManager.openWindow( dialog );
}
