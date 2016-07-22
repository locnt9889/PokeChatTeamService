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

var accountService = require("../services/AccountService");
var Account = require("../models/Account");
var logger = require("../helpers/LoggerService");


/* POST Register */
router.post('/register', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";
    var password = req.body.password ? req.body.password : "";

    if(checkValidateUtil.isEmptyFeild(email) || !checkValidateUtil.checkValidateEmail(email)){
        logger.error(CodeStatus.EMAIL.EMAIL_INCORRECT.message);
        responseObj.statusErrorCode = CodeStatus.EMAIL.EMAIL_INCORRECT.code;
        responseObj.errorsObject = CodeStatus.EMAIL.EMAIL_INCORRECT;
        responseObj.errorsMessage = CodeStatus.EMAIL.EMAIL_INCORRECT.message;
        res.json(responseObj);
        return;
    }

    if(checkValidateUtil.isEmptyFeild(password) || !checkValidateUtil.checkLengthPassword(password)){
        logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT.message);
        responseObj.statusErrorCode = CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT.code;
        responseObj.errorsObject = CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT;
        responseObj.errorsMessage = CodeStatus.ACCOUNT_ACTION.REGISTER.PASSWORD_INCORRECT.message;
        res.json(responseObj);
        return;
    }

    var objectSearch = {};
    objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL] = email;

    accountService.searchBase(objectSearch).then(function(resultSearch){
        if(resultSearch && resultSearch.length > 0){
            logger.error(CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED.message);
            responseObj.statusErrorCode = CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED.code;
            responseObj.errorsObject = CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED;
            responseObj.errorsMessage = CodeStatus.ACCOUNT_ACTION.REGISTER.EMAIL_EXISTED.message;
            res.json(responseObj);
            return;
        }

        var account = new Account();
        account.email = email;
        account.password = serviceUtil.md5Encode(password);
        accountService.create(account).then(function(result){
            responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
            result.password = "******";
            responseObj.results = result;
            res.json(responseObj);
        }, function(error){
            responseObj.statusErrorCode = error.code;
            responseObj.errorsObject = error;
            responseObj.errorsMessage = error.message;
            res.json(responseObj);
        });
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });

}]);

/* POST check email exists */
router.post('/checkEmailExists', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var email = req.body.email ? req.body.email : "";

    if(checkValidateUtil.isEmptyFeild(email) || !checkValidateUtil.checkValidateEmail(email)){
        logger.error(CodeStatus.EMAIL.EMAIL_INCORRECT.message);
        responseObj.statusErrorCode = CodeStatus.EMAIL.EMAIL_INCORRECT.code;
        responseObj.errorsObject = CodeStatus.EMAIL.EMAIL_INCORRECT;
        responseObj.errorsMessage = CodeStatus.EMAIL.EMAIL_INCORRECT.message;
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

        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
        responseObj.results = dataRes;
        res.json(responseObj);

    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });

}]);

module.exports = router;
