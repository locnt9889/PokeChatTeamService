/**
 * Created by LocNT on 7/29/15.
 */

var nodemailer = require('nodemailer');
var Q = require("q");

var logger = require("../helpers/LoggerService");

var Constant = require("../helpers/Constant");
var CodeStatus = require("../helpers/CodeStatus");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");

// Not the movie transporter!
//var transporter = nodemailer.createTransport({
//    service: 'Gmail',
//    auth: {
//        user: 'nevergone1006@gmail.com', // Your email id
//        pass: 'trangntt11' // Your password
//    }
//});

var transporter = nodemailer.createTransport('smtps://nevergone1006%40gmail.com:trangntt11@smtp.gmail.com');

var sendMail = function(body) {
    var deferred = Q.defer();

    var from = body.from ? body.from : "nevergone1006@gmail.com";
    var to = body.to ? body.to : "locnt9889@gmail.com";
    var subject = body.subject ? body.subject : "Test sendmail by nodejs";
    var text = body.text ? body.text : "hello nevergone"

    var mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            logger.error(CodeStatus.SEND_MAIL.SEND_MAIL_FAILURE.message);
            deferred.reject(CodeStatus.SEND_MAIL.SEND_MAIL_FAILURE);
        }else{
            deferred.resolve(info);
        };
    });

    return deferred.promise;
}

/*exports*/
module.exports = {
    sendMail : sendMail
};