import { ClaimError } from './claimError';

export class ClaimInfo {
    fileRowNumber: number;
    providerClaimNumber: string;
    uploadStatus: string;
    uploadSubStatus: string;
    claimErrors: Array <ClaimError>;
    constructor(body: {}) {
      if(body != null){
        this.fileRowNumber = body['fileRowNumber'];
        this.providerClaimNumber = body['provclaimno'];
        this.uploadStatus = body['uploadStatus'];
        this.uploadSubStatus = body ['uploadSubStatus'];
        this.claimErrors = new Array();
        for (let error of body ['claimErrors']) {
          this.claimErrors.push(new ClaimError(error));
        }
      }
    }
  }