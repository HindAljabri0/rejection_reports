import { Period } from './period.type';

export class Patient {
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    age: Period;
    dob: Date;
    gender: 'M' | 'F';
    nationality: string;
    patientFileNumber: string;
    contactNumber: string;
}
