/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var CodeStatus = require("../helpers/CodeStatus");
var Constant = require("../helpers/Constant");

var logger = require("../helpers/LoggerService");

/* POST GET status code */
router.post('/getStatusCode', [function(req, res, next) {
    var responseObj = new ResponseServerDto();
    responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
    responseObj.results = CodeStatus;
    res.json(responseObj);
}]);

module.exports = router;
