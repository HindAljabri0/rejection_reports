import { Paginateable } from './paginateable';

export class PaginatedResult<T extends Paginateable> {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  last: boolean;
  content: T[];

  constructor(body: {}, private type: new (body: {}) => T) {
    this.totalElements = body['totalElements'];
    this.totalPages = body['totalPages'];
    this.size = body['size'];
    this.number = body['number'];
    this.numberOfElements = body['numberOfElements'];
    this.first = body['first'];
    this.empty = body['empty'];
    this.content = new Array();
    body['content'].forEach(element => {
      this.content.push(this.getNew(element));
    });
  }

  getNew(body: {}): T {
    return new this.type(body);
  }
}
