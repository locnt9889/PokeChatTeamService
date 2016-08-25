/**
 * Created by LocNT on 8/16/15.
 */

var COMMON = {
    SUCCESS : {
        code : 0,
        message : "Successfully!"
    },
    FAIL : {
        code : 1,
        message : "Failure!"
    },
    DB_EXECUTE_ERROR : {
        code : 2,
        message : "Database query is failure!"
    },
    ACCESS_TOKEN_INVALID : {
        code : 3,
        message : "Access token is invalid!"
    },
    OBJECT_NOT_EXIST : {
        code : 4,
        message : "Id is invalid!"
    }
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

var ACCOUNT_ACTION = {
    REGISTER :{
        EMAIL_INCORRECT : {
            code : 2001,
            message : "Email is empty or incorrect format."
        },
        FULLNAME_EMPTY : {
            code : 2004,
            message : "Fullname is require field."
        },
        PASSWORD_INCORRECT : {
            code : 2002,
            message : "Password is empty or incorrect length (6-20 character)."
        },
        EMAIL_EXISTED : {
            code : 2003,
            message : "Email is existed."
        }
    },
    LOGIN :{
        LOGIN_FAILURE : {
            code : 2101,
            message : "Login is failure."
        },
        EMAIL_INCORRECT : {
            code : 2102,
            message : "Email is empty or incorrect format."
        },
        DEVICE_TYPE_INCORRECT : {
            code : 2103,
            message : "Device type is incorrect. Please choose iOS,Android or WindowPhone"
        },
        EMPTY_FIELD_REQUIRE : {
            code : 2104,
            message : "Require field is empty."
        },
        LOGIN_EMAIL_FB : {
            code: 2105,
            message: "Login is failure, please login by FB with this email!"
        },
        LOGIN_FB_ERROR_GET_PROFILE_ACCESS : {
            code: 2106,
            message: "Get info of access token is failure!"
        },
        LOGIN_FB_ERROR_EMAIL_NON_FB : {
            code: 2107,
            message: "Login facebook, user is not a user fb!"
        },
        LOGIN_FB_ERROR_ACCESS_TOKEN_INVALID : {
            code: 2108,
            message: "Access token is invalid!"
        }
    },
    PHONE_CONTACT :{
        DATA_SYNC_EMPTY : {
            code : 2200,
            message : "Data sync contact is empty."
        }
    },
    UPLOAD_FILE :{
        UPLOAD_FILE_ERROR : {
            code : 2300,
            message : "Upload file error."
        },
        FILE_EMPTY : {
            code : 2301,
            message : "File is empty."
        },
        FILE_LIMITED_SIZE : {
            code : 2302,
            message : "File is limited size."
        }
    },
    SEARCH_ACCOUNT :{
        SEARCH_TYPE_ERROR : {
            code : 2400,
            message : "Search type is incorrect. Please choose ALL, NAME, EMAIL or PHONE."
        },
        SEARCH_STRING_EMPTY : {
            code : 2401,
            message : "Search string is require field."
        },
        GENDER_ERROR : {
            code : 2402,
            message : "Search gender is incorrect. Please choose ALL, MALE, FEMALE"
        },
    },
    LINK_ACCOUNT_WITH_FB :{
        FACEBOOK_ID_EXISTED : {
            code : 2500,
            message : "Facebook ID of Account is existed."
        },
        FACEBOOK_ID_LINKED : {
            code : 2401,
            message : "Facebook Id is linked for other account."
        }
    },
    FRIENDLY_ACTION :{
        FRIEND_STATUS_EMPTY : {
            code : 2601,
            message : "Friend status is require field."
        },
        FRIEND_STATUS_INCORRECT : {
            code : 2602,
            message : "Friend status is incorrect."
        },
        FRIEND_ID_INCORRECT : {
            code : 2603,
            message : "Friend id is incorrect."
        },
        REQUEST_ACCOUNT_IN_FRIEND_LIST : {
            code : 2604,
            message : "Can not request with account in friend list."
        },
        FRIEND_ACCOUNT_NO_REQUEST : {
            code : 2605,
            message : "Can not make friend with account no have requesting friend with you."
        }
    }
}

var GROUP_ACTION = {
    CREATE: {
        UUID_EMPTY: {
            code: 3001,
            message: "Uuid group is require field."
        },
        FULLNAME_EMPTY: {
            code: 3002,
            message: "Fullname group is require field."
        },
        DO_NOT_PERMISSION: {
            code: 3003,
            message: "Don't have permission update. Only owner group have this permission."
        },
        UUID_GROUP_INVALID: {
            code: 3004,
            message: "uuid group is invalid."
        }
    }
}

module.exports = {
    COMMON : COMMON,
    SEND_MAIL : SEND_MAIL,
    ACCOUNT_ACTION : ACCOUNT_ACTION,
    GROUP_ACTION : GROUP_ACTION
}