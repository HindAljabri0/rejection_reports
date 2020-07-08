
export class ClaimIdentifier {

	payerID: string;
	portalTransactionID: string;
	providerClaimNumber: string;
	providerParentClaimNumber: string;
	providerBatchID: string;
	payerBatchID: string;
	payerClaimNumber: string;
	approvalNumber: string;
	eligibilityNumber: string;
	uploadID: number;

	constructor(providerClaimNumber:string){
		this.providerClaimNumber = providerClaimNumber;
	}

}