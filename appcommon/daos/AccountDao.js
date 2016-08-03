/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var accountDao = new MysqlHelper(Constant.TABLE_NAME_DB.ACCOUNTS);

var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");
var logger = require("../helpers/LoggerService");

accountDao.searchAccountByString = function(genderQuery, likeQuery, perPage, pageNum){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.ACCOUNT_ACTION_SQL.SEARCH_BY_STRING_COUNT;
    sqlCount = sqlCount.replace("#GENDER", genderQuery);
    sqlCount = sqlCount.replace("#LIKE", likeQuery);

    var paramCount = [Constant.TABLE_NAME_DB.ACCOUNTS.NAME];

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

        var params = [Constant.TABLE_NAME_DB.ACCOUNTS.NAME, start, perPage];
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

/*Export*/
module.exports = accountDao;