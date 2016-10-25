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

var accessTokenService = require("../services/AccessTokenService");
var groupChatMessageService = require("../services/GroupChatMessageService");
var Q = require("q");

/* get test chat */
router.get('/test', [function(req, res, next) {
    res.sendFile(Constant.FOLDER_ROOT + "/public/" + 'TestChat.html');
}]);

var getMessageListByGroup = function(groupUuid, added, perPage, pageNum, responseObj, res){
    groupChatMessageService.getMessageByGroup(groupUuid, added, perPage, pageNum).then(function (dataMessage) {
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = dataMessage;
        res.json(responseObj);
    }, function (err) {
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    });
}

var getMessageListBy2User = function(accountId, friendId, added, perPage, pageNum, responseObj, res){
    groupChatMessageService.getMessageBy2User(accountId, friendId, added, perPage, pageNum).then(function (dataMessage) {
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = dataMessage;
        res.json(responseObj);
    }, function (err) {
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    });
}

/* get getMessageByGroup */
router.post('/getMessageByGroup', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var groupUuid = req.body.groupUuid ? req.body.groupUuid : "";
    var lastMessageUuid = req.body.lastMessageUuid ? req.body.lastMessageUuid : "";
    var perPage = req.body.perPage && !isNaN(req.body.perPage)? parseInt(req.body.perPage) : 10;
    var pageNum = 1;

    if(lastMessageUuid != "") {
        var objectSearch = {};
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_UUID] = lastMessageUuid;
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_UUID_GROUP] = groupUuid;
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_ACTIVE] = true;

        groupChatMessageService.searchBase(objectSearch).then(function (resultSearch) {
            if (resultSearch.length == 0) {
                logger.error(CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID);
                res.json(responseObj);
                return;
            } else {
                var lastMessage = resultSearch[0];

                getMessageListByGroup(groupUuid, new Date(lastMessage.added), perPage, pageNum, responseObj, res);
            }
        }, function (error) {
            logger.error(JSON.stringify(error));
            responseObj = serviceUtil.generateObjectError(responseObj, error);
            res.json(responseObj);
        });
    }else{
        getMessageListByGroup(groupUuid, new Date(), perPage, pageNum, responseObj, res);
    }
}]);

/* get getMessageByGroup */
router.post('/getMessageBy2User', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;
    var friendId = req.body.friendId ? req.body.friendId : 0;

    if(friendId <= 0){
        logger.error(CodeStatus.CHAT_ACTION.FRIEND_INVALID.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.CHAT_ACTION.FRIEND_INVALID);
        res.json(responseObj);

        return;
    }

    var lastMessageUuid = req.body.lastMessageUuid ? req.body.lastMessageUuid : "";
    var perPage = req.body.perPage && !isNaN(req.body.perPage)? parseInt(req.body.perPage) : 10;
    var pageNum = 1;

    if(lastMessageUuid != "") {
        var objectSearch = {};
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_UUID] = lastMessageUuid;
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_UUID_GROUP] = groupUuid;
        objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_ACTIVE] = true;

        groupChatMessageService.searchBase(objectSearch).then(function (resultSearch) {
            if (resultSearch.length == 0) {
                logger.error(CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID);
                res.json(responseObj);
                return;
            } else {
                var lastMessage = resultSearch[0];

                getMessageListBy2User(accountId,friendId, new Date(lastMessage.added), perPage, pageNum, responseObj, res);
            }
        }, function (error) {
            logger.error(JSON.stringify(error));
            responseObj = serviceUtil.generateObjectError(responseObj, error);
            res.json(responseObj);
        });
    }else{
        getMessageListBy2User(accountId,friendId, new Date(), perPage, pageNum, responseObj, res);
    }
}]);

/* get getMessageByGroup */
router.post('/deleteMessage', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;

    var messageUuid = req.body.messageUuid ? req.body.messageUuid : "";

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_UUID] = messageUuid;
    objectSearch[Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE.NAME_FIELD_ACTIVE] = true;

    groupChatMessageService.searchBase(objectSearch).then(function (resultSearch) {
        if (resultSearch.length == 0) {
            logger.error(CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.CHAT_ACTION.MESSAGE_UUID_INVALID);
            res.json(responseObj);
            return;
        } else {
            var deleteMessage = resultSearch[0];
            if(deleteMessage.accountId == accountId){
                groupChatMessageService.remove(deleteMessage.id).then(function (dataMessage) {
                    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                    responseObj.results = dataMessage;
                    res.json(responseObj);
                }, function (err) {
                    logger.error(JSON.stringify(err));
                    responseObj = serviceUtil.generateObjectError(responseObj, err);
                    res.json(responseObj);
                });
            }else{
                logger.error(CodeStatus.CHAT_ACTION.IS_NOT_OWNER_MESSAGE.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.CHAT_ACTION.IS_NOT_OWNER_MESSAGE);
                res.json(responseObj);
                return;
            }
        }
    }, function (error) {
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });
}]);

module.exports = router;
