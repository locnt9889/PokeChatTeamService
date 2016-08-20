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
var AccountFriend = require("../models/AccountFriend");
var AccountDevices = require("../models/AccountDevices");

var accountService = require("../services/AccountService");
var accessTokenService = require("../services/AccessTokenService");
var accountsPhoneContactService = require("../services/AccountsPhoneContactService");
var accountFriendService = require("../services/AccountFriendService");

var uploadFileHelper = require("../helpers/UploadFileHelper");
var Q = require("q");

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

    if(checkValidateUtil.isEmptyFeild(password) || checkValidateUtil.isEmptyFeild(deviceType)){
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

    if(checkValidateUtil.isEmptyFeild(facebookToken) && checkValidateUtil.isEmptyFeild(deviceType)){
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
        var accountDevices = new AccountDevices();
        accountDevices.deviceToken = deviceToken;
        accountDevices.deviceType = deviceType;
        accountDevices.accessToken = accessToken;

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
                account.isUpdatedInfo = true;

                accountService.create(account).then(function(resultCreateAccount){
                    account.accessToken = accessToken;
                    account.accountId = resultCreateAccount.insertId;
                    accountDevices.accountId = resultCreateAccount.insertId;
                    account.accountDevices = accountDevices;
                    accountService.addAccessToken(res, account, responseObj);

                }, function(error){
                    logger.error(JSON.stringify(error));
                    responseObj = serviceUtil.generateObjectError(responseObj, error);
                    res.json(responseObj);
                });

            }else{
                var account = resultSearch[0];
                accountDevices.accountId = account.accountId;
                account.accountDevices = accountDevices;
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
        var dataArray = dataSync.split(";");
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

/* POST update profile */
router.post('/updateProfile', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;

    myAccount.fullname = req.body.fullname ? req.body.fullname : myAccount.fullname;
    myAccount.status = req.body.status ? req.body.status : myAccount.status;
    myAccount.birthday = req.body.birthday ? req.body.birthday : myAccount.birthday;
    myAccount.phone = req.body.phone ? req.body.phone : myAccount.phone;
    myAccount.gpsLatitude = req.body.gpsLatitude ? req.body.gpsLatitude : myAccount.gpsLatitude;
    myAccount.gpsLongitude = req.body.gpsLongitude ? req.body.gpsLongitude : myAccount.gpsLongitude;
    myAccount.gpsPersonCanSearchMe = req.body.gpsPersonCanSearchMe ? req.body.gpsPersonCanSearchMe.toUpperCase() : myAccount.gpsPersonCanSearchMe;

    myAccount.gender = req.body.gender != undefined ? req.body.gender : myAccount.gender;
    myAccount.isCanSearchMeByGPS = req.body.isCanSearchMeByGPS != undefined ? req.body.isCanSearchMeByGPS : myAccount.isCanSearchMeByGPS;

    myAccount.isUpdatedInfo = true;
    accountService.update(myAccount.accountId, myAccount).then(function(dataRemove){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = myAccount;
        res.json(responseObj);
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    });
}]);

/* POST update avatar */
router.post('/updateAvatar', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;

    var fileNamePre = Constant.UPLOAD_FILE_CONFIG.PRE_NAME_IMAGE.ACCOUNT_AVATAR.replace("#ID", myAccount.accountId);
    var folderNamePre = Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.ACCOUNT_AVATAR.replace("#ID", myAccount.accountId);
    var maxSize = Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.ACCOUNT_AVATAR;

    accountService.uploadFile(req, fileNamePre, folderNamePre, maxSize).then(function(data){
        myAccount.avatarImage = data;

        accountService.update(myAccount.accountId, myAccount).then(function(dataRemove){
            responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
            responseObj.results = myAccount;
            res.json(responseObj);
        }, function(err){
            logger.error(JSON.stringify(err));
            responseObj = serviceUtil.generateObjectError(responseObj, err);
            res.json(responseObj);
        });
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    })

}]);

/**
 * view account avatar files. this is public api, without accesstoken
 * */
router.get('/:accountId/view-avatar/:file', function (req, res) {
    var id = req.params.accountId;
    var fileName = req.params.file;
    var folder = Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.ACCOUNT_AVATAR.replace("#ID", id);
    var filePath = folder + fileName;
    uploadFileHelper.viewFile(res, filePath);
});

/* POST update cover */
router.post('/updateCover', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;

    var fileNamePre = Constant.UPLOAD_FILE_CONFIG.PRE_NAME_IMAGE.ACCOUNT_COVER.replace("#ID", myAccount.accountId);
    var folderNamePre = Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.ACCOUNT_COVER.replace("#ID", myAccount.accountId);
    var maxSize = Constant.UPLOAD_FILE_CONFIG.MAX_SIZE_IMAGE.ACCOUNT_COVER;

    accountService.uploadFile(req, fileNamePre, folderNamePre, maxSize).then(function(data){
        myAccount.coverImage = data;

        accountService.update(myAccount.accountId, myAccount).then(function(dataRemove){
            responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
            responseObj.results = myAccount;
            res.json(responseObj);
        }, function(err){
            logger.error(JSON.stringify(err));
            responseObj = serviceUtil.generateObjectError(responseObj, err);
            res.json(responseObj);
        });
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    })

}]);

/**
 * view account avatar files. this is public api, without accesstoken
 * */
router.get('/:accountId/view-cover/:file', function (req, res) {
    var id = req.params.accountId;
    var fileName = req.params.file;
    var folder = Constant.UPLOAD_FILE_CONFIG.PRE_FOLDER_IMAGE.ACCOUNT_COVER.replace("#ID", id);
    var filePath = folder + fileName;
    uploadFileHelper.viewFile(res, filePath);
});

/* POST searchByString */
router.post('/searchByString', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;

    var searchStr = req.body.searchStr ? req.body.searchStr : "";
    var searchType = req.body.searchType ? req.body.searchType : "";
    var gender = req.body.gender ? req.body.gender.toUpperCase() : "";
    var perPage = req.body.perPage && !isNaN(req.body.perPage)? parseInt(req.body.perPage) : 10;
    var pageNum = req.body.pageNum && !isNaN(req.body.pageNum)? parseInt(req.body.pageNum) : 1;

    if(checkValidateUtil.isEmptyFeild(searchStr)){
        logger.error(CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.SEARCH_STRING_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.SEARCH_STRING_EMPTY);
        res.json(responseObj);
        return;
    }

    if(searchType != Constant.ACCOUNT_SEARCH_TYPE.NAME && searchType != Constant.ACCOUNT_SEARCH_TYPE.PHONE
        && searchType != Constant.ACCOUNT_SEARCH_TYPE.EMAIL && searchType != Constant.ACCOUNT_SEARCH_TYPE.ALL){
        logger.error(CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.SEARCH_TYPE_ERROR.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.SEARCH_TYPE_ERROR);
        res.json(responseObj);
        return;
    }

    if(gender != Constant.ACCOUNT_GENDER.ALL && gender != Constant.ACCOUNT_GENDER.MALE && gender != Constant.ACCOUNT_GENDER.FEMALE){
        logger.error(CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.GENDER_ERROR.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.GENDER_ERROR);
        res.json(responseObj);
        return;
    }

    accountService.searchByString(myAccount.accountId, gender, searchType, searchStr, perPage, pageNum).then(function(data){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        if(data && data.items) {
            for (var i = 0; i < data.items.length; i++) {
                data.items[i].password = "******";
            }
        }
        responseObj.results = data;
        res.json(responseObj);
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    })

}]);

/* POST searchNear */
router.post('/searchNear', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;

    var gender = req.body.gender ? req.body.gender.toLocaleUpperCase() : "";
    var perPage = req.body.perPage && !isNaN(req.body.perPage)? parseInt(req.body.perPage) : 10;
    var pageNum = req.body.pageNum && !isNaN(req.body.pageNum)? parseInt(req.body.pageNum) : 1;
    var gpsLatitude = req.body.gpsLatitude && !isNaN(req.body.gpsLatitude)? parseInt(req.body.gpsLatitude) : 0;
    var gpsLongitude = req.body.gpsLongitude && !isNaN(req.body.gpsLongitude)? parseInt(req.body.gpsLongitude) : 0;
    var distanceMax = req.body.distanceMax && !isNaN(req.body.distanceMax)? parseInt(req.body.distanceMax) : 0;

    if(gender != Constant.ACCOUNT_GENDER.ALL && gender != Constant.ACCOUNT_GENDER.MALE && gender != Constant.ACCOUNT_GENDER.FEMALE){
        logger.error(CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.GENDER_ERROR.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.SEARCH_ACCOUNT.GENDER_ERROR);
        res.json(responseObj);
        return;
    }

    accountService.searchNearAccount(myAccount.accountId, gender, gpsLongitude, gpsLatitude, distanceMax, perPage, pageNum).then(function(data){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = data;
        res.json(responseObj);
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj, err);
        res.json(responseObj);
    })

}]);

/* POST login with email */
router.post('/linkToFb', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var facebookToken = req.body.facebookToken ? req.body.facebookToken : "";

    if(myAccount.facebookId != ""){
        logger.error(CodeStatus.ACCOUNT_ACTION.LINK_ACCOUNT_WITH_FB.FACEBOOK_ID_EXISTED.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LINK_ACCOUNT_WITH_FB.FACEBOOK_ID_EXISTED);
        res.json(responseObj);
        return;
    }

    accountService.getInfoFacebookToken(facebookToken).then(function(jsonObj){
        var facebookId = jsonObj.id;
        var objectSearch = {};
        objectSearch[Constant.TABLE_NAME_DB.ACCOUNTS.NAME_FIELD_FACEBOOKID] = facebookId;

        accountService.searchBase(objectSearch).then(function(resultSearch){
            if(!resultSearch || resultSearch.length == 0){
                myAccount.facebookId = jsonObj.id;
                myAccount.facebookToken = facebookToken;

                accountService.update(myAccount.accountId , myAccount).then(function(resultUpdateAccount){
                    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                    responseObj.results = myAccount;
                    res.json(responseObj);
                }, function(error){
                    logger.error(JSON.stringify(error));
                    responseObj = serviceUtil.generateObjectError(responseObj, error);
                    res.json(responseObj);
                });
            }else{
                logger.error(CodeStatus.ACCOUNT_ACTION.LINK_ACCOUNT_WITH_FB.FACEBOOK_ID_LINKED.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.LINK_ACCOUNT_WITH_FB.FACEBOOK_ID_LINKED);
                res.json(responseObj);
                return;
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

/* POST friendly action */
router.post('/friendly', [accessTokenService.checkAccessToken, accountService.checkFriendCorrect, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var myAccount = accessTokenObj.account;
    var accountId = myAccount.accountId;
    var friendId = req.body.friendId;
    var friendStatus = req.body.friendStatus;

    if(checkValidateUtil.isEmptyFeild(friendStatus)){
        logger.error(CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_STATUS_EMPTY.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_STATUS_EMPTY);
        res.json(responseObj);
        return;
    }

    if(friendStatus != Constant.FRIEND_STATUS.FRIEND && friendStatus != Constant.FRIEND_STATUS.REQUESTING
        && friendStatus != Constant.FRIEND_STATUS.REMOVE){
        logger.error(CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_STATUS_INCORRECT.message);
        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_STATUS_INCORRECT);
        res.json(responseObj);
        return;
    }

    var objectSearchFriend = {};
    objectSearchFriend.friendId = friendId;

    accountFriendService.searchBase(objectSearchFriend).then(function(resultFriend){
        if(friendStatus == Constant.FRIEND_STATUS.REQUESTING){
            if(resultFriend.length > 0 && resultFriend[0].friendStatus == Constant.FRIEND_STATUS.FRIEND){
                logger.error(CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.REQUEST_ACCOUNT_IN_FRIEND_LIST.message);
                responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_ACCOUNT_NO_REQUEST);
                res.json(responseObj);
                return;
            } else {
                accountFriendService.deletePairNoFriend(accountId, friendId).then(function(resultDelete){
                    var friendMakeFrom = new AccountFriend();
                    friendMakeFrom.accountId = accountId;
                    friendMakeFrom.friendId = friendId;

                    var friendMakeTo = new AccountFriend();
                    friendMakeTo.friendId = accountId;
                    friendMakeTo.accountId = friendId;

                    friendMakeFrom.friendStatus = Constant.FRIEND_STATUS.REQUESTING;
                    friendMakeTo.friendStatus = Constant.FRIEND_STATUS.PEDDING;

                    Q.all(accountFriendService.create(friendMakeFrom), accountFriendService.create(friendMakeTo)).then(function (dataAdd) {
                        logger.info(JSON.stringify(dataAdd));
                        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                        responseObj.results = dataAdd;
                        res.json(responseObj);
                    }, function (err) {
                        logger.error(JSON.stringify(err));
                        responseObj = serviceUtil.generateObjectError(responseObj, err);
                        res.json(responseObj);
                    });
                }, function(err){
                    logger.error(JSON.stringify(err));
                    responseObj = serviceUtil.generateObjectError(responseObj,err);
                    res.send(responseObj);
                });
            }
        } else{
            var objectSearchMyAccount = {};
            objectSearchMyAccount.accountId = accountId;
            objectSearchMyAccount.friendStatus = Constant.FRIEND_STATUS.PEDDING;

            accountFriendService.searchBase(objectSearchMyAccount).then(function(resultMyAccount){
                if(friendStatus == Constant.FRIEND_STATUS.FRIEND){
                    if(resultFriend || resultFriend.friendStatus == Constant.FRIEND_STATUS.FRIEND){
                        logger.error(CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_ACCOUNT_NO_REQUEST.message);
                        responseObj = serviceUtil.generateObjectError(responseObj, CodeStatus.ACCOUNT_ACTION.FRIENDLY_ACTION.FRIEND_ACCOUNT_NO_REQUEST);
                        res.json(responseObj);
                        return;
                    }else {
                        accountFriendService.updateFriendStatus(accountId, friendId, friendStatus).then(function (updateStatus) {
                            logger.info(JSON.stringify(updateStatus));
                            responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                            responseObj.results = updateStatus;
                            res.json(responseObj);
                        }, function (err) {
                            logger.error(JSON.stringify(err));
                            responseObj = serviceUtil.generateObjectError(responseObj, err);
                            res.send(responseObj);
                        });
                    }
                }else{
                    accountFriendService.deletePairNoFriend(accountId, friendId).then(function(resultDelete){
                        logger.info(JSON.stringify(resultDelete));
                        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
                        responseObj.results = resultDelete;
                        res.json(responseObj);
                    }, function(err){
                        logger.error(JSON.stringify(err));
                        responseObj = serviceUtil.generateObjectError(responseObj,err);
                        res.send(responseObj);
                    });
                }
            }, function(err){
                logger.error(JSON.stringify(err));
                responseObj = serviceUtil.generateObjectError(responseObj,err);
                res.send(responseObj);
            });
        }
    }, function(err){
        logger.error(JSON.stringify(err));
        responseObj = serviceUtil.generateObjectError(responseObj,err);
        res.send(responseObj);
    });

}]);

module.exports = router;
