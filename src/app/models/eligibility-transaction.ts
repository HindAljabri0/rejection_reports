import { Paginateable } from './paginateable';

export class EligibilityTransaction extends Paginateable {
  responseId: number;
  memberId: string;
  eligibilityId: string;
  transactionDate: string;
  insurancePlan: string;
  status: string;

  constructor(body: {}) {
    super(body);
    this.responseId = body['responseId'];
    this.memberId = body['memberId'];
    this.eligibilityId = body['eligibilityId'];
    this.transactionDate = body['transactionDate'];
    this.insurancePlan = body['insurancePlan'];
    this.status = body['status'];
  }
}
