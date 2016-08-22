/**
 * Created by LocNT on 7/29/15.
 */

function ChatGroup(){
    this.id = 0;
    this.uuid = "";
    this.groupName = "";
    this.createdUserId = 0;
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = ChatGroup;
