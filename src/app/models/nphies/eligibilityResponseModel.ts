import { ResponseCoverageModel } from "./responseCoverageModel";
import { ResponseItemModel } from "./responseItemModel";

export class EligibilityResponseModel {

  transactionId: string;
  responseId:number;
  outgoingTransactionId: string;
  eligibilityRequestId: string;
  beneficiaryName: string;
  documentTypeName: string;
  documentType: string;
  documentId: string;
  subscriberName: string;
  status: string;
  outcome: string;
  disposition: string;
  transfer: boolean;
  isNewBorn: boolean;
  noCoverageFoundReason: string;
  serviceDate: Date;
  payerId: string;
  tpa_Id: string;
  transactionDate: Date;
  nphiesResponseId: string;
  eligibilityIdentifierUrl: string;
  purpose: string[];
  siteEligibility: string;
  siteEligibilityName: string;
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
