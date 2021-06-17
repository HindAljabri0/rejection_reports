export class ClaimIdentifier {
  payerID: string;
  portalTransactionID: string;
  providerClaimNumber: string;
  providerParentClaimNumber: string;
  providerBatchID: string;
  Payerbatchrefno: string;
  payerClaimNumber: string;
  approvalNumber: string;
  eligibilityNumber: string;
  uploadID: number;

  constructor(providerClaimNumber: string) {
    this.providerClaimNumber = providerClaimNumber;
  }

}
