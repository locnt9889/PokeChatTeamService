/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');
var request = require('request');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountDao = require("../daos/AccountDao");
var accountService = new GenericService(accountDao);

var serviceUtil = require("../utils/ServiceUtil");

accountService.getInfoFacebookToken = function(facebookToken){
    var deferred = Q.defer();
    var url = Constant.GET_INFO_FB.URL_CHECK_FB_TOKEN + facebookToken;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonObj = {};
            try {
                jsonObj = JSON.parse(body);
            }catch(e){
                logger.error(JSON.stringify(e));
                var errorObj = CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
                errorObj.error = e;
                deferred.reject(errorObj);
                return;
            }

            //response error
            if(jsonObj.error){
                logger.error(JSON.stringify(jsonObj.error));
                var errorObj = CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
                errorObj.error = jsonObj.error;
                deferred.reject(errorObj);
                return;
            }

            deferred.resolve(jsonObj);
        }else{
            logger.error(JSON.stringify(error));
            var errorObj = CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
            errorObj.error = error;
            deferred.reject(errorObj);
            return;
        }
    });

    return deferred.promise;
}

accountService.addAccessToken = function(res, account, responseObj){
    var accessTokenService = require("../services/AccessTokenService");
    accessTokenService.create(account.accountDevices).then(function(resultCreate){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        account.accountDevices.id = resultCreate.insertId;
        responseObj.results = account;
        res.json(responseObj);
    }, function(error){
        logger.error(JSON.stringify(error));
        responseObj = serviceUtil.generateObjectError(responseObj, error);
        res.json(responseObj);
    });
}

/*Exports*/
module.exports = accountService;