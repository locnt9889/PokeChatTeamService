/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var chatGroupMemberDao = new MysqlHelper(Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER);

chatGroupMemberDao.getListMemberOfGroup = function(uuid){
    var sql = SqlQueryConstant.GROUP_ACTION_SQL.GET_MEMBER_OF_GROUP;
    var params = [uuid];
    return chatGroupMemberDao.queryExecute(sql, params);
}

chatGroupMemberDao.getListGroupByMember = function(accountId){
    var sql = SqlQueryConstant.GROUP_ACTION_SQL.GET_GROUP_BY_MEMBER;
    var params = [accountId];
    return chatGroupMemberDao.queryExecute(sql, params);
}

/*Export*/
module.exports = chatGroupMemberDao;