var mysql = require("mysql");

console.log("Try deploy DB");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '28061984',
    database : 'node'
});

var qstr = [ 'DROP TABLE  if EXISTS questions;',
    'create table questions ( ' +
    'id Int not null Primary key auto_increment, ' +
    'q_text varchar( 250 ) )' ];

connection.query( qstr[ 0 ], function( err, rows, fields ) {
    if ( err ) throw err;
    console.log("table questions created");
    connection.query( qstr[ 1 ], function( err, rows, fields ) {
        if ( err ) throw err;
        console.log("table questions created");
        connection.end();
    });
} );

console.log( "Finish" );