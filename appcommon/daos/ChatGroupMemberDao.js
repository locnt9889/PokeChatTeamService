/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");

var MysqlHelper = new require("./MysqlHelper");
var Constant = require("../helpers/Constant");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");
var chatGroupMemberDao = new MysqlHelper(Constant.TABLE_NAME_DB.CHAT_GROUP_MEMBER);

/*Export*/
module.exports = chatGroupMemberDao;