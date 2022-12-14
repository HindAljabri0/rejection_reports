export class GssReportResponse {
    gssReferenceNumber : string;
	providerId : string;
	providerName : string;
	cchiId : string;
	lossMonth : string;
	status : string;
	rejectionReason : string;
	totalNumberOfClaim : number;
	totalGross : CurrencyDetails;
	totalDiscount : CurrencyDetails;
	totalPatientShare : CurrencyDetails;
	totalNet : CurrencyDetails;
	totalNetVat : CurrencyDetails;
	totalNetPayable : CurrencyDetails;
	policyDetails : PolicyDetails[];
	vatInformation: VatInformation;
	
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

export class VatInformation {
     vatNumber : String;
	 totalNumberOfClaims : number;
	 totalGross : CurrencyDetails;
	 totalDiscount : CurrencyDetails;
	 totalPatientShare : CurrencyDetails;
	 taxableAmount : CurrencyDetails;
	 nonTaxableAmount : CurrencyDetails;
	 totalNet : CurrencyDetails;
	 vatRate : CurrencyDetails;
	 totalVatAmount : CurrencyDetails;
	 vatAttachmentUrl : String;
	attachment: AttachmentInquiryResponse;
}

export class AttachmentInquiryResponse {
	attachmentReferenceNo : number;
	payerId : number;
	providerId : number;
	fileName : string;
	fileType : string;
	mimeType : string;
	base64EncodedAttachmentFile : string;
	statusCode : string;
	statusDescription : string;
	providerPayerCode : string;
}