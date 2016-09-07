/**
 * Created by LocNT on 7/29/15.
 */
function ChatGroupMessage(){
    this.id = 0;
    this.groupUuid = "";
    this.messageUuid = "";
    this.accountId = "";
    this.messageType = "";
    this.messageValue = "";
    this.mediaType = "";
    this.isActive = true;
    this.added = new Date();
};

module.exports = ChatGroupMessage;
