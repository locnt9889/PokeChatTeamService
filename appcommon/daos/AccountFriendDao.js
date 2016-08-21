/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var accountFriendDao = new MysqlHelper(Constant.TABLE_NAME_DB.ACCOUNT_FRIEND);

accountFriendDao.deletePairNoFriend = function(accountId, friendId){
    var sql = SqlQueryConstant.ACCOUNT_ACTION_SQL.REMOVE_PAIR_ACCOUNT_NO_FRIEND;
    var params = [Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_ACCOUNT_ID, accountId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_FRIEND_ID, friendId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_ACCOUNT_ID, friendId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_FRIEND_ID, accountId];
    return accountFriendDao.queryExecute(sql, params);
}

accountFriendDao.updateFriendStatus = function(accountId, friendId, status){
    var sql = SqlQueryConstant.ACCOUNT_ACTION_SQL.UPDATE_FRIEND;
    var params = [Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_FRIEND_STATUS, status,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_ACCOUNT_ID, accountId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_FRIEND_ID, friendId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_ACCOUNT_ID, friendId,
        Constant.TABLE_NAME_DB.ACCOUNT_FRIEND.NAME_FIELD_FRIEND_ID, accountId];
    return accountFriendDao.queryExecute(sql, params);
}

accountFriendDao.getFriendList = function(accountId, selectList, statusQuery){
    var sql = SqlQueryConstant.ACCOUNT_ACTION_SQL.GET_FRIEND_LIST;
    sql = sql.replace("#SelectList", selectList);

    if(statusQuery){
        sql = sql + statusQuery;
    }

    var params = [accountId];
    return accountFriendDao.queryExecute(sql, params);
}

/*Export*/
module.exports = accountFriendDao;