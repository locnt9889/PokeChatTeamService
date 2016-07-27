/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var accountsPhoneContactDao = new MysqlHelper(Constant.TABLE_NAME_DB.ACCOUNTS_PHONE_CONTACT);

accountsPhoneContactDao.removeAllPhoneContact = function(accountId){
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_REMOVE;
    var params = [Constant.TABLE_NAME_DB.ACCOUNTS_PHONE_CONTACT.NAME, Constant.TABLE_NAME_DB.ACCOUNTS_PHONE_CONTACT.NAME_FIELD_ACCOUNT_ID, accountId];
    return accountsPhoneContactDao.queryExecute(sql, params);
}

/*Export*/
module.exports = accountsPhoneContactDao;