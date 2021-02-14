import { ClaimInfo } from './claimInfo';


export class UploadSummary {
  constructor(json: any = null) {
    if (json !== null) {
      this.uploadName = json.uploadname ? json.uploadname : '';
      this.uploadDate = json.uploaddate ? new Date(json.uploaddate) : null;
      this.uploadSummaryID = json.uploadid ? json.uploadid : '';
      this.noOfUploadedClaims = json.noOfUploadedClaims ? json.noOfUploadedClaims : 0;
      this.netAmountOfUploadedClaims = json.netAmountOfUploadedClaims ? json.netAmountOfUploadedClaims : 0;
      this.netVATAmountOfUploadedClaims = json.netVATAmountOfUploadedClaims ? json.netVATAmountOfUploadedClaims : 0;
      this.noOfAcceptedClaims = json.noOfAcceptedClaims ? json.noOfAcceptedClaims : 0;
      this.netAmountOfAcceptedClaims = json.netAmountOfAcceptedClaims ? json.netAmountOfAcceptedClaims : 0;
      this.netVATAmountOfAcceptedClaims = json.netVATAmountOfAcceptedClaims ? json.netVATAmountOfAcceptedClaims : 0;
      this.noOfNotAcceptedClaims = json.noOfNotAcceptedClaims ? json.noOfNotAcceptedClaims : 0;
      this.netAmountOfNotAcceptedClaims = json.netAmountOfNotAcceptedClaims ? json.netAmountOfNotAcceptedClaims : 0;
      this.netVATAmountOfNotAcceptedClaims = json.netVATAmountOfNotAcceptedClaims ? json.netVATAmountOfNotAcceptedClaims : 0;
      this.noOfNotUploadedClaims = json.noOfNotUploadedClaims ? json.noOfNotUploadedClaims : 0;
      this.noOfDownloadableClaims = json.noOfDownloadableClaims ? json.noOfDownloadableClaims : 0;
      this.netAmountOfDownloadableClaims = json.netAmountOfDownloadableClaims ? json.netAmountOfDownloadableClaims : 0;
      this.netVATAmountOfDownloadableClaims = json.netVATAmountOfDownloadableClaims ? json.netVATAmountOfDownloadableClaims : 0;
      this.ratioForAccepted = json.ratioForAccepted ? json.ratioForAccepted : 0;
      this.ratioForNotAccepted = json.ratioForNotAccepted ? json.ratioForNotAccepted : 0;
      this.ratioForDownloadable = json.ratioForDownloadable ? json.ratioForDownloadable : 0;
    }
  }
  uploadSummaryID: number;
  uploadName: string;
  uploadDate: Date;

  providerClaimNumber: string;

  noOfUploadedClaims: number = 0;
  netAmountOfUploadedClaims: number = 0;
  netVATAmountOfUploadedClaims: number = 0;

  // uploadedClaims: Array<ClaimInfo>;

  noOfAcceptedClaims: number = 0;
  netAmountOfAcceptedClaims: number = 0;
  netVATAmountOfAcceptedClaims: number = 0;

  noOfNotAcceptedClaims: number = 0;
  netAmountOfNotAcceptedClaims: number = 0;
  netVATAmountOfNotAcceptedClaims: number = 0;

  noOfNotUploadedClaims: number = 0;

  noOfDownloadableClaims: number = 0;
  netAmountOfDownloadableClaims: number = 0;
  netVATAmountOfDownloadableClaims: number = 0;
  ratioForAccepted: number = 0;
  ratioForNotAccepted: number = 0;
  ratioForDownloadable: number = 0;
}
