export class SearchStatusSummary {
    status:string;
    totalClaims:number = 0;
    totalNetAmount:number = 0;
    totalVatNetAmount:number = 0;
    constructor(body:{}){
      if(body != null){
        this.status = body['status'];
        this.totalClaims = body['totalNumber'];
        this.totalNetAmount = body['amount'];
        this.totalVatNetAmount = body['netVatAmount'];
      } else {
        this.status = '-';
      }
    }
  }