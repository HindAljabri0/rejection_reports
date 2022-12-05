

export class GSSConfirmationRequest {
	providerId: string;
	username: string;
	lossMonth: string;
}

export class ConfirmationVatInfo {
    vatNo : string;
	claimCount : number;
	grossAmount : number;
	discount : number;
	taxableAmount : number;
	nonTaxableAmount : number;
	patientShare : number
}