export class SearchStatusSummary {
    statuses:string[];
    totalClaims:number = 0;
    totalNetAmount:number = 0;
    totalVatNetAmount:number = 0;
    uploadName:string;
    constructor(body:{}){
      if(body != null){
        this.statuses = body['statuses'];
        this.totalClaims = body['totalNumber'];
        this.totalNetAmount = body['amount'];
        this.totalVatNetAmount = body['netVatAmount'];
        this.uploadName = body['uploadName'];
      } else {
        this.statuses = ['-'];
      }
    }
  }