/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var accountDevicesDao = new MysqlHelper(Constant.TABLE_NAME_DB.ACCOUNT_DEVICES);

/*Export*/
module.exports = accountDevicesDao;