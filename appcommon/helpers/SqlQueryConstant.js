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
    SEARCH_BY_STRING_COUNT : "SELECT COUNT(ac.accountId) AS TOTAL_ITEMS FROM accounts ac WHERE ac.accountId != ? AND #GENDER AND #LIKE",
    SEARCH_BY_STRING_PAGING : "SELECT ac.*, af.friendStatus FROM accounts ac LEFT JOIN account_friend af ON ac.accountId = af.friendId WHERE ac.accountId != ? AND (af.accountId IS NULL OR af.accountId = ?) AND #GENDER AND #LIKE LIMIT ?, ?",
    REMOVE_PAIR_ACCOUNT_NO_FRIEND : "DELETE FROM ?? WHERE (?? = ? AND ?? = ?) OR (?? = ? AND ?? = ?)",
    UPDATE_FRIEND : "UPDATE ?? SET ?? = ? WHERE (?? = ? AND ?? = ?) OR (?? = ? AND ?? = ?)",
    GET_FRIEND_LIST : "SELECT #SelectList,af.friendStatus  FROM accounts ac INNER JOIN account_friend af ON ac.accountId = af.friendId WHERE ac.isActive = 1 AND af.accountId = ?"
}

var GROUP_ACTION_SQL = {
    GET_MEMBER_OF_GROUP : "SELECT ac.* FROM accounts ac INNER JOIN chat_group_member cgm ON ac.accountId = cgm.accountId WHERE cgm.groupUuid = ?",
    GET_GROUP_BY_MEMBER : "SELECT cg.* FROM chat_group cg INNER JOIN chat_group_member cgm ON cg.uuid = cgm.groupUuid WHERE cgm.accountId = ? AND cg.isActive = 1"
}

var CHAT_ACTION_SQL = {
    GET_MESSAGE_BY_GROUP_COUNT : "SELECT COUNT(id) AS TOTAL_ITEMS FROM chat_group_message WHERE groupUuid = ? AND added < ?",
    GET_MESSAGE_BY_GROUP_PAGING : "SELECT cgm.*, ac.fullname FROM chat_group_message cgm LEFT JOIN accounts ac ON ac.accountId = cgm.accountId WHERE cgm.groupUuid = ? AND cgm.added < ? ORDER BY cgm.added desc LIMIT ?, ?",
    GET_MESSAGE_BY_2_USER_COUNT : "SELECT COUNT(id) AS TOTAL_ITEMS FROM chat_group_message WHERE ((accountId = ? AND friendId = ?) OR (accountId = ? AND friendId = ?)) AND added < ?",
    GET_MESSAGE_BY_2_USER_PAGING : "SELECT cgm.*, ac.fullname AS FULLNAME_ACCOUNT, ac1.fullname AS FULLNAME_FRIEND FROM chat_group_message cgm LEFT JOIN accounts ac ON ac.accountId = cgm.accountId LEFT JOIN accounts ac1 ON ac1.accountId = cgm.friendId WHERE ((cgm.accountId = ? AND cgm.friendId = ?) OR (cgm.accountId = ? AND cgm.friendId = ?)) AND cgm.added < ? ORDER BY cgm.added desc LIMIT ?, ?"
}

/*Exports */
module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    ACCOUNT_ACTION_SQL : ACCOUNT_ACTION_SQL,
    GROUP_ACTION_SQL : GROUP_ACTION_SQL,
    CHAT_ACTION_SQL : CHAT_ACTION_SQL
}