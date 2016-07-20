/**
 * Created by LocNT on 8/16/15.
 */

var isEmptyFeild = function(feild){
    return feild == undefined || feild == "" || feild.length == 0;
}

var checkValidateEmail = function(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var checkLengthPassword = function(password){
    return (password != undefined && password.length >= 6 && password.length <=20);
}

module.exports = {
    isEmptyFeild : isEmptyFeild,
    checkValidateEmail : checkValidateEmail,
    checkLengthPassword : checkLengthPassword
}