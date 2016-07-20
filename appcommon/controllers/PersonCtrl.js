/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var personService = require("../services/PersonService");
var CodeStatus = require("../helpers/CodeStatus");

/* POST create */
router.post('/create', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var body = req.body;

    personService.create(body).then(function(result){
        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
        responseObj.results = result;
        res.json(responseObj);
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });
}]);

/* POST create */
router.post('/update', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var body = req.body;

    personService.update(body).then(function(result){
        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
        responseObj.results = result;
        res.json(responseObj);
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });
}]);

/* POST get detail */
router.post('/detail', [function(req, res, next) {

    var responseObj = new ResponseServerDto();

    var id = req.body.id ? req.body.id : "";

    personService.detail(id).then(function(result){
        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
        responseObj.results = result;
        res.json(responseObj);
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });
}]);

/* POST find */
router.post('/find', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    personService.find(true, true).then(function(result){
        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
        responseObj.results = result;
        res.json(responseObj);
    }, function(error){
        responseObj.statusErrorCode = error.code;
        responseObj.errorsObject = error;
        responseObj.errorsMessage = error.message;
        res.json(responseObj);
    });
}]);

/* POST searchbase */
router.post('/searchBase', [function(req, res, next) {
    var responseObj = new ResponseServerDto();

    var body = req.body;

    personService.searchBase(body).then(function(result){
        responseObj.statusErrorCode = CodeStatus.SUCCESS.code;
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
