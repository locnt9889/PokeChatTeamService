/**
 * Created by LocNT on 7/28/15.
 */

var groupChatMessageService = require("../services/GroupChatMessageService");
var accessTokenService = require("../services/AccessTokenService");

var ChatGroupMessage = require("../models/ChatGroupMessage");

var logger = require("../helpers/LoggerService");

function SocketIoCtrl(server){
    this.server = server;
}

SocketIoCtrl.prototype.initConfigSocket = function(){
    var io = require('socket.io')(this.server);

    /*||||||||||||||||SOCKET|||||||||||||||||||||||*/
    //Listen for connection
    io.on('connection', function(socket) {
        logger.debug("user connect success : " + socket.id);

        socket.on('RegisterChat', function(data) {
            var accessToken = data.accessToken;
            logger.debug("RegisterChat data: " + JSON.stringify(data));

            accessTokenService.checkAccessTokenForChat(accessToken).then(function(result){
                socket.account = result;
                socket.accessToken = accessToken;
                socket.emit('AccessTokenSuccess', {isSuccessful : true, accountId : socket.account.accountId, accessToken : socket.accessToken});
            }, function(err){
                logger.error(JSON.stringify(err));
                logger.debug("NewMessage ErrorAccessToken");
                socket.emit('AccessTokenError', {accessToken : accessToken});
            })
        });

        //Listens for new user
        socket.on('NewMessage', function(data) {
            logger.debug("NewMessage data: " + JSON.stringify(data));

            if(socket.account && socket.account.accountId > 0) {
                var chatGroupMessage = new ChatGroupMessage();
                chatGroupMessage.accountId = socket.account.accountId;
                chatGroupMessage.groupUuid = data.groupUuid ? data.groupUuid : "";
                chatGroupMessage.friendId = data.friendId ? data.friendId : 0;
                chatGroupMessage.messageUuid = data.messageUuid;
                chatGroupMessage.messageType = data.messageType;
                chatGroupMessage.messageValue = data.messageValue;

                io.emit('MessageCreated', {content : chatGroupMessage, username : socket.account.fullname, avatarImage : socket.account.avatarImage});

                //Save it to database
                //chatGroupMessage.username = socket.account.fullname;
                groupChatMessageService.create(chatGroupMessage).then(function (result) {
                    //Send message to those connected in the room
                    logger.debug("NewMessage save success");
                }, function(err){
                    logger.error("NewMessage save error : " + JSON.stringify(err));
                });
            }else{
                logger.debug("NewMessage save error");
                socket.emit('UnAuthentication', {data : data});
            }
        });

        socket.on('disconnect', function(){
            console.log('user disconnected : ' + socket.id);
        });
    });
    /*||||||||||||||||||||END SOCKETS||||||||||||||||||*/
}

module.exports = SocketIoCtrl;
