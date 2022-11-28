

export class GSSConfirmationRequest {
	providerId: string;
	userName: string;
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