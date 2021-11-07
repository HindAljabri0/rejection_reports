import { Paginateable } from './paginateable';

export class ProcessedTransaction extends Paginateable {
  memberCardId: string;
  requestId: number;
  responseId: number;
  transactionDate: string;
  status: string;
  payerNphiesId: number;
  notificationId: number;

  constructor(body: {}) {
    super(body);
    this.memberCardId = body['memberCardId'];
    this.requestId = body['requestId'];
    this.responseId = body['responseId'];
    this.transactionDate = body['transactionDate'];
    this.status = body['status'];
    this.payerNphiesId = body['payerNphiesId'];
    this.notificationId = body['notificationId'];
  }
}
