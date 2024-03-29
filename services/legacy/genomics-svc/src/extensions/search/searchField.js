( function ( exports ) {

"use strict";

var error = require( __base + 'error' );

async function listSearchHistory ( context )
{

    var result = await context.connection.executeQuery(
        "SELECT \"SearchTerm\" FROM \"hc.hph.genomics.db.models::VariantBrowser.SearchHistory\" WHERE \"UserName\" = SESSION_CONTEXT('XS_APPLICATIONUSER') ORDER BY \"Rank\" DESC"
    );
    
    var listResult = [];
    var listRow;
    var listRowIndex;
    
    for ( listRowIndex in result )
    {
        listRow = result[ listRowIndex ];
        listResult.push( { searchTerm: listRow.SearchTerm } );
    }
    return  {terms: listResult};
}

async function saveSearchHistory ( context, parameters )
{
    if ( ! parameters.query )
    {
        throw new error.BioInfError( "error.MissingRequestParameter", [ "searchTerm" ] );
    }

    await context.connection.executeUpdate(
        'UPSERT "hc.hph.genomics.db.models::VariantBrowser.SearchHistory" ( "SearchTerm", "UserName", "Rank" ) VALUES ( ?, SESSION_CONTEXT(\'XS_APPLICATIONUSER\'), (Select count(*)+1 FROM "hc.hph.genomics.db.models::VariantBrowser.SearchHistory"))  WITH PRIMARY KEY',
        parameters.query
    );
    await context.connection.executeUpdate(
        'UPDATE A SET "Rank"= B."Rank" FROM (SELECT "SearchTerm", "UserName", RANK()  OVER  (order by "Rank" ) AS "Rank" FROM "hc.hph.genomics.db.models::VariantBrowser.SearchHistory" ) as B, "hc.hph.genomics.db.models::VariantBrowser.SearchHistory" A WHERE A."UserName" = SESSION_CONTEXT(\'XS_APPLICATIONUSER\') AND  A."SearchTerm" = B."SearchTerm" AND    A."UserName" = B."UserName"'
    );
    await context.connection.commit();
}

// public API - everything in exports will be accessible from other libraries, everything in exports.api will be available from /hc/hph/genomics/services/ (get.xsjs) endpoint

exports.api = {
    listSearchHistory: listSearchHistory,
    saveSearchHistory: saveSearchHistory
};

} )( module.exports );
