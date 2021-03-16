export class generateCleanClaimProgressReport {
    payerId = '';
    beforeDate = '';
    afterDate = '';
    comparisionCriteria = 'Year';
    comparisionType = ComparisionType.TotalNetAmount;
}

export enum GrowthRate {
    Up = 1,
    Down = 2,
    Equal = 0
}

export enum ComparisionType {
    TotalNetAmount = 'TOTALNETAMOUNT',
    VATAmount = 'VATAMOUNT',
    CleanClaims = 'CLEANCLAIMS',
    UncleanClaims = 'UNCLEANCLAIMS',
    NumberOfErrors = 'NUMBEROFERRORS'
}
