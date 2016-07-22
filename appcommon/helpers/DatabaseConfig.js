/**
 * Created by LocNT on 7/28/15.
 */

var mysql     =    require('mysql');

//localhost for disploy
//var DB_CONFIG = {
//    connectionLimit : 100, //important
//    host : 'localhost',
//    user : 'root',
//    port : '3306',
//    password : '123456',
//    database : 'poke_team_chat_db',
//    debug    :  false
//};

//server for disploy
var DB_CONFIG = {
    connectionLimit : 100, //important
    host : 'localhost',
    user : 'root',
    port : '3306',
    password : 'Chomoi2015',
    database : 'poke_team_chat_db',
    debug    :  false
};

exports.pool = mysql.createPool(DB_CONFIG);