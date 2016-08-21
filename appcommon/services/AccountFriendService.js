/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountFriendDao = require("../daos/AccountFriendDao");
var Account = require("../models/Account");
var accountFriendService = new GenericService(accountFriendDao);

accountFriendService.deletePairNoFriend = function(accountId, friendId){
    return accountFriendDao.deletePairNoFriend(accountId, friendId);
}

accountFriendService.updateFriendStatus = function(accountId, friendId, status){
    return accountFriendDao.updateFriendStatus(accountId, friendId, status);
}

accountFriendService.getFriendList = function(accountId, friendStatus){
    var statusQuery = undefined;
    var selectList = "";
    var accountObj = new Account();
    delete accountObj.password;

    if(friendStatus != Constant.FRIEND_STATUS.ALL){
        statusQuery = " AND af.friendStatus = '" + friendStatus + "'";
    }

    var keyList = Object.keys(accountObj);
    for(var i = 0; i < keyList.length; i++){
        keyList[i] = "ac." + keyList[i];
    }

    selectList = keyList.join();

    return accountFriendDao.getFriendList(accountId, selectList, statusQuery);
}

/*Exports*/
module.exports = accountFriendService;