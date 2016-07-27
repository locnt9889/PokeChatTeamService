/**
 * Created by LocNT on 7/29/15.
 */

function AccountPhoneContact(){
    this.id = 0;
    this.accountId = 0;
    this.value = "";
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = AccountPhoneContact;
