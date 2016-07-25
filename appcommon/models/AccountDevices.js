/**
 * Created by LocNT on 7/29/15.
 */

function AccountDevices(){
    this.id = 0;
    this.accountId = 0;
    this.deviceToken = "";
    this.deviceType = "";
    this.accessToken = "";
    this.isOnline = false;
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = AccountDevices;
