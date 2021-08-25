
export class EligibilityResponseModel {

    banificiaryName: string;
	deptName: string;
	eligibilityStatus: string;
	serviceDate: string;
	transactionDate: string;
	eligibilityPurpose: string[];
    EligibilityResponseError: {
        status: string;
        reasonCode: string;
        massage: string;
    }

	

}