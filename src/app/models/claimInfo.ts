import { ClaimError } from './claimError';
import { Paginateable } from './paginateable';

export class ClaimInfo extends Paginateable {
    fileRowNumber: number;
    providerClaimNumber: string;
    uploadStatus: string;
    uploadSubStatus: string;
    claimErrors: Array <ClaimError>;

    constructor(body:{}){
      super(body);
      this.fileRowNumber = body['fileRowNumber'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.uploadStatus = body['uploadStatus'];
      this.uploadSubStatus = body['uploadSubStatus'];
      this.claimErrors = body['claimErrors'];
    }
    
  }