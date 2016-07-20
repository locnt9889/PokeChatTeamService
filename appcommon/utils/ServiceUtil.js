/**
 * Created by LocNT on 8/17/15.
 */

var uuid = require('node-uuid');

var generateAccessToken = function() {
    var newUuid = uuid.v1();
    return newUuid;
}

/*Export*/
module.exports = {
    generateAccessToken : generateAccessToken
}