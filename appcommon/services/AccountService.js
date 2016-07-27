/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountDao = require("../daos/AccountDao");
var accountService = new GenericService(accountDao);

var serviceUtil = require("../utils/ServiceUtil");

accountService.getInfoFacebookToken = function(facebookToken){
    var deferred = Q.defer();

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

        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        logger.error(JSON.stringify(e));
        var errorObj = CodeStatus.ACCOUNT_ACTION.LOGIN.LOGIN_FB_ERROR_GET_PROFILE_ACCESS;
        errorObj.error = e;
        deferred.reject(errorObj);
        return;
    });

    return deferred.promise;
}

accountService.addAccessToken = function(res, account, responseObj){
    var accessTokenService = require("../services/AccessTokenService");
    accessTokenService.create(account.accountDevice).then(function(resultCreate){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        account.accountDevice.id = resultCreate.insertId;
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