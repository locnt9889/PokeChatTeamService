/**
 * Created by LocNT on 7/29/15.
 */

function ChatGroupMember(){
    this.id = 0;
    this.groupUuid = "";
    this.accountId = "";
    this.isShowGps = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = ChatGroupMember;
