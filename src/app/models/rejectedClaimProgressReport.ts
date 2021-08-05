export class rejectedClaimProgressReport {
    payerId = '';
    beforeDate = '';
    afterDate = '';
    comparisionCriteria = 'Year';
    comparisionType = rejectedClaimComparisionType.TotalNetAmount;
}

export enum rejectedClaimComparisionType {
    TotalNetAmount = 'TOTALNETAMOUNT',
    VATAmount = 'VATAMOUNT',
    SUMOfTopTenRejectedService = 'SUMOfTopTenRejectedService'
}
