/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var logger = require("../helpers/LoggerService");

var GenerateService = require("./GenerateService");
var personService = new GenerateService(Constant.TABLE_NAME_DB.PERSON);

var personDao = require("../daos/PersonDao");

var Person = require("../models/Person");
/**
 * @desc Create new person
 * @param body
 * */
personService.create = function(body){
    var deferred = Q.defer();

    var name = body.name ? body.name : "";
    var email = body.email ? body.email : "";
    var birthday = body.birthday ? body.birthday : "0000-00-00";

    var person = new Person();

    person.name = name;
    person.email = email;
    person.birthday = new Date(birthday);

    personDao.addNew(person).then(function(result){
        person.id = result.insertId;
        deferred.resolve(person);
    },function(err){
        logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
        deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
    });

    return deferred.promise;
};

/**
 * @desc Create update
 * @param body
 * */
personService.update = function(body){
    var deferred = Q.defer();

    var id = body.id ? body.id : "";
    var name = body.name ? body.name : "";
    var email = body.email ? body.email : "";
    var birthday = body.birthday ? body.birthday : "0000-00-00";

    personDao.findOne(id).then(function(resultFindOne){
        if(resultFindOne && resultFindOne.length > 0) {
            var person = resultFindOne[0];
            person.name = name;
            person.email = email;
            person.birthday = new Date(birthday);
            person.updated = new Date();

            personDao.update(person, id).then(function(result){
                deferred.resolve(person);
            },function(err){
                logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
                deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
            });
        }else{
            logger.error(CodeStatus.OBJECT_NOT_EXIST.message);
            deferred.reject(CodeStatus.OBJECT_NOT_EXIST);
        }
    },function(err){
        logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
        deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
    });

    return deferred.promise;
};

/*Exports*/
module.exports = personService;