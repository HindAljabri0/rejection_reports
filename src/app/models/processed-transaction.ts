import { Paginateable } from './paginateable';

export class ProcessedTransaction extends Paginateable {
  memberCardId: string;
  preAuthorizationId: number;
  transactionDate: string;
  status: string;
  payerNphiesId: number;

  constructor(body: {}) {
    super(body);
    this.memberCardId = body['memberCardId'];
    this.preAuthorizationId = body['preAuthorizationId'];
    this.transactionDate = body['transactionDate'];
    this.status = body['status'];
    this.payerNphiesId = body['payerNphiesId'];
  }
}
