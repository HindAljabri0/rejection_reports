export class ICDDiagnosis {
    diagnosisId: number;
    diagnosisCode: string;
    diagnosisDescription: string;

    constructor(diagnosisId: number, diagnosisCode: string, diagnosisDescription: string) {
        this.diagnosisCode = diagnosisCode;
        this.diagnosisId = diagnosisId;
        this.diagnosisDescription = diagnosisDescription;
    }
}
