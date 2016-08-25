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

/*Exports*/
module.exports = chatGroupMemberService;