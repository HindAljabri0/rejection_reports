import { ClaimError } from './claimError';
import { Paginateable } from './paginateable';

export class ClaimInfo extends Paginateable {
  fileRowNumber: number;
  provclaimno: string;
  uploadStatus: string;
  uploadSubStatus: string;
  claimErrors: Array<ClaimError>;

  constructor(body: {}) {
    super(body);
    this.fileRowNumber = body['fileRowNumber'];
    this.provclaimno = body['provclaimno'];
    this.uploadStatus = body['uploadStatus'];
    this.uploadSubStatus = body['uploadSubStatus'];
    this.claimErrors = body['claimErrors'];
  }

}
