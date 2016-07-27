/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountPhoneContactDao = require("../daos/AccountPhoneContactDao");
var accountsPhoneContactService = new GenericService(accountPhoneContactDao);

accountsPhoneContactService.removeAllContactPhone = function(accountId){
    return accountPhoneContactDao.removeAllPhoneContact(accountId);
}

/*Exports*/
module.exports = accountsPhoneContactService;