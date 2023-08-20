import { Paginateable } from './paginateable';

export class PreAuthorizationTransaction extends Paginateable{
  requestId: number;
  responseId: number;
  memberCardID: string;
  preAuthorizationID: string;
  transactionDate: string;
  responseTimeStamp: string;
  payerId: number;
  status: string;
  processingStatus: string;
  nphiesRequestId: string;
  beneficiaryName: string;
  documentId: number;
  preAuthRefNo: string;
  provClaimNo: string;
  claimType: string;
  communicationCount:number;
  communicationsRequestCount:number;
  inquiryStatus: string;

  constructor(body: {}) {
    super(body);
    this.requestId = body['requestId'];
    this.responseId = body['responseId'];
    this.memberCardID = body['memberCardID'];
    this.preAuthorizationID = body['preAuthorizationID'];
    this.transactionDate = body['transactionDate'];
    this.responseTimeStamp = body['responseTimeStamp'];
    this.payerId = body['payerId'];
    this.status = body['status'];
    this.processingStatus = body['processingStatus'];
    this.nphiesRequestId = body['nphiesRequestId'];

    this.beneficiaryName = body['beneficiaryName'];
    this.documentId = body['documentId'];
    this.preAuthRefNo = body['preAuthRefNo'];
    this.provClaimNo = body['provClaimNo'];
    this.claimType = body['claimType'];
    this.inquiryStatus = body['inquiryStatus'];
    this.communicationCount = body['communicationCount'];
    this.communicationsRequestCount = body['communicationsRequestCount'];
  }
}
