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
        NAME_FIELD_ACTIVE : "isActive",
        NAME_FIELD_EMAIL : "email",
        NAME_FIELD_FACEBOOKID : "facebookId",
        NAME_FIELD_PASSWORD : "password"
    },
    ACCOUNT_DEVICES : {
        NAME : "accounts_device",
        NAME_FIELD_ID : "id",
        NAME_FIELD_ACTIVE : "isActive",
        NAME_FIELD_ACCESS_TOKEN : "accessToken"
    },
    ACCOUNTS_PHONE_CONTACT : {
        NAME : "accounts_phone_contact",
        NAME_FIELD_ID : "id",
        NAME_FIELD_ACTIVE : "isActive",
        NAME_FIELD_ACCOUNT_ID : "accountId"
    }
}

var FOLDER_ROOT = "/home/develop/deploys/PokeChatTeamService";
//FOLDER_ROOT = "/Users/ChungTV/WebstormProjects/Nodejs-MySql/PokeChatTeamService";

var UPLOAD_FILE_CONFIG = {
    MAX_SIZE_IMAGE : {
        ACCOUNT_AVATAR : 3145728,//3Mb
        ACCOUNT_COVER : 5242880,//5Mb
    },
    UPLOAD_FOLDER : FOLDER_ROOT + "/uploads",
    PRE_FOLDER_IMAGE : {
        ACCOUNT_AVATAR : "/Images/Account/#ID/",
        ACCOUNT_COVER : "/Images/Account/#ID/",
    },
    PRE_NAME_IMAGE : {
        ACCOUNT_AVATAR : "ACCOUNT_AVATAR_#ID",
        ACCOUNT_COVER : "ACCOUNT_COVER_#ID",
    }
}

var DEVICE_TYPE = {
    "IOS" : "iOS",
    "ANDROID" : "Android",
    "WINDOW_PHONE" : "WindowPhone"
}
var GET_INFO_FB = {
    USER_FB_AVATAR_LINK : "https://graph.facebook.com/#fbID/picture?type=large",
    URL_CHECK_FB_TOKEN : "https://graph.facebook.com/me?access_token=",
    OPTIONS_GET_INFO_FB : {
        host : 'graph.facebook.com', // here only the domain name
        port : 443,
        path : '/me?access_token=#TokenFB', // the rest of the url with parameters if needed
        method : 'GET', // do GET
        headers : {
            'Content-Type' : 'application/json'
        }
    }
}

/*Exports*/
module.exports = {
    TABLE_NAME_DB : TABLE_NAME_DB,
    DEVICE_TYPE : DEVICE_TYPE,
    GET_INFO_FB : GET_INFO_FB,
    UPLOAD_FILE_CONFIG : UPLOAD_FILE_CONFIG,
    FOLDER_ROOT : FOLDER_ROOT
}