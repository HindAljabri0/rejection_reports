import { ClaimError } from './claimError';

export class ClaimInfo {
    fileRowNumber: number;
    providerClaimNumber: string;
    uploadStatus: string;
    uploadSubStatus: string;
    claimErrors: Array <ClaimError>;
    
  }