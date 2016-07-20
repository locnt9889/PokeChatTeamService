/**
 * Created by LocNT on 7/29/15.
 */

function Person(){
    this.id = 0;
    this.name = "";
    this.email = "";
    this.birthday = new Date();
    this.isActive = true;
    this.added = new Date();
    this.updated = new Date();
};

module.exports = Person;
