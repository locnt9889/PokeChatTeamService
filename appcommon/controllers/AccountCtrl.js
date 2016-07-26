/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var CodeStatus = require("../helpers/CodeStatus");
var Constant = require("../helpers/Constant");

var logger = require("../helpers/LoggerService");

var Account = require("../models/Account");
var AccountDevices = require("../models/AccountDevices");

var accountService = require("../services/AccountService");
var accountDevicesService = require("../services/AccountDevicesService");


/* POST Register */
router.post('/register', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";

    if(checkValidateUtil.isEmptyFeild(email) || !checkValidateUtil.checkValidateEmail(email)){
        logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_INCORRECT);
        res.json(responseObj);
        return;
    }

    if(checkValidateUtil.isEmptyFeild(password) || !checkValidateUtil.checkLengthPassword(password)){
        logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT);
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL] = email;

    accountService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED);
            res.json(responseObj);
            return;
        }

        var account = new Account();
        account.email = email;
        account.password = serviceUtil.md5Encode(password);
        accountService.create(account).then(function(result){
            responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
            account.password = "******";
            account.accountId = result.insertId;
            responseObj.results = result;
            res.json(responseObj);
        }, function(error){
            logger.error(JSON.stringify(error));
            responseObj = serviceUtil.generateObjectError(responseObj, error);
            res.json(responseObj);
        });
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

/* POST check email exists */
router.post('/checkEmailExists', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";

    if(checkValidateUtil.isEmptyFeild(email) || !checkValidateUtil.checkValidateEmail(email)){
        logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_INCORRECT);
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL] = email;

    var dataRes = {
        isEmailExist : false
    }
    accountService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            dataRes.isEmailExist = true;
        }

        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = dataRes;
        res.json(responseObj);
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

/* POST login with email */
router.post('/loginEmail', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";
    var deviceToken = req.body.deviceToken ? req.body.deviceToken : "";
    var deviceType = req.body.deviceType ? req.body.deviceType : "";

    if(checkValidateUtil.isEmptyFeild(email) || !checkValidateUtil.checkValidateEmail(email)){
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.EMAIL_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.EMAIL_INCORRECT);
        res.json(responseObj);
        return;
    }

    if(checkValidateUtil.isEmptyFeild(password) || checkValidateUtil.isEmptyFeild(deviceToken) || checkValidateUtil.isEmptyFeild(deviceType)){
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.EMPTY_FIELD_REQUIRE.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.EMPTY_FIELD_REQUIRE);
        res.json(responseObj);
        return;
    }

    if(deviceType != Constant.DEVICE_TYPE.IOS && deviceType != Constant.DEVICE_TYPE.ANDROID && deviceType != Constant.DEVICE_TYPE.WINDOW_PHONE){
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.DEVICE_TYPE_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.DEVICE_TYPE_INCORRECT);
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL] = email;
    objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_PASSWORD] = serviceUtil.md5Encode(password);

    accountService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            var accountDevices = new AccountDevices();
            accountDevices.accountId = resultSearch[0].accountId;
            accountDevices.deviceToken = deviceToken;
            accountDevices.deviceType = deviceType;

            var accessToken = serviceUtil.generateAccessToken();
            accountDevices.accessToken = accessToken;

            accountDevicesService.create(accountDevices).then(function(resultCreate){
                responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                accessToken.id = resultCreate.insertId;
                responseObj.results = accountDevices;
                res.json(responseObj);
            }, function(error){
                logger.error(JSON.stringify(error));
                responseObj = serviceUtil.generateObjectError(responseObj, error);
                res.json(responseObj);
            });
        }else{
            logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FAILURE.message);
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FAILURE);
            res.json(responseObj);
        }
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });

}]);

/* POST login with email */
router.post('/loginByFB', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var facebookToken = req.body.facebookToken ? req.body.facebookToken : "";
    var deviceToken = req.body.deviceToken ? req.body.deviceToken : "";
    var deviceType = req.body.deviceType ? req.body.deviceType : "";

    if(checkValidateUtil.isEmptyFeild(facebookToken) && checkValidateUtil.isEmptyFeild(deviceToken) && checkValidateUtil.isEmptyFeild(deviceType)){
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.EMPTY_FIELD_REQUIRE.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.EMPTY_FIELD_REQUIRE);
        res.json(responseObj);
        return;
    }

    if(deviceType != Constant.DEVICE_TYPE.IOS && deviceType != Constant.DEVICE_TYPE.ANDROID && deviceType != Constant.DEVICE_TYPE.WINDOW_PHONE){
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.DEVICE_TYPE_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LOGIN.DEVICE_TYPE_INCORRECT);
        res.json(responseObj);
        return;
    }

    //facebookToken = "EAAXMdUm5zJcBAIcZA2hrRCq3EBe7faQVr4An6c188dpgQ1hD6s6B65FZBQwZCy65yVi8JECJh8gx7makllZBLPd67nhuZCsQagj4YrJiuZBKZCUVQCNfbX15XEljJjE4VJUyv1GCw4xaZAXQIKZBLT77Sp4ofCf5jTCHYWDPOKHx7twZDZD";

    var optionsget = Constant.GET_INFO_FB.OPTIONS_GET_INFO_FB;
    optionsget.path = optionsget.path.replace("#TokenFB", facebookToken);

    // do the GET request
    var reqGet = https.request(optionsget, function(response) {
        var decoder = new StringDecoder('utf8');
        var text = "";

        response.on('data', function(data) {
            text += decoder.write(data);
        });

        response.on('end', function() {
            var jsonObj = {};
            try {
                jsonObj = JSON.parse(text);
            }catch(e){
                logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message);
                responseObj = serviceUtil.generateObjectError(responseObj, e, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.code);
                res.send(responseObj);
                return;
            }

            //response error
            if(jsonObj.error){
                logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message);
                responseObj = serviceUtil.generateObjectError(responseObj, jsonObj.error, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.code);
                res.send(responseObj);
                return;
            }

            var facebookId = jsonObj.id;
            var objectSearch = {};
            objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_FACEBOOKID] = facebookId;

            var accessToken = serviceUtil.generateAccessToken();
            var accountDevice = new AccountDevices();
            accountDevice.deviceToken = deviceToken;
            accountDevice.deviceType = deviceType;
            accountDevice.accessToken = accessToken;

            var addAccessToken = function(){
                accountDevicesService.create(accountDevice).then(function(resultCreate){
                    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                    accessToken.id = resultCreate.insertId;
                    responseObj.results = accountDevice;
                    res.json(responseObj);
                }, function(error){
                    logger.error(JSON.stringify(error));
                    responseObj = serviceUtil.generateObjectError(responseObj, error);
                    res.json(responseObj);
                });
            }

            accountService.searchBase(objectSearch).then(function(resultSearch){
                if(!resultSearch || resultSearch.length == 0){
                    var account = new Account();
                    account.fullname = jsonObj.name;
                    account.birthday = jsonObj.birthday;
                    account.gender = jsonObj.gender.toUpperCase();
                    account.avatarImage = Constant.GET_INFO_FB.USER_FB_AVATAR_LINK.replace("#fbID", jsonObj.id);
                    account.isActive = true;
                    account.facebookId = jsonObj.id;
                    account.facebookEmail = jsonObj.email;
                    account.facebookToken = facebookToken;

                    accountService.create(account).then(function(resultCreateAccount){

                        accountDevice.accountId = resultCreateAccount.insertId;
                        addAccessToken();

                    }, function(error){
                        logger.error(JSON.stringify(error));
                        responseObj = serviceUtil.generateObjectError(responseObj, error);
                        res.json(responseObj);
                    });

                }else{
                    var account = resultSearch[0];
                    accountDevice.accountId = account.accountId;
                    addAccessToken();
                }
            }, function(err){
                
                responseObj = serviceUtil.generateObjectError(responseObj,err);
                res.send(responseObj);
            });

        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        logger.error(CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message);
        responseObj = serviceUtil.generateObjectError(responseObj, e, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.message, CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS.code);
        res.send(responseObj);
    });
}]);

module.exports = router;
