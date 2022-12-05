

export class VatInformationRequest {
	providerId: number;
	username: string;
	lossMonth: string;

	gssReferenceNumber: string
	
	vatNo : string;
	claimCount : number;
	grossAmount : number;
	discount : number;
	taxableAmount : number;
	nonTaxableAmount : number;
	patientShare : number;
	vatRate: number;

	attachmentUrl: string;
}
