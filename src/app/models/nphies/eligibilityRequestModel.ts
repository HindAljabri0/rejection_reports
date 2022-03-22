import { BeneficiariesSearchResult } from "./beneficiaryFullTextSearchResult";
import { InsurancePlan } from "./insurancePlan";


export class EligibilityRequestModel {
    beneficiary: BeneficiariesSearchResult;
    insurancePlan: InsurancePlan;
    serviceDate: string;
    toDate: string;
    benefits: boolean;
    discovery: boolean;
    validation: boolean;
    transfer : boolean;
    isNewBorn: boolean;
}