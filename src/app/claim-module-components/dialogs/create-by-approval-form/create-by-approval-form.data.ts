export class ApprovalFormData {
    claimType: string;
    providerClaimNumber: string;
    payers: { id: number, name: string, arName: string }[] = [];
}
