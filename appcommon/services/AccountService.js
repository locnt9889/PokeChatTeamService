/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');
var request = require('request');
var multiparty = require('multiparty');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenericService = require("./GenericService");
var accountDao = require("../daos/AccountDao");
var accountService = new GenericService(accountDao);

var serviceUtil = require("../utils/ServiceUtil");
var uploadFileHelper = require("../helpers/UploadFileHelper");

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

accountService.uploadFile = function(req, fileNamePre, folderNamePre, maxSize){
    var deferred = Q.defer();

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) {
            logger.error(JSON.stringify(err));
            var errorObj = CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.UPLOAD_FILE_ERROR;
            errorObj.error = err;
            deferred.reject(errorObj);
            return;
        }
        if (files.imageFile.length == 0 || files.imageFile[0].size == 0) {
            logger.error(JSON.stringify(CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.FILE_EMPTY));
            deferred.reject(CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.FILE_EMPTY);
            return;
        }
        if (files.imageFile[0].size > maxSize) {
            logger.error(JSON.stringify(CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.FILE_LIMITED_SIZE));
            deferred.reject(CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.FILE_LIMITED_SIZE);
            return;
        }

        uploadFileHelper.writeFileUpload(files.imageFile[0].originalFilename, fileNamePre, files.imageFile[0].path, folderNamePre).then(function (fullFilePath) {
            deferred.resolve(fullFilePath);
        }, function (err) {
            logger.error(JSON.stringify(err));
            var errorObj = CodeStatus.ACCOUNT_ACTION.UPLOAD_FILE.UPLOAD_FILE_ERROR;
            errorObj.error = err;
            deferred.reject(errorObj);
            return;
        });
    });

    return deferred.promise;
}

accountService.searchByString = function(gender, searchType, searchStr, perPage, pageNum){
    var genderQuery = "";
    var likeQuery = "";

    if(gender != Constant.ACCOUNT_GENDER.MALE && gender != Constant.ACCOUNT_GENDER.FEMALE){
        genderQuery = "1";
    }else{
        genderQuery = Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_GENDER + "=" + gender;
    }

    if(searchType == Constant.ACCOUNT_SEARCH_TYPE.EMAIL){
        likeQuery = Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL + " like '%" + searchStr + "%'";
    } else if(searchType == Constant.ACCOUNT_SEARCH_TYPE.NAME){
        likeQuery = Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_FULLNAME + " like '%" + searchStr + "%'";
    } else if(searchType == Constant.ACCOUNT_SEARCH_TYPE.PHONE){
        likeQuery = Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_PHONE + " like '%" + searchStr + "%'";
    } else{
        likeQuery = "(" + Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_EMAIL + " like '%" + searchStr + "%'";
        likeQuery += " OR " + Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_FULLNAME + " like '%" + searchStr + "%'"
        likeQuery += " OR " + Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_PHONE + " like '%" + searchStr + "%'" + ")";
    }

    return accountDao.searchAccountByString(genderQuery, likeQuery, perPage, pageNum);
}

/*Exports*/
module.exports = accountService;