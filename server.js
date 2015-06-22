GoogleSpreadsheet = Npm.require( "google-spreadsheet" );
var path = Npm.require( 'path' );
var Future = Npm.require( path.join( 'fibers', 'future' ) );
Language.language = {};
Language.language.en = {};
Language.settings = {}

var lastupdate = new Date().getTime();
var validKey = function ( key ) {
  if (
    key != "_xml" && key != "id" && key != "title" && key != "_links" && key != "key" && key != "content" && key != "save" && key != "del" && key.charAt( key.length - 1 ) != "m"
  ) {
    return true;
  } else
    return false;
}
var objectValue = function ( key, obj, value, mValue ) {
  key = key.split( "." );
  var local = obj;
  var cKey = null;
  for ( var i = 0, il = key.length; i < il - 1; i++ ) {
    cKey = key[ i ];
    if ( !local[ cKey ] )
      local[ cKey ] = {};
    local = local[ cKey ]
  }
  cKey = key[ key.length - 1 ];
  local[ cKey ] = mValue || value;
}

Language.init = function ( GoogleSpreadsheetId ) {
  var lan = "en";

  Language.language = {};
  Language.language.en = {};
  Language.settings = {};
  var newRecord = {
    // loosely follows "you're known as the type from.."
    from: 'rawGoogleSpreadsheet',
    // the type rawGoogleSpreadsheet strengthens the presence of this particular spreadsheet
    // by pointing to this
    // implement unionize here..
    to: GoogleSpreadsheetId,
    init: new Date().getTime()
  }
  id = W.insert( newRecord );
  console.log( id, 'lastLanugageId init' )
  console.log( W.find( {
    from: 'rawGoogleSpreadsheet'
  } ).fetch().length, 'entries from rawGoogleSpreadsheet in W' )
  try {
    var my_sheet = new GoogleSpreadsheet( GoogleSpreadsheetId );
    // extract rows from the api callback...
    Unionize.journey( "GoogleSpreadsheetInit" );
    my_sheet.getRows( 1, bindFunction );

  } catch ( Error ) {
    console.log( Error )
      // fut.return({});
  }
}
var updateLastLanguageCall = function ( row_data ) {
  lastLangugageIdSort = W.find( {
    from: 'rawGoogleSpreadsheet'
  }, {
    sort: {
      $natural: 1
    },
    limit: 1
  } ).fetch()[ 0 ]._id;

  //lastLangugageIdSort.apiPayload = row_data
  console.log( 'lastLanugageId', lastLangugageIdSort );

  W.update( {
    _id: lastLangugageIdSort
  }, {
    $set: {
      apiPayload: row_data
    }
  } );

  console.log( W.findOne( {
    _id: lastLangugageIdSort
  } ).apiPayload.length, 'updated apiPayload.length' )

}
var bindFunction = Meteor.bindEnvironment( function ( err, row_data ) {
  var myLanguage = {};
  var gkey = null;
  if ( row_data ) {
    Unionize.journey( "GoogleSpreadsheetCallbackWithData" );
    //console.log( 'pulled in ' + row_data.length + ' rows ' )
    updateLastLanguageCall( row_data )


    function driveItOldSchool( row_data ) {
      for ( var i = 0, il = row_data.length; i < il; i++ ) {
        gkey = row_data[ i ][ "key" ];
        for ( var key in row_data[ i ] ) {
          if ( validKey( key ) ) {
            if ( !myLanguage[ key ] )
              myLanguage[ key ] = {};
            objectValue( gkey, myLanguage[ key ], row_data[ i ][ key ], row_data[ i ][ key + "m" ] );
          }
        }
      }
      for ( var key in myLanguage ) {
        myLanguage[ key ]._id = key;
        Language.beforeInsert( myLanguage[ key ] );
      }
    }
    if ( typeof app.drivingItOldSchool != 'undefined' ) {
      // my idea of a flag..
      try {
        drove = driveItOldSchool( row_data )
      } catch ( e ) {

      } finally {

      }

    }
  }
} );
