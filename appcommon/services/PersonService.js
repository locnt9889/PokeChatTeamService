/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var personDao = require("../daos/PersonDao");

var personService = new GenericService(personDao);

/*Exports*/
module.exports = personService;