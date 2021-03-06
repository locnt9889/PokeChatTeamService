/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var CodeStatus = require("../helpers/CodeStatus");
var Constant = require("../helpers/Constant");

var logger = require("../helpers/LoggerService");

var ChatGroup = require("../models/ChatGroup");
var ChatGroupMember = require("../models/ChatGroupMember");
var ChatGroupMessage = require("../models/ChatGroupMessage");

var groupChatService = require("../services/GroupChatService");
var accessTokenService = require("../services/AccessTokenService");
var groupChatMemberService = require("../services/GroupChatMemberService");
var groupChatMessageService = require("../services/GroupChatMessageService");
var accountService = require("../services/AccountService");

var uploadFileHelper = require("../helpers/UploadFileHelper");
var Q = require("q");

/* POST create */
router.post('/create', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    var groupName = req.body.groupName ? req.body.groupName : "";
    var listMemberId = req.body.listMemberId ? req.body.listMemberId : "";

    if(checkValidateUtil.isEmptyFeild(groupUuid)){
        logger.error(CodeStatus.GROUP_ACTION.CREATE.UUID_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.CREATE.UUID_EMPTY);
        res.json(responseObj);
        return;
    }

    if(checkValidateUtil.isEmptyFeild(groupName)){
        logger.error(CodeStatus.GROUP_ACTION.CREATE.FULLNAME_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.CREATE.FULLNAME_EMPTY);
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_UUID] = groupUuid;
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;

    groupChatService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            var chatGroup = resultSearch[0];
            if(chatGroup.createdUserId == accountId){
                chatGroup.groupName = groupName;
                groupChatService.update(chatGroup.id, chatGroup).then(function(dataUpdate){
                    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                    responseObj.results = chatGroup;
                    res.json(responseObj);

                    //add new member
                    groupChatMemberService.addMultiNewMember(chatGroup, listMemberId);
                }, function(err){
                    logger.error(JSON.stringify(err));
                    responseObj = serviceUtil.generateObjectError(responseObj, err);
                    res.json(responseObj);
                });
            }else{
                logger.error(CodeStatus.GROUP_ACTION.CREATE.DO_NOT_PERMISSION.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.CREATE.DO_NOT_PERMISSION);
                res.json(responseObj);
                return;
            }
        }else{
            var chatGroup = new ChatGroup();
            chatGroup.uuid = groupUuid;
            chatGroup.groupName = groupName;
            chatGroup.createdUserId = accountId;
            groupChatService.create(chatGroup).then(function(dataCreate){
                responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                chatGroup.id = dataCreate.insertId;
                responseObj.results = chatGroup;
                res.json(responseObj);

                //add new member
                groupChatMemberService.addMultiNewMember(chatGroup, listMemberId);
            }, function(err){
                logger.error(JSON.stringify(err));
                responseObj = serviceUtil.generateObjectError(responseObj, err);
                res.json(responseObj);
            });
        }
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

/* POST create */
router.post('/addMember', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    var listMemberId = req.body.listMemberId ? req.body.listMemberId : "";

    if(checkValidateUtil.isEmptyFeild(groupUuid)){
        logger.error(CodeStatus.GROUP_ACTION.CREATE.UUID_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.CREATE.UUID_EMPTY);
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_UUID] = groupUuid;
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;

    groupChatService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            var chatGroup = resultSearch[0];
            groupChatMemberService.addMultiNewMember(chatGroup, listMemberId);

            responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
            responseObj.results = {};
            res.json(responseObj);
        }else{
            logger.error(CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID);
            res.json(responseObj);
            return;
        }
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

