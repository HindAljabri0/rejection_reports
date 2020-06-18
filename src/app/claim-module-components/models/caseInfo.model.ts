import { Physician } from './physician.model';
import { Patient } from './patient.model';
import { CaseDescription } from './caseDescription.model';

export class CaseInfo {

    caseType: string;
    physician: Physician;
    patient: Patient;
    caseDescription: CaseDescription;
    possibleLineOfTreatment: string;
    otherConditions: string;
    radiologyReport: string;

    constructor(caseType:string){
        this.caseType = caseType;
    }

}