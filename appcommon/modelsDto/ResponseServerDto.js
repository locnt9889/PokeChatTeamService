/**
 * Created by LocNT on 7/28/15.
 */

/*MysqlResponse dto ajax*/
function ResponseServerDto(){
    this.errorsObject = {};
    this.errorsMessage = "";
    this.results = {};
    this.statusErrorCode = 0;
};

module.exports = ResponseServerDto;