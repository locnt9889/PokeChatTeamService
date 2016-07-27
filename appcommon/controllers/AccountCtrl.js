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

var Account = require("../models/Account");
var AccountPhoneContact = require("../models/AccountPhoneContact");

var AccountDevices = require("../models/AccountDevices");

var accountService = require("../services/AccountService");
var accessTokenService = require("../services/AccessTokenService");
var accountsPhoneContactService = require("../services/AccountsPhoneContactService");

/* POST Register */
router.post('/register', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";
    var fullname = req.body.fullname ? req.body.fullname : "";

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

    if(checkValidateUtil.isEmptyFeild(fullname)){
        logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.FULLNAME_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.REGISTER.FULLNAME_EMPTY);
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
            var account = resultSearch[0];
            var accountDevices = new AccountDevices();
            accountDevices.accountId = account.accountId;
            accountDevices.deviceToken = deviceToken;
            accountDevices.deviceType = deviceType;

            var accessToken = serviceUtil.generateAccessToken();
            accountDevices.accessToken = accessToken;

            accessTokenService.create(accountDevices).then(function(resultCreate){
                responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                accountDevices.id = resultCreate.insertId;
                account.accountDevices = accountDevices;
                responseObj.results = account;
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

    accountService.getInfoFacebookToken(facebookToken).then(function(jsonObj){
        var facebookId = jsonObj.id;
        var objectSearch = {};
        objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_FACEBOOKID] = facebookId;

        var accessToken = serviceUtil.generateAccessToken();
        var accountDevice = new AccountDevices();
        accountDevice.deviceToken = deviceToken;
        accountDevice.deviceType = deviceType;
        accountDevice.accessToken = accessToken;

        accountService.searchBase(objectSearch).then(function(resultSearch){
            if(!resultSearch || resultSearch.length == 0){
                var account = new Account();
                account.fullname = jsonObj.name? jsonObj.name : "";
                account.birthday = jsonObj.birthday ? new Date(jsonObj.birthday) : account.birthday;
                account.gender = jsonObj.gender ? jsonObj.gender.toUpperCase() : "";
                account.avatarImage = Constant.GET_INFO_FB.USER_FB_AVATAR_LINK.replace("#fbID", jsonObj.id);
                account.isActive = true;
                account.facebookId = jsonObj.id;
                account.facebookEmail = jsonObj.email ? jsonObj.email : "";
                account.facebookToken = facebookToken;

                accountService.create(account).then(function(resultCreateAccount){
                    account.accessToken = accessToken;
                    account.accountId = resultCreateAccount.insertId;
                    accountDevice.accountId = resultCreateAccount.insertId;
                    account.accountDevice = accountDevice;
                    accountService.addAccessToken(res, account, responseObj);

                }, function(error){
                    logger.error(JSON.stringify(error));
                    responseObj = serviceUtil.generateObjectError(responseObj, error);
                    res.json(responseObj);
                });

            }else{
                var account = resultSearch[0];
                accountDevice.accountId = account.accountId;
                account.accountDevice = accountDevice;
                accountService.addAccessToken(res, account, responseObj);
            }
        }, function(err){
            logger.error(JSON.stringify(err));
            responseObj = serviceUtil.generateObjectError(responseObj,err);
            res.send(responseObj);
        });
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    })
}]);

/* POST get user-detail */
router.post('/getMyAccount', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
    responseObj.results = accessTokenObj;
    res.json(responseObj);
}]);

/* POST sync data contact */
router.post('/syncPhoneContact', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    var dataSync = req.body.dataSync ? req.body.dataSync : "";

    if(checkValidateUtil.isEmptyFeild(dataSync)){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.errorsMessage = CodeStatus.ACCOUNT_ACTION.PHONE_CONTACT.DATA_SYNC_EMPTY.message;
        res.json(responseObj);
        return;
    }

    accountsPhoneContactService.removeAllContactPhone(accessTokenObj.accountId).then(function(dataRemove){
        var dataArray = dataSync.split(",");
        for(var i = 0; i < dataArray.length; i++){
            var accountPhoneContact = new AccountPhoneContact();
            accountPhoneContact.value = dataArray[i];
            accountPhoneContact.accountId = accessTokenObj.accountId;
            accountsPhoneContactService.create(accountPhoneContact).then(function(result){
                logger.info("add phone contact success : " + result.insertId);
            }, function(err){
                logger.error(JSON.stringify(err));
            });
        }

        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = dataArray;
        res.json(responseObj);
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    });
}]);

module.exports = router;
