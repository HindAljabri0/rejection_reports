import { Paginateable } from './paginateable';

export class PreAuthorizationTransaction extends Paginateable{
  responseId: number;
  memberId: string;
  preAuthorizationRequestId: string;
  transactionDate: string;
  // insurancePlan: string;
  beneficiaryName: string;
  payer: number;
  status: string;
  purpose: string[];

  constructor(body: {}) {
    super(body);
    this.responseId = body['responseId'];
    this.memberId = body['memberId'];
    this.preAuthorizationRequestId = body['eligibilityId'];
    this.transactionDate = body['transactionDate'];
    // this.insurancePlan = body['insurancePlan'];
    this.beneficiaryName = body['beneficairyName'];
    this.payer = body['payer'];
    this.purpose = body['purpose'];
    this.status = body['status'];
  }
}