/* POST create */
router.post('/getGroup', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    if(groupUuid != "") {
        var objectSearch = {};
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_UUID] = groupUuid;
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;

        groupChatService.searchBase(objectSearch).then(function (resultSearch) {
            if (resultSearch.length == 0) {
                logger.error(CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID);
                res.json(responseObj);
                return;
            } else {
                var groupChat = resultSearch[0];
                groupChatMemberService.getListMemberOfGroup(groupChat.uuid).then(function (dataMember) {
                    var objectOwnerSearch = {};
                    objectOwnerSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_ID] = groupChat.createdUserId;
                    objectOwnerSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_ACTIVE] = true;
                    accountService.searchBase(objectOwnerSearch).then(function (resultOwnerSearch) {
                        dataMember.push.apply(dataMember, resultOwnerSearch);
                        if(dataMember && dataMember.length > 0){
                            for(var i = 0; i < dataMember.length; i++){
                                dataMember[i].password = "******";
                            }
                        }
                        groupChat.members = dataMember;
                        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                        responseObj.results = groupChat;
                        res.json(responseObj);
                    }, function (error) {
                        logger.error(JSON.stringify(error));
                        responseObj = serviceUtil.generateObjectError(responseObj, error);
                        res.json(responseObj);
                    });
                }, function (err) {
                    logger.error(JSON.stringify(error));
                    responseObj = serviceUtil.generateObjectError(responseObj, error);
                    res.json(responseObj);
                });
            }
        }, function (error) {
            logger.error(JSON.stringify(error));
            responseObj = serviceUtil.generateObjectError(responseObj, error);
            res.json(responseObj);
        });
    }else{
        groupChatMemberService.getListGroupByMember(accountId).then(function (dataGroup) {
            var objectOwnerSearch = {};
            objectOwnerSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_CREATED_USER_ID] = accountId;
            objectOwnerSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;
            groupChatService.searchBase(objectOwnerSearch).then(function (resultOwnerSearch) {
                dataGroup.push.apply(dataGroup, resultOwnerSearch);
                responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                responseObj.results = dataGroup;
                res.json(responseObj);
            }, function (error) {
                logger.error(JSON.stringify(error));
                responseObj = serviceUtil.generateObjectError(responseObj, error);
                res.json(responseObj);
            });
        }, function (err) {
            logger.error(JSON.stringify(error));
            responseObj = serviceUtil.generateObjectError(responseObj, error);
            res.json(responseObj);
        });
    }
}]);

/* POST out group */
router.post('/outGroup', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_UUID] = groupUuid;
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP.NAME_FIELD_ACTIVE] = true;

    groupChatService.searchBase(objectSearch).then(function (resultSearch) {
        if (resultSearch.length == 0) {
            logger.error(CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.UUID_GROUP_INVALID);
            res.json(responseObj);
            return;
        } else {
            var groupChat = resultSearch[0];
            var objectSearchMember = {};
            objectSearchMember[Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER.NAME_FIELD_UUID_GROUP] = groupChat.uuid;
            objectSearchMember[Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER.NAME_FIELD_ACCOUNTID] = accountId;
            groupChatMemberService.searchBase(objectSearchMember).then(function (dataMember) {
                if(dataMember.length == 0){
                    logger.error(CodeStatus.GROUP_ACTION.SEARCH.GROUP_MEMBER_INVALID.message);
                    responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.GROUP_MEMBER_INVALID);
                    res.json(responseObj);
                    return;
                }else{
                    groupChatMemberService.remove(dataMember[0].id).then(function (dataDelete) {
                        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                        responseObj.results = dataDelete;
                        res.json(responseObj);
                    }, function (error) {
                        logger.error(JSON.stringify(error));
                        responseObj = serviceUtil.generateObjectError(responseObj, error);
                        res.json(responseObj);
                    });
                }
            }, function (err) {
                logger.error(JSON.stringify(error));
                responseObj = serviceUtil.generateObjectError(responseObj, error);
                res.json(responseObj);
            });
        }
    }, function (error) {
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });
}]);

/* POST out group */
router.post('/updateInfoInGroup', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    var isShowGps = req.body.isShowGps;

    if(isShowGps == undefined){
        logger.error(CodeStatus.GROUP_ACTION.SEARCH.GPS_INFO_UPDATE_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.GPS_INFO_UPDATE_EMPTY);
        res.json(responseObj);
        return;
    }

    var objectSearchMember = {};
    objectSearchMember[Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER.NAME_FIELD_UUID_GROUP] = groupUuid;
    objectSearchMember[Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER.NAME_FIELD_ACCOUNTID] = accountId;
    groupChatMemberService.searchBase(objectSearchMember).then(function (dataMember) {
        if(dataMember.length == 0){
            logger.error(CodeStatus.GROUP_ACTION.SEARCH.GROUP_MEMBER_INVALID.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.GROUP_ACTION.SEARCH.GROUP_MEMBER_INVALID);
            res.json(responseObj);
            return;
        }else{
            var groupMember = dataMember[0];
            groupMember[Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER.NAME_FIELD_SHOW_GPS] = isShowGps ? true : false;
            groupChatMemberService.update(groupMember.id, groupMember).then(function (dataUpdate) {
                responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                responseObj.results = groupMember;
                res.json(responseObj);
            }, function (error) {
                logger.error(JSON.stringify(error));
                responseObj = serviceUtil.generateObjectError(responseObj, error);
                res.json(responseObj);
            });
        }
    }, function (err) {
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

module.exports = router;
