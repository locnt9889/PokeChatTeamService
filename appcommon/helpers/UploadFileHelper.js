/**
 * Created by LocNT on 7/29/15.
 */

var Q = require("q");

var fs = require('fs');
var path = require("path");
var mkdirp = require("mkdirp");
var logger = require("../helpers/LoggerService");

var Constant = require("../helpers/Constant");
var ServiceUtil = require("../utils/ServiceUtil");

var writeFileUpload = function(fileName, newPreFile,filePath, preFolder){
    var deferred = Q.defer();

    //remove white space in filename
    var ext = ServiceUtil.getExtFileByName(fileName);
    fs.readFile(filePath, function (err,data) {
        if (err) {
            logger.error(JSON.stringify(err));
            deferred.reject(err);
        }else {
            var currentDate = new Date();
            var filepathSave = newPreFile + "_" + currentDate.getTime() + ext;
            var fullFilePath = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + preFolder;

            fs.exists(fullFilePath, function(result){
                if(!result){
                    mkdirp(path.resolve(fullFilePath), function (err) {
                        if (err) {
                            logger.error(JSON.stringify(err));
                            deferred.reject(err);
                        }else{
                            fs.writeFile(fullFilePath + filepathSave, data, function (err) {
                                if (err) {
                                    logger.error(JSON.stringify(err));
                                    deferred.reject(err);
                                }else{
                                    deferred.resolve(filepathSave);
                                }
                            });
                        }
                    });
                }else{
                    fs.writeFile(fullFilePath + filepathSave, data, function (err) {
                        if (err) {
                            logger.error(JSON.stringify(err));
                            deferred.reject(err);
                        }else{
                            deferred.resolve(filepathSave);
                        }
                    });
                }
            });
        }
    });
    return deferred.promise;
}

var viewFile = function (res, filePath) {
    var fullFile = Constant.UPLOAD_FILE_CONFIG.UPLOAD_FOLDER + filePath;
    fs.stat(fullFile, function(err){
        if(!err){
            res.sendFile(path.resolve(fullFile));
        }else{
            res.writeHead(404);
            res.end();
        }
    });
}

/*Exports*/
module.exports = {
    writeFileUpload : writeFileUpload,
    viewFile : viewFile

}