/**
 * Created by LocNT on 8/16/15.
 */

var SUCCESS = {
    code : 0,
    message : "Successfully!"
}

var FAIL = {
    code : 1,
    message : "Failure!"
}

var DB_EXECUTE_ERROR = {
    code : 2,
    message : "Database query is failure!"
}

var ACCESS_TOKEN_INVALID = {
    code : 3,
    message : "Access token is invalid!"
}
var OBJECT_NOT_EXIST = {
    code : 4,
    message : "Id is invalid!"
}
var SEND_MAIL = {
    SEND_MAIL_SUCCESSFUL : {
        code : 1000,
        message : "Send mail is successful!"
    },
    SEND_MAIL_FAILURE : {
        code : 1001,
        message : "Send mail is failure!"
    }
}
module.exports = {
    SUCCESS : SUCCESS,
    FAIL : FAIL,
    DB_EXECUTE_ERROR : DB_EXECUTE_ERROR,
    ACCESS_TOKEN_INVALID : ACCESS_TOKEN_INVALID,
    OBJECT_NOT_EXIST : OBJECT_NOT_EXIST,
    SEND_MAIL : SEND_MAIL
}