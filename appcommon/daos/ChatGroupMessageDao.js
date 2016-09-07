/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var chatGroupMessageDao = new MysqlHelper(Constant.TABLE_NAME_DB.CHAT_GROUP_MESSAGE);

var ResponsePagingDto = new require("../modelsDto/ResponsePagingDto");

chatGroupMessageDao.getMessageByGroup = function(groupUuid, added, perPage, pageNum){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    var sqlCount = SqlQueryConstant.CHAT_ACTION_SQL.GET_MESSAGE_BY_GROUP_COUNT;
    var paramCount = [groupUuid, added];

    chatGroupMessageDao.queryExecute(sqlCount, paramCount).then(function(dataCount){
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

        var sql = SqlQueryConstant.CHAT_ACTION_SQL.GET_MESSAGE_BY_GROUP_PAGING;
        var params = [groupUuid, added, start, perPage];

        chatGroupMessageDao.queryExecute(sql, params).then(function(data){
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
module.exports = chatGroupMessageDao;