import { Address } from "./address";
import { InsurancePlan } from "./insurancePlan";

export class BeneficiaryModel {



    firstName: string;
    middleName: string;
    lastName: string;
    familyName: string;
    fullName: string;
    dob: string;
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
    addresses: Array<Address>;
    insurancePlans: Array<InsurancePlan>;




}