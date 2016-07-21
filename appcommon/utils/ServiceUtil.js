/**
 * Created by LocNT on 8/17/15.
 */

var uuid = require('node-uuid');
var MD5 = require("MD5");

var generateAccessToken = function() {
    var newUuid = uuid.v1();
    return newUuid;
}

var md5Encode = function(str){
    return MD5(str);
}

/*Export*/
module.exports = {
    generateAccessToken : generateAccessToken,
    md5Encode : md5Encode
}