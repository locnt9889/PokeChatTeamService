/**
 * Created by LocNT on 7/28/15.
 */

var Q = require('q');

var DbConfig = require("../helpers/DatabaseConfig");
var pool = DbConfig.pool;
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

/**
 * Object MysqlHelper is generic Dao
 * @param tableConfig : object - of db table (NAME, NAME_FIELD_ID, NAME_FIELD_ACTIVE)
 */
var MysqlHelper = function(tableConfig){
    this.tableConfig = tableConfig;
}

/**
 * Execute a query
 * @param sql : string
 * @param params : []
 */
var queryExecute = function(sql, params) {
    var deferred = Q.defer();
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * Find all
 */
var find = function(isWithActive, isActive) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FIND;
    var params = [MysqlHelper.tableConfig.NAME];
    if(isWithActive){
        sql = SqlQueryConstant.GENERIC_SQL.SLQ_FIND_WITH_FIELD;
        params = [MysqlHelper.tableConfig.NAME, MysqlHelper.tableConfig.NAME_FIELD_ACTIVE, isActive];
    }
    pool.getConnection(function(err,connection){
        if (err) {
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * Search base all
 */
var searchBase = function(body) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_SEARCH_BASE;

    var params = [MysqlHelper.tableConfig.NAME];
    var queryStr = " 1";
    var keysBody = body ? Object.keys(body) : [];
    if(keysBody && keysBody.length > 0){
        for(key in keysBody){
            queryStr += (" AND " + keysBody[key] + "=?")
            params.push(body[keysBody[key]]);
        }
    }

    sql = sql.replace("#QUERY", queryStr);

    pool.getConnection(function(err,connection){
        if (err) {
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * find one by id
 * @param id : number
 * @param : idName - id name field
 */
var findOne = function(id, isWithActive, isActive) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FIND_WITH_FIELD;
    var params = [MysqlHelper.tableConfig.NAME, MysqlHelper.tableConfig.NAME_FIELD_ID, id];

    if(isWithActive){
        sql = SqlQueryConstant.GENERIC_SQL.SLQ_FIND_WITH_FIELD_AND_ACTIVE;
        params = [MysqlHelper.tableConfig.NAME, MysqlHelper.tableConfig.NAME_FIELD_ID, id, MysqlHelper.tableConfig.tableConfig.NAME_FIELD_ACTIVE, isActive];
    }
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * add new
 * @param obj : Object
 * @param tableName : String
 */
var addNew = function(obj) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_ADD_NEW;
    var params = [MysqlHelper.tableConfig.NAME, obj];
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * update
 * @param obj : Object
 * @param id : Number
 */
var update = function(obj, id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_UPDATE;
    var params = [MysqlHelper.tableConfig.NAME, obj, MysqlHelper.tableConfig.NAME_FIELD_ID, id];
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * remove
 * @param id : Number
 */
var remove = function(id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_REMOVE;
    var params = [MysqlHelper.tableConfig.NAME, MysqlHelper.tableConfig.NAME_FIELD_ID, id];
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * inactive
 * @param id : Number
 */
var inactive = function(id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_DO_INACTIVE;
    var params = [MysqlHelper.tableConfig.NAME, MysqlHelper.tableConfig.NAME_FIELD_ACTIVE, id];
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/*Export*/
MysqlHelper.prototype = {
    queryExecute : queryExecute,
    find : find,
    addNew : addNew,
    update : update,
    remove : remove,
    searchBase : searchBase,
    findOne : findOne,
    inactive : inactive
};
module.exports = MysqlHelper;