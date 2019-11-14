import { SearchedClaim } from './searchedClaim';

export class PaginatedSearchResult{
    totalElements:number;
    totalPages:number;
    size:number;
    number:number;
    numberOfElements:number;
    first:boolean;
    empty:boolean;
    last:boolean;
    content:SearchedClaim[];
    constructor(body:{}){
      this.totalElements = body['totalElements'];
      this.totalPages = body['totalPages'];
      this.size = body['size'];
      this.number = body['number'];
      this.numberOfElements = body['numberOfElements'];
      this.first = body['first'];
      this.empty = body['empty'];
      this.content = new Array();
      body['content'].forEach(element => {
        this.content.push(new SearchedClaim(element));
      });
    }
  }