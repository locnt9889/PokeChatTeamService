/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var CodeStatus = require("../helpers/CodeStatus");
var Constant = require("../helpers/Constant");

var logger = require("../helpers/LoggerService");
var serviceUtil = require("../utils/ServiceUtil");
var accessTokenService = require("../services/AccessTokenService");

/* POST GET status code */
router.post('/getStatusCode', [function(req, res, next) {
    var responseObj = new ResponseServerDto();
    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
    responseObj.results = CodeStatus;
    res.json(responseObj);
}]);

/* POST GET status code */
router.post('/getDeviceType', [function(req, res, next) {
    var responseObj = new ResponseServerDto();
    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
    responseObj.results = Constant.DEVICE_TYPE;
    res.json(responseObj);
}]);

/* POST GET status code */
router.post('/encodeMD5', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var str = req.body.str ? req.body.str : "";

    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
    responseObj.results = serviceUtil.md5Encode(str);
    res.json(responseObj);
}]);

/* POST GET status code */
router.post('/checkAccessToken', [accessTokenService.checkAccessToken, function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;

    responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
    responseObj.results = accessTokenObj;
    res.json(responseObj);
}]);

module.exports = router;
