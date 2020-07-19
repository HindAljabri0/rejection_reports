
export class VisitInfo {

    visitDate: Date;
    departmentCode: string;
    visitType: string;

    constructor(claimType:string){
        this.departmentCode = claimType;
    }
}