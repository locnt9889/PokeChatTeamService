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

        //Listens for new user
        socket.on('NewMessage', function(data) {
            var accessToken = data.accessToken;
            logger.debug("NewMessage data: " + JSON.stringify(data));

            accessTokenService.checkAccessTokenForChat(accessToken).then(function(result){
                socket.account = result;
                //socket.id = result.accountId;

                logger.debug("NewMessage check accesstoken success : " + JSON.stringify(result));
                var chatGroupMessage = new ChatGroupMessage();
                chatGroupMessage.accountId = socket.account.accountId;
                chatGroupMessage.groupUuid = data.groupUuid ? data.groupUuid : "";
                chatGroupMessage.friendId = data.friendId ? data.friendId : 0;
                chatGroupMessage.messageUuid = data.messageUuid;
                chatGroupMessage.messageType = data.messageType;
                chatGroupMessage.messageValue = data.messageValue;

                //Save it to database
                groupChatMessageService.create(chatGroupMessage).then(function(result){
                    //Send message to those connected in the room
                    chatGroupMessage.id = result.insertId;
                    chatGroupMessage.username = socket.account.fullname;
                    logger.debug("NewMessage save success");
                    socket.emit('MessageCreated', chatGroupMessage);
                });
            }, function(err){
                logger.error(JSON.stringify(err));
                logger.debug("NewMessage ErrorAccessToken");
                socket.emit('ErrorAccessToken', {accessToken : accessToken});
            })
        });

        socket.on('disconnect', function(){
            console.log('user disconnected : ' + socket.id);
        });
    });
    /*||||||||||||||||||||END SOCKETS||||||||||||||||||*/
}

module.exports = SocketIoCtrl;
