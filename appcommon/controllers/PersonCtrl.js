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
    var name = body.name ? body.name : "";
    var email = body.email ? body.email : "";
    var birthday = body.birthday ? body.birthday : "0000-00-00";

    var person = new Person();

    person.name = name;
    person.email = email;
    person.birthday = new Date(birthday);

    personService.create(person).then(function(result){
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
    var id = req.body.id ? req.body.id : 0;

    personService.update(id, req.body).then(function(result){
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
