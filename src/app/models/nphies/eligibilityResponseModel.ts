
export class EligibilityResponseModel {
    eligibilityRequestId:string;
    payerNphiesId:string;
    banificiaryName: string;
	deptName: string;
	eligibilityStatus: string;
	serviceDate: string;
	transactionDate: string;
	eligibilityPurpose: string[];
    error: {
        status: string;
        reasonCode: string;
        massage: string;
    }

	

}