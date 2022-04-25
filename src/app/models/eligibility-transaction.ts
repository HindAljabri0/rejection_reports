import { Paginateable } from './paginateable';

export class EligibilityTransaction extends Paginateable {
  responseId: number;
  eligibilityResponseId: string;
  memberId: string;
  eligibilityId: string;
  transactionDate: string;
  // insurancePlan: string;
  beneficiaryName: string;
  payer: number;
  status: string;
  purpose: string[];
  documentId: number;
  siteEligibility: string;

  constructor(body: {}) {
    super(body);
    this.responseId = body['responseId'];
    this.eligibilityResponseId = body['eligibilityResponseId'];
    this.memberId = body['memberId'];
    this.eligibilityId = body['eligibilityId'];
    this.transactionDate = body['transactionDate'];
    // this.insurancePlan = body['insurancePlan'];
    this.beneficiaryName = body['beneficairyName'];
    this.payer = body['payer'];
    this.purpose = body['purpose'];
    this.status = body['status'];
    this.documentId = body['documentId'];
    this.siteEligibility = body['siteEligibility'];
  }
}
