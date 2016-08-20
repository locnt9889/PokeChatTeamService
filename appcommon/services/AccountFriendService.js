/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountFriendDao = require("../daos/AccountFriendDao");
var accountFriendService = new GenericService(accountFriendDao);

accountFriendService.deletePairNoFriend = function(accountId, friendId){
    return accountFriendDao.deletePairNoFriend(accountId, friendId);
}

accountFriendService.updateFriendStatus = function(accountId, friendId, status){
    return accountFriendDao.updateFriendStatus(accountId, friendId, status);
}

/*Exports*/
module.exports = accountFriendService;