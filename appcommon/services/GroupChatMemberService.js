/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var chatGroupMemberDao = require("../daos/ChatGroupMemberDao");
var chatGroupMemberService = new GenericService(chatGroupMemberDao);

var ChatGroupMember = require("../models/ChatGroupMember");

chatGroupMemberService.addMultiNewMember = function(chatGroup, memberListId){
    if(memberListId == ""){
        return;
    }else{
        var memberIds = memberListId.split(",");
        for(var i = 0; i < memberIds.length; i++){
            var id = parseInt(memberIds[i]);
            if(id > 0 && id != chatGroup.createdUserId){
                var chatGroupMember = new ChatGroupMember();
                chatGroupMember.accountId = id;
                chatGroupMember.groupUuid = chatGroup.uuid;
                chatGroupMemberService.create(chatGroupMember);
            }
        }
    }
}

chatGroupMemberService.getListGroup = function(accountId){
    var deferred = Q.defer();

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_CREATED_USER_ID] = accountId;

    chatGroupMemberService.getListMemberOfGroup(uuid).then(function(data){
        if(data && data.length > 0){
            for(var i = 0; i < data.length; i++){
                data[i].password = "******";
            }
        }

        deferred.resolve(data);
    }, function(err){
        logger.error(JSON.stringify(err));
        deferred.reject(err);
        return;
    })

    return deferred.promise;
}

chatGroupMemberService.getListMemberOfGroup = function(uuid){
    return chatGroupMemberDao.getListMemberOfGroup(uuid);
}

chatGroupMemberService.getListGroupByMember = function(accountId){
    return chatGroupMemberDao.getListGroupByMember(accountId);
}

/*Exports*/
module.exports = chatGroupMemberService;