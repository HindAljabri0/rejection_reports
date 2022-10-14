import { Paginateable } from './paginateable';

export class SearchedClaim extends Paginateable {
  claimResponseId: string;
  processingStatus: string;
  claimId: string;
  providerClaimNumber: string;
  drName: string;
  policyNumber: string;
  memberId: string;
  nationalId: string;
  batchId: number;
  submissionDate: string;
  patientFileNumber: string;
  claimDate: string;
  netAmount: number;
  netVatAmount: number;
  unitOfNetAmount: string;
  unitOfNetVatAmount: string;
  status: string;
  canDelete:boolean;
  statusDetail: string;
  payerId: string;
  eligibilitycheck: string;
  numOfAttachments: number;
  numOfPriceListErrors: number;
  eligibilityStatusDesc: string;
  batchNumber: number;
  statusApproval: string;
  descApproval: string;
  visitDate: string;
  physicianname: string;
  inquiryStatus: string;
  attachmentStatus: string;

  constructor(body: {}) {
    super(body);
    if (body != null) {
      this.claimResponseId = body['claimResponseId'];
      this.claimId = body['claimId'];
      this.claimDate = body['claimDate'];
      this.policyNumber = body['policyNumber'];
      this.memberId = body['memberId'];
      this.nationalId = body['nationalId'];
      this.batchId = body['batchId'];
      this.submissionDate = body['submissionDate'];
      this.netAmount = body['netAmount'];
      this.netVatAmount = body['netVatAmount'];
      this.patientFileNumber = body['patientFileNumber'];
      this.drName = body['drName'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.status = body['status'];
      this.canDelete = body['canDelete'];
      this.statusDetail = body['statusDetail'];
      this.unitOfNetAmount = body['unitOfNetAmount'];
      this.unitOfNetVatAmount = body['unitOfNetVatAmount'];
      this.payerId = body['payerId'];
      this.eligibilitycheck = body['eligibilityCheck'];
      this.numOfAttachments = body['numOfAttachments'];
      this.numOfPriceListErrors = body['numOfPriceListErrors'];
      this.eligibilityStatusDesc = body['eligibilityStatusDesc'];
      this.batchNumber = body['batchNumber'];
      this.statusApproval = body['statusApproval'];
      this.descApproval = body['descApproval'];
      this.processingStatus = body['processingStatus'];
      this.visitDate = body['visitDate'];
      this.physicianname = body['physicianname'];
      this.inquiryStatus = body['inquiryStatus'];
      this.attachmentStatus = body['attachmentStatus'];      
    }
  }
}
