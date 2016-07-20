/**
 * Created by LocNT on 7/29/15.
 */

var GENERIC_SQL = {
    SLQ_FIND : "SELECT * FROM ??",
    SLQ_SEARCH_BASE : "SELECT * FROM ?? WHERE #QUERY",
    SLQ_FIND_WITH_FIELD : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_FIND_WITH_FIELD_AND_ACTIVE : "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?",
    SLQ_ADD_NEW : "INSERT INTO ?? SET ?",
    SLQ_UPDATE : "UPDATE ?? SET ? WHERE ?? = ?",
    SLQ_DO_INACTIVE : "UPDATE ?? SET ?? = 0 WHERE ?? = ?",
    SLQ_REMOVE : "DELETE FROM ?? WHERE ?? = ?"
}

var ACCESS_TOKEN_MODULE = {
    SQL_CHECK_ACCESS : "SELECT * FROM person_access WHERE access_token = ? AND active = 1",
}

/*Exports*/
module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    ACCESS_TOKEN_MODULE : ACCESS_TOKEN_MODULE
}