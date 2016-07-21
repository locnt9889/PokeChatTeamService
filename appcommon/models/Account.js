/**
 * Created by LocNT on 7/29/15.
 */

function Accounts(){
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
    this.gender = 0;
    this.avatarImage = "";
    this.avatarImage = "";
    this.gpsLongitude = "";
    this.gpsLatitude = "";
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = Accounts;
