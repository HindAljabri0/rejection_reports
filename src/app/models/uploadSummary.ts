import { ClaimInfo } from './claimInfo';


export class UploadSummary {
  constructor(json: any = null) {
    if (json !== null) {
      this.uploadName = json.uploadname ? json.uploadname : '';
      this.uploadDate = json.uploaddate ? new Date(json.uploaddate) : null;
      this.uploadSummaryID = json.uploadid ? json.uploadid : '';
      this.uploadId=json.uploadid ? json.uploadid : '';
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
  // static fromnaphisSummaryresponse(data: any): UploadSummary {
  //   return {
  //     uploadName: data.uploadName,
  //     uploadDate: data.uploadDate,
  //     uploadSummaryID: data.uploadId,
  //     noOfUploadedClaims: data.noOfNotUploadedClaims,
  //     netAmountOfUploadedClaims: data.totalAmtOfUploadedClaims,
  //     // netVATAmountOfAcceptedClaims: data,
  //     // netVATAmountOfNotAcceptedClaims: data.,
  //     noOfNotAcceptedClaims: data.noOfAcceptedClaims,
  //     noOfNotUploadedClaims: data.noOfUploadedClaims,
  //     // netAmountOfNotAcceptedClaims: data,
  //     noOfNotUploadedClaims: data.noOfNotUploadedClaims,
  //     noOfDownloadableClaims: data.noOfNotAcceptedClaims,
  //     // netAmountOfDownloadableClaims: data.,
  //     // netVATAmountOfDownloadableClaims: data.,
  //     ratioForAccepted: data.ratioOfAccepted,
  //     ratioForNotAccepted: data.ratioOfNotAccepted,
  //     // ratioForDownloadable: data.,
  //   };

  // }
  uploadSummaryID: number;
  uploadId:number;
  uploadName: string;
  uploadDate: Date;

  providerClaimNumber: string;

  noOfUploadedClaims = 0;
  netAmountOfUploadedClaims = 0;
  netVATAmountOfUploadedClaims = 0;

  // uploadedClaims: Array<ClaimInfo>;

  noOfAcceptedClaims = 0;
  netAmountOfAcceptedClaims = 0;
  netVATAmountOfAcceptedClaims = 0;

  noOfNotAcceptedClaims = 0;
  netAmountOfNotAcceptedClaims = 0;
  netVATAmountOfNotAcceptedClaims = 0;

  noOfNotUploadedClaims = 0;

  noOfDownloadableClaims = 0;
  netAmountOfDownloadableClaims = 0;
  netVATAmountOfDownloadableClaims = 0;
  ratioForAccepted = 0;
  ratioForNotAccepted = 0;
  ratioForDownloadable = 0;
}
