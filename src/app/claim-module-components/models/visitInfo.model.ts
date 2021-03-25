
export class VisitInfo {

    visitDate: Date;
    departmentCode: string;
    visitType: string;

    constructor(claimType: string) {
        if (claimType !== 'INPATIENT')
            this.departmentCode = claimType;
    }
}
