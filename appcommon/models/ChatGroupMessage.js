/**
 * Created by LocNT on 7/29/15.
 */
function ChatGroupMessage(){
    this.id = 0;
    this.uuid = "";
    this.groupUuid = "";
    this.accountId = "";
    this.messageType = "";
    this.messageValue = "";
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = ChatGroupMessage;
