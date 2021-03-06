/**
 * Created by LocNT on 7/30/16.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var accountDao = new MysqlHelper(Constant.TABLE_NAME_DB.ACCOUNTS);

var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");
var logger = require("../helpers/LoggerService");

accountDao.searchAccountByString = function(accountId, genderQuery, likeQuery, perPage, pageNum){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.ACCOUNT_ACTION_SQL.SEARCH_BY_STRING_COUNT;
    sqlCount = sqlCount.replace("#GENDER", genderQuery);
    sqlCount = sqlCount.replace("#LIKE", likeQuery);

    var paramCount = [accountId];

    accountDao.queryExecute(sqlCount, paramCount).then(function(dataCount){
        var responsePagingDto = new ResponsePagingDto();
        var totalItems = dataCount[0].TOTAL_ITEMS;
        var totalPages = parseInt(totalItems / perPage);
        if((totalItems / perPage) > totalPages){
            totalPages = totalPages + 1;
        }

        responsePagingDto.pageNum = pageNum;
        responsePagingDto.perPage = perPage;
        responsePagingDto.totalItems = totalItems;
        responsePagingDto.totalPages = totalPages;

        var sql = SqlQueryConstant.ACCOUNT_ACTION_SQL.SEARCH_BY_STRING_PAGING;
        sql = sql.replace("#GENDER", genderQuery);
        sql = sql.replace("#LIKE", likeQuery);

        var params = [accountId, accountId, start, perPage];
        accountDao.queryExecute(sql, params).then(function(data){
            responsePagingDto.items = data;
            def.resolve(responsePagingDto);
        }, function(err){
            var errorObj = CodeStatus.COMMON.DB_EXECUTE_ERROR;
            errorObj["error"] = err;
            logger.error(JSON.stringify(errorObj));
            def.reject(errorObj);
        });
    }, function(err){
        var errorObj = CodeStatus.COMMON.DB_EXECUTE_ERROR;
        errorObj["error"] = err;
        logger.error(JSON.stringify(errorObj));
        def.reject(errorObj);
    });

    return def.promise;
}

/**
 * get distance of 2 location
 * @param float latUser
 * @param float longUser
 * @param string gender
 * @param float distanceMax
 * @return double (mét)
 * round(acos(sin($lat1*pi()/180)*sin($lat2*pi()/180) + cos($lat1*pi()/180)*cos($lat2*PI()/180)*cos($long2*PI()/180-$long1*pi()/180)) * 6371000, 2)
 */

accountDao.getShopNearWithDistance = function(accountId, latUser, longUser, distanceMax, genderQuery, perPage, pageNum){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    //build sql count
    var sqlCount = "SELECT COUNT(ac.accountId) AS TOTAL_ITEMS" +
        " FROM accounts ac WHERE ac.accountId != ? AND #genderQuery";
    sqlCount = sqlCount.replace("#genderQuery", genderQuery);

    var executeDistance = "round(acos(sin(?*PI()/180)*sin(gpsLatitude*PI()/180)+cos(?*PI()/180)*cos(gpsLatitude*PI()/180)*cos((?-gpsLongitude)*PI()/180)) * 180/PI() * 60 * 1.1515 * 1.609344, 2)";
    if(distanceMax > 0){
        //sqlCount += " AND round(acos(sin(?*pi()/180)*sin(gpsLatitude*pi()/180) + cos(?*pi()/180)*cos(gpsLatitude*PI()/180)*cos(?*PI()/180-gpsLongitude*pi()/180)) * 6371000, 2) <= " + distanceMax;
        sqlCount += " AND " + executeDistance + " <= " + distanceMax;
    }
    var paramsCount = [accountId, latUser, latUser, longUser];

    //build sql get data paging
    var sql = "SELECT ac.*, af.friendStatus, " + executeDistance +
        " AS distanceM " +
        "FROM accounts ac LEFT JOIN account_friend af ON ac.accountId = af.friendId WHERE ac.accountId != ? AND (af.accountId IS NULL OR af.accountId = ?) AND #genderQuery"
    sql = sql.replace("#genderQuery", genderQuery);
    if(distanceMax > 0){
        sql += " HAVING distanceM <= " + distanceMax;
    }
    sql += " ORDER BY distanceM DESC LIMIT ?, ?";
    var params = [latUser, latUser, longUser, accountId, accountId, start, perPage];

    accountDao.queryExecute(sqlCount, paramsCount).then(function(dataCount){
        var responsePagingDto = new ResponsePagingDto();
        var totalItems = dataCount[0].TOTAL_ITEMS;
        var totalPages = parseInt(totalItems / perPage);
        if((totalItems / perPage) > totalPages){
            totalPages = totalPages + 1;
        }

        responsePagingDto.pageNum = pageNum;
        responsePagingDto.perPage = perPage;
        responsePagingDto.totalItems = totalItems;
        responsePagingDto.totalPages = totalPages;

        accountDao.queryExecute(sql, params).then(function(data){
            for(var i = 0; i < data.length; i++){
                data[i].password = "******";
            }
            responsePagingDto.items = data;
            def.resolve(responsePagingDto);
        }, function(err){
            var errorObj = CodeStatus.COMMON.DB_EXECUTE_ERROR;
            errorObj["error"] = err;
            logger.error(JSON.stringify(errorObj));
            def.reject(errorObj);
        });
    }, function(err){
        var errorObj = CodeStatus.COMMON.DB_EXECUTE_ERROR;
        errorObj["error"] = err;
        logger.error(JSON.stringify(errorObj));
        def.reject(errorObj);
    });

    return def.promise;
};

/*Export*/
module.exports = accountDao;