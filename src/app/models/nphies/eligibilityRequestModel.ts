import { BeneficiariesSearchResult } from "./beneficiaryFullTextSearchResult";
import { InsurancePlan } from "./insurancePlan";


export class EligibilityRequestModel {
  isNewBorn?: boolean;
  beneficiary: BeneficiariesSearchResult;
  subscriber?: BeneficiariesSearchResult;
  insurancePlan: InsurancePlan;
  serviceDate: string;
  toDate: string;
  benefits: boolean;
  discovery: boolean;
  validation: boolean;
  transfer: boolean;
  destinationId: string;
  isEmergency:boolean;
}

