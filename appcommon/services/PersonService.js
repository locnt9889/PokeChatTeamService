/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenerateService = require("./GenerateService");
var personService = new GenerateService(Constant.TABLE_NAME_DB.PERSON);

var personDao = require("../daos/PersonDao");

/*Exports*/
module.exports = personService;