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
    this.generateDao.findOne(id, isWithActive, isActive).then(function(result){
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

    this.generateDao.find(isWithActive, isActive).then(function(result){
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

    this.generateDao.searchBase(body).then(function(result){
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

    this.generateDao.findOne(id).then(function(result){
        if(result && result.length > 0){
            this.generateDao.remove(id).then(function(data){
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

    this.generateDao.findOne(id).then(function(result){
        if(result && result.length > 0){
            this.generateDao.inactive(id).then(function(data){
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

/*Exports*/
GenerateService.prototype.detail = detail;
GenerateService.prototype.searchBase = searchBase;
GenerateService.prototype.find = find;
GenerateService.prototype.remove = remove;
GenerateService.prototype.inactive = inactive;

module.exports = GenerateService;