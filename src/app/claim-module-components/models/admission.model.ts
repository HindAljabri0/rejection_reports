import { Period } from './period.type';

export class Admission {

    admissionDate: Date;
    admissionType: 'ELECTIVE' | 'EMERGENCY' | 'REFERRAL';
    estimatedLengthOfStay: Period;
    roomNumber: string;
    bedNumber: string;
    discharge: {
        actualLengthOfStay: Period;
        dischargeDate: Date;
    };

    constructor(){
        this.discharge = {actualLengthOfStay: null, dischargeDate: null}
    }
}