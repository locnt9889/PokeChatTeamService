/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenerateService = require("./GenerateService");
var personDao = require("../daos/PersonDao");

var personService = new GenerateService(personDao);

/*Exports*/
module.exports = personService;