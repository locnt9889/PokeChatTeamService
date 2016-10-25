/**
 * Created by LocNT on 7/29/15.
 */
function ChatGroupMessage(){
    this.id = 0;
    this.groupUuid = "";
    this.messageUuid = "";
    this.accountId = 0;
    this.friendId = 0;
    this.messageType = "";
    this.messageValue = "";
    this.mediaType = "";
    this.isActive = true;
    this.added = new Date();
};

module.exports = ChatGroupMessage;
