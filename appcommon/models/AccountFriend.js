/**
 * Created by LocNT on 7/29/15.
 */

function AccountFriend(){
    this.id = 0;
    this.accountId = 0;
    this.friendId = 0;
    this.friendStatus = "";
    this.isBlocked = false;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = AccountFriend;
