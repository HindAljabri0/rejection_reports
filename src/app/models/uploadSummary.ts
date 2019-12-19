import { ClaimInfo } from './claimInfo';


export class UploadSummary {
    uploadSummaryID: number;
    uploadName: string;
    uploadDate: Date;
  
    noOfUploadedClaims: number = 0;
    netAmountOfUploadedClaims: number = 0;
    netVATAmountOfUploadedClaims: number = 0;
  
    // uploadedClaims: Array<ClaimInfo>;
  
    noOfAcceptedClaims:number = 0;
    netAmountOfAcceptedClaims: number = 0;
    netVATAmountOfAcceptedClaims: number = 0;
  
    noOfNotAcceptedClaims:number = 0;
    netAmountOfNotAcceptedClaims: number = 0;
    netVATAmountOfNotAcceptedClaims: number = 0;
  
    noOfNotUploadedClaims:number = 0;
  
    
  }