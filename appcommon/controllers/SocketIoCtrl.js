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
        console.log("user connect success : " + socket.id);

        //Listens for new user
        socket.on('InitChatroom', function(data) {
            console.log("join to room")
            var accessToken = data.accessToken;

            accessTokenService.checkAccessTokenForChat(accessToken).then(function(result){
                socket.account = result;
                socket.chatGroups = data.groups ? data.groups : [];

                //New user joins room
                for(var i = 0; i < socket.chatGroups.length; i++){
                    socket.join(socket.chatGroups[i]);
                }

                //config
                //Listens for a new chat message
                socket.on('NewMessage', function(data) {
                    var chatGroupMessage = new ChatGroupMessage();
                    chatGroupMessage.accountId = socket.account.accountId;
                    chatGroupMessage.groupUuid = data.groupUuid;
                    chatGroupMessage.messageUuid = data.messageUuid;
                    chatGroupMessage.messageType = data.messageType;
                    chatGroupMessage.messageValue = data.messageValue;

                    //Save it to database
                    groupChatMessageService.create(chatGroupMessage).then(function(result){
                        //Send message to those connected in the room
                        chatGroupMessage.id = result.insertId;
                        chatGroupMessage.username = socket.account.fullname;
                        io.in(chatGroupMessage.groupUuid).emit('MessageCreated', chatGroupMessage);
                    });
                });

                socket.on('LeftGroup', function(data){
                    socket.leave(data);
                });

                socket.on('disconnect', function(){
                    console.log('user disconnected : ' + socket.id);
                    //user leave room when disconnect
                    for(var i = 0; i < socket.chatGroups.length; i++){
                        socket.leave(socket.chatGroups[i]);
                    }
                });
            }, function(err){
                logger.error(JSON.stringify(err));
            })
        });
    });
    /*||||||||||||||||||||END SOCKETS||||||||||||||||||*/
}

module.exports = SocketIoCtrl;
