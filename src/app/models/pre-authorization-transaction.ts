import { Paginateable } from './paginateable';

export class PreAuthorizationTransaction extends Paginateable{
  approvalRequestId: number;
  memberCardID: string;
  preAuthorizationID: string;
  transactionDate: string;
  payerId: number;
  status: string;

  constructor(body: {}) {
    super(body);
    this.approvalRequestId = body['approvalRequestId'];
    this.memberCardID = body['memberCardID'];
    this.preAuthorizationID = body['preAuthorizationID'];
    this.transactionDate = body['transactionDate'];
    this.payerId = body['payerId'];
    this.status = body['status'];
  }
}
