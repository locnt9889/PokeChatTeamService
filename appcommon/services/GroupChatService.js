/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var chatGroupDao = require("../daos/ChatGroupDao");
var chatGroupService = new GenericService(chatGroupDao);

/*Exports*/
module.exports = chatGroupService;