/**
 * Created by LocNT on 7/29/15.
 */

var TABLE_NAME_DB = {
    PERSON : {
        NAME : "Persons",
        NAME_FIELD_ID : "id",
        NAME_FIELD_ACTIVE : "isActive"
    },
    ACCOUNTS : {
        NAME : "accounts",
        NAME_FIELD_ID : "accountId",
        NAME_FIELD_ACTIVE : "isActive"
    },
}

var USER_FB_AVATAR_LINK = "https://graph.facebook.com/#fbID/picture?type=large";

/*Exports*/
module.exports = {
    TABLE_NAME_DB : TABLE_NAME_DB,
    USER_FB_AVATAR_LINK : USER_FB_AVATAR_LINK
}