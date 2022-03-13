import { ResponseCoverageModel } from "./responseCoverageModel";
import { ResponseItemModel } from "./responseItemModel";

export class EligibilityResponseModel {

    transactionId: string;
    outgoingTransactionId: string;
    eligibilityRequestId: string;
    beneficiaryName: string;
    status: string;
    outcome: string;
    disposition: string;
    transfer:boolean;
    noCoverageFoundReason: string;
    serviceDate: Date;
    transactionDate: Date;
    nphiesResponseId: string;
    purpose: string[];
    errors: {
        code: string;
        message: string;
    }[];

    coverages: {
        memberId: string;
        inforce: string;
        notInforceReason: string;
        benefitStartDate: Date;
        benefitEndDate: Date;
        type: string;
        relationship: string;
        subscriberMemberId: string;
        status: string;
        items: Map<string, {
            name: string;
            description: string;
            network: string;
            unit: string;
            term: string;
            benefits: {
                type: string;
                typeDisplay: string;
                value: string;
                currency: string;
            }[];
        }[]>;
    }[];


}
