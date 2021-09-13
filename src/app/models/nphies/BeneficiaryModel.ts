
import { InsurancePlan } from "./insurancePlan";

export class BeneficiaryModel {



    firstName: string;
    middleName: string;
    lastName: string;
    familyName: string;
    fullName: string;
    dob: Date;
    gender: string;
    nationality: string;
    contactNumber: string;
    email: string;
    emergencyNumber: string;
    bloodGroup: string;
    documentType: string;
    documentId: string;
    beneficiaryFileld: string;
    eHealthId: string;
    residencyType: string;
    martialStatus: string;
    preferredLanguage: string;
    addressLine: string;
    streetLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    insurancePlans: Array<InsurancePlan>;




}