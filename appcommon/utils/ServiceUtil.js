/**
 * Created by LocNT on 8/17/15.
 */

var uuid = require('node-uuid');
var MD5 = require("MD5");
var CodeStatus = require("../helpers/CodeStatus");

var generateAccessToken = function() {
    var newUuid = uuid.v1();
    return newUuid;
}

var md5Encode = function(str){
    return MD5(str);
}

var generateObjectError = function(responseObj, errorObj, message, code){
    responseObj.statusErrorCode = code ? code : errorObj.code;
    responseObj.errorsObject = errorObj.error ? errorObj.error : errorObj;
    responseObj.errorsMessage = message ? message : errorObj.message;

    return responseObj;
}

/*Export*/
module.exports = {
    generateAccessToken : generateAccessToken,
    md5Encode : md5Encode,
    generateObjectError : generateObjectError
}