/**
 * Created by LocNT on 7/29/15.
 */

function Account(){
    this.accountId = 0;
    this.facebookId = "";
    this.facebookEmail = "";
    this.facebookToken = "";
    this.fullname = "";
    this.phone = "";
    this.email = "";
    this.password = "";
    this.birthday = "0000-00-00";
    this.password = "";
    this.gender = "";
    this.avatarImage = "";
    this.avatarImage = "";
    this.gpsLongitude = 0.0;
    this.gpsLatitude = 0.0;
    this.isActive = true;
    this.isUpdatedInfo = false;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = Account;
