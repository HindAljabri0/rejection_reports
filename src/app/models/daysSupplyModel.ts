import { Paginateable } from "./paginateable";

export class daysSupplyModel extends Paginateable {

    listId: number;
    standardCode: string;
    standardDesc: string;
    daysOfSupply: string;
    providerId: number;
    uploadedDate: string;
  
    constructor(body: {}) {
      super(body);
      this.listId = body['listId'];
      this.standardCode= body['standardCode'];
      this.standardDesc= body['standardDesc'];
      this.daysOfSupply=  body['daysOfSupply'];
      this.providerId = body['providerId'];
      this.uploadedDate = body['uploadedDate'];
    }
  }