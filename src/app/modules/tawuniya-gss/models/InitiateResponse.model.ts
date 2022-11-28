export class InitiateResponse {
    gssReferenceNumber : string;
	providerId : string;
	providerName : string;
	cchiId : string;
	lossMonth : string;
	status : string;
	totalNumberOfClaim : number;
	totalGross : CurrencyDetails;
	totalDiscount : CurrencyDetails;
	totalPatientShare : CurrencyDetails;
	totalNet : CurrencyDetails;
	totalNetVat : CurrencyDetails;
	totalNetPayable : CurrencyDetails;
	policyDetails : PolicyDetails[];
}

export class CurrencyDetails {
    value : number;
    currencyCode : string;
}

export class PolicyDetails {
    policyNumber : string;
	policyHolderName : string;
	noOfClaims : number;
	gross : CurrencyDetails;
	discount : CurrencyDetails;
	patientShare : CurrencyDetails;
	net : CurrencyDetails;
	netVat : CurrencyDetails;
	netPayable : CurrencyDetails;
}