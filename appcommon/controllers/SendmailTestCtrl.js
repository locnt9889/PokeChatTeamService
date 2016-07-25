/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var CodeStatus = require("../helpers/CodeStatus");

var mailerService = require("../services/MailerService");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");

/* POST create */
router.post('/test-sendmail', [function(req, res, next) {

    var responseObj = new ResponseServerDto();

    var body = req.body;

    mailerService.sendMail(body).then(function(result){
        responseObj.statusErrorCode = CodeStatus.COMMON.SUCCESS.code;
        responseObj.results = result;
        res.json(responseObj);
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });
}]);

module.exports = router;
