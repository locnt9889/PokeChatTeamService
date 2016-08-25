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

var ACCOUNT_ACTION_SQL = {
    SEARCH_BY_STRING_COUNT : "SELECT COUNT(ac.*) AS TOTAL_ITEMS FROM accounts ac WHERE ac.accountId != ? AND #GENDER AND #LIKE",
    SEARCH_BY_STRING_PAGING : "SELECT ac.*, af.friendStatus FROM accounts ac LEFT JOIN account_friend af ON ac.accountId = af.friendId WHERE ac.accountId != ? AND af.accountId = ? AND #GENDER AND #LIKE LIMIT ?, ?",
    REMOVE_PAIR_ACCOUNT_NO_FRIEND : "DELETE FROM ?? WHERE (?? = ? AND ?? = ?) OR (?? = ? AND ?? = ?)",
    UPDATE_FRIEND : "UPDATE ?? SET ?? = ? WHERE (?? = ? AND ?? = ?) OR (?? = ? AND ?? = ?)",
    GET_FRIEND_LIST : "SELECT #SelectList,af.friendStatus  FROM accounts ac INNER JOIN account_friend af ON ac.accountId = af.friendId WHERE ac.isActive = 1 AND af.accountId = ?"
}

/*Exports*/
module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    ACCOUNT_ACTION_SQL : ACCOUNT_ACTION_SQL
}