/**
 * Created by LocNT on 7/29/15.
 */
var Q = require('q');

var mysqlHelper = require("../daos/MysqlHelper");

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");

var logger = require("../helpers/LoggerService");

/**
 * Object MysqlHelper is generic Dao
 * @param tableConfig : object - of db table (NAME, NAME_FIELD_ID, NAME_FIELD_ACTIVE)
 */
var GenerateService = function(tableConfig){
    this.generateDao = new mysqlHelper(tableConfig);
}

/**
 * @desc get detail
 * @param id - id off object
 * @param isWithActive - query with active field or not
 * @param isActive - active value
 *
 * */
var detail = function(id, isWithActive, isActive){
    var deferred = Q.defer();
    GenerateService.generateDao.findOne(id, isWithActive, isActive).then(function(result){
        if(result && result.length > 0){
            deferred.resolve(result);
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

/**
 * @desc find
 * @param isWithActive - query with active field or not
 * @param isActive - active value
 * */
var find = function(isWithActive, isActive){
    var deferred = Q.defer();

    GenerateService.generateDao.find(isWithActive, isActive).then(function(result){
        deferred.resolve(result);
    },function(err){
        logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
        deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
    });

    return deferred.promise;
};

/**
 * @desc search
 * @param body - object contain field-value search
 * */
var searchBase = function(body){
    var deferred = Q.defer();

    GenerateService.generateDao.searchBase(body).then(function(result){
        deferred.resolve(result);
    },function(err){
        logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
        deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
    });

    return deferred.promise;
};

/**
 * @desc do remove (delete row in db)
 * @param id - id off object
 * */
var remove = function(id){
    var deferred = Q.defer();

    GenerateService.generateDao.findOne(id).then(function(result){
        if(result && result.length > 0){
            GenerateService.generateDao.remove(id).then(function(data){
                deferred.resolve(data);
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

/**
 * @desc do inactive
 * @param id - id off object
 * */
var inactive = function(id){
    var deferred = Q.defer();

    GenerateService.generateDao.findOne(id).then(function(result){
        if(result && result.length > 0){
            GenerateService.generateDao.inactive(id).then(function(data){
                deferred.resolve(data);
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

/**
 * @desc Create new person
 * @param body
 * */
var create = function(obj){
    var deferred = Q.defer();

    GenerateService.generateDao.addNew(obj).then(function(result){
        obj.id = result.insertId;
        deferred.resolve(obj);
    },function(err){
        logger.error(CodeStatus.DB_EXECUTE_ERROR.message);
        deferred.reject(CodeStatus.DB_EXECUTE_ERROR);
    });

    return deferred.promise;
};

/**
 * @desc update
 * @param id
 * @param obj
 * */
var update = function(id, obj){
    var deferred = Q.defer();

    GenerateService.generateDao.findOne(id).then(function(resultFindOne){
        if(resultFindOne && resultFindOne.length > 0) {
            var objDb = resultFindOne[0];
            var keysObj = obj ? Object.keys(obj) : [];
            if(keysObj && keysObj.length > 0){
                for(var key in keysObj){
                    objDb[keysObj[key]] = obj[keysObj[key]];
                }
            }
            GenerateService.generateDao.update(objDb, id).then(function(result){
                deferred.resolve(objDb);
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
GenerateService.prototype = {
    detail : detail,
    searchBase : searchBase,
    find : find,
    remove : remove,
    inactive : inactive,
    create : create,
    update : update
};

module.exports = GenerateService;