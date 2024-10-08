export class ClaimSearchCriteriaModel {
  providerId?: string;
  claimDate?: string;
  claimSubmissionDate?: string;
  claimResponseDate?: string;
  toDate?: string;
  batchId?: string;
  uploadId?: string;
  claimTypes?: string;
  claimSubTypes?: string[];
  statuses?: string[];
  claimIds?: string;
  netAmount? : string;
  provderClaimReferenceNumber?: string;
  patientFileNo?: string;
  memberId?: string;
  documentId?: string;
  page?: number;
  pageSize?: number;
  payerIds?: string;
  invoiceNo?: string;
  organizationId?: string;
  requestBundleId?: string;
  bundleIds?:string
  isRelatedClaim?:boolean;
  reissueReason?: boolean;
}
