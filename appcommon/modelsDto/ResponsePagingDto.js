/**
 * Created by LocNT on 7/28/15.
 */

/*ResponsePaging dto*/
function ResponsePagingDto(){
    this.items = [];
    this.pageNum = 1;
    this.perPage = 10;
    this.totalItems = 0;
    this.totalPages = 0;
};

module.exports = ResponsePagingDto;