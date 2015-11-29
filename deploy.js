var mysql = require("mysql");
var secrets = require("./secrets.js");
var mysqlAccess = secrets.mysqlAccess;

var connection = mysql.createConnection(mysqlAccess);

function executeQueries(qstr, index)
{
    connection.query( qstr[index], function( err, rows, fields ) {
        if ( err ) throw err;
        console.log((index+1)+"/"+qstr.length+" "+answers[index]);
        if(qstr.length-1>index)
        {
            index++;
            executeQueries(qstr, index);
        }
        else
        {
            connection.end();
            console.log("Finish");
        }
    });
} 

var answers = ['Table questions droped',
	'Table questions created',

	'Table answers droped',
	'Table answers created'];

var qstr = [ 'DROP TABLE IF EXISTS questions;',
    'CREATE TABLE questions (' +
    'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
    'q_text varchar( 250 ));', 

	'DROP TABLE IF EXISTS answers;',
    'CREATE TABLE answers (' +
    'id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
    'q_id INT, '+
    'a_text varchar( 250 ));'];

console.log("Try deploy DB");
connection.connect;
executeQueries(qstr, 0);
