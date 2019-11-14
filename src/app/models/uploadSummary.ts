import { ClaimInfo } from './claimInfo';


export class UploadSummary {
    uploadSummaryID: string;
    uploadName: string;
    uploadDate: Date;
  
    noOfUploadedClaims: number = 0;
    netAmountOfUploadedClaims: number = 0;
    netVATAmountOfUploadedClaims: number = 0;
  
    uploadedClaims: Array<ClaimInfo>;
  
    noOfAcceptedClaims:number = 0;
    netAmountOfAcceptedClaims: number = 0;
    netVATAmountOfAcceptedClaims: number = 0;
  
    noOfNotAcceptedClaims:number = 0;
    netAmountOfNotAcceptedClaims: number = 0;
    netVATAmountOfNotAcceptedClaims: number = 0;
  
    noOfNotUploadedClaims:number = 0;
  
    constructor(body: {}) {
      if (body != null) {
        this.uploadSummaryID = body['uploadSummaryID'];
        this.uploadName = body['uploadName'];
        this.uploadDate = body['uploadDate'];
  
        this.noOfUploadedClaims = body['noOfUploadedClaims'];
        this.netAmountOfUploadedClaims = body['netAmountOfUploadedClaims'];
        this.netVATAmountOfUploadedClaims = body['netVATAmountOfUploadedClaims'];
  
        this.noOfAcceptedClaims = body['noOfAcceptedClaims'];
        this.netAmountOfAcceptedClaims = body['netAmountOfAcceptedClaims'];
        this.netVATAmountOfAcceptedClaims = body['netVATAmountOfAcceptedClaims'];
  
        this.noOfNotAcceptedClaims = body['noOfNotAcceptedClaims'];
        this.netAmountOfNotAcceptedClaims = body['netAmountOfNotAcceptedClaims'];
        this.netVATAmountOfNotAcceptedClaims = body['netVATAmountOfNotAcceptedClaims'];
  
        this.noOfNotUploadedClaims = body['noOfNotUploadedClaims'];
  
        this.uploadedClaims = new Array();
        for(let uploadedclaim of body['uploadedClaims']){
          let claimInfo:ClaimInfo = new ClaimInfo(uploadedclaim);
          this.uploadedClaims.push(claimInfo);
        }
      }
    }
  }