import { Paginateable } from './paginateable';

export class PreAuthorizationTransaction extends Paginateable{
  requestId: number;
  responseId: number;
  memberCardID: string;
  preAuthorizationID: string;
  transactionDate: string;
  payerId: number;
  status: string;
  processingStatus: string;
  nphiesRequestId: string;
  beneficiaryName: string;
  documentId: number;
  preAuthRefNo: string;

  constructor(body: {}) {
    super(body);
    this.requestId = body['requestId'];
    this.responseId = body['responseId'];
    this.memberCardID = body['memberCardID'];
    this.preAuthorizationID = body['preAuthorizationID'];
    this.transactionDate = body['transactionDate'];
    this.payerId = body['payerId'];
    this.status = body['status'];
    this.processingStatus = body['processingStatus'];
    this.nphiesRequestId = body['nphiesRequestId'];

    this.beneficiaryName = body['beneficiaryName'];
    this.documentId = body['documentId'];
    this.preAuthRefNo = body['preAuthRefNo'];
  }
}
