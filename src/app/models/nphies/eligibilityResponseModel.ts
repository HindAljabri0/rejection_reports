import { ResponseCoverageModel } from "./responseCoverageModel";
import { ResponseItemModel } from "./responseItemModel";

export class EligibilityResponseModel {
    eligibilityRequestId:string;
    payerNphiesId:string;
    banificiaryName: string;
	deptName: string;
	eligibilityStatus: string;
	serviceDate: string;
	transactionDate: string;
	eligibilityPurpose: string[];
    responseCoverage:ResponseCoverageModel[]
    responseItem:ResponseItemModel[] ;
    error: {
        status: string;
        reasonCode: string;
        massage: string;
    }

	

}