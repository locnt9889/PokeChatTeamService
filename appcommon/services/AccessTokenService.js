/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var GenericService = require("./GenericService");
var accountService = require("./AccountService");
var accountDevicesDao = require("../daos/AccountDevicesDao");
var accessTokenService = new GenericService(accountDevicesDao);

accessTokenService.checkAccessToken = function(req, res, next){
    var accessToken = req.body.accessToken;
    if(accessToken == undefined){
        accessToken = req.query.accessToken;
    }
    var responseObj = new ResponseServerDto();

    if(checkValidateUtil.isEmptyFeild(accessToken)){
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
        res.send(responseObj);
        return;
    }

    var objSearch = {};
    objSearch[Constant.TABLE_NAME_DB.ACCOUNT_DEVICES.NAME_FIELD_ACCESS_TOKEN] = accessToken;
    objSearch[Constant.TABLE_NAME_DB.ACCOUNT_DEVICES.NAME_FIELD_ACTIVE] = true;

    accessTokenService.searchBase(objSearch).then(function(dataSearch){
        if(dataSearch && dataSearch.length > 0){
            var accessTokenObj = dataSearch[0];
            accountService.detail(accessTokenObj.accountId).then(function(data){
                if(data && data.length > 0){
                    var account = data[0];
                    //account.password = "******";
                    delete account.password;
                    accessTokenObj.account = account;
                    req.accessTokenObj = accessTokenObj;
                    next();
                }else{
                    responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
                    res.send(responseObj);
                }
            }, function(err){
                logger.error(JSON.stringify(err));
                responseObj = serviceUtil.generateObjectError(responseObj,err);
                res.send(responseObj);
            });
        }else{
            responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
            res.send(responseObj);
        }
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj,err);
        res.send(responseObj);
    });
};

accessTokenService.checkAccessTokenForChat = function(accessToken){
    var deferred = Q.defer();

    if(checkValidateUtil.isEmptyFeild(accessToken)){
        deferred.reject(CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
        return;
    }

    var objSearch = {};
    objSearch[Constant.TABLE_NAME_DB.ACCOUNT_DEVICES.NAME_FIELD_ACCESS_TOKEN] = accessToken;
    objSearch[Constant.TABLE_NAME_DB.ACCOUNT_DEVICES.NAME_FIELD_ACTIVE] = true;

    accessTokenService.searchBase(objSearch).then(function(dataSearch){
        if(dataSearch && dataSearch.length > 0){
            var accessTokenObj = dataSearch[0];
            accountService.detail(accessTokenObj.accountId).then(function(data){
                if(data && data.length > 0){
                    var account = data[0];
                    delete account.password;

                    deferred.resolve(account);

                }else{
                    deferred.reject(CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
                }
            }, function(err){
                logger.error(JSON.stringify(err));
                deferred.reject(err);
            });
        }else{
            deferred.reject(CodeStatus.COMMON.ACCESS_TOKEN_INVALID);
        }
    }, function(err){
        logger.error(JSON.stringify(err));
        deferred.reject(err);
    });

    return deferred.promise;
};

/*Exports*/
module.exports = accessTokenService;