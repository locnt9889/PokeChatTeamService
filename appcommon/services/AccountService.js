/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenerateService = require("./GenerateService");
var accountDao = require("../daos/AccountDao");
var accountService = new GenerateService(accountDao);

/*Exports*/
module.exports = accountService;