import { InsurancePlan } from './insurancePlan';

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
  beneficiaryFileId: string;
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
  isNewBorn: boolean;
  insurancePlans: Array<InsurancePlan>;
  documentTypeName: string;
  passportNumber:string;
  borderNumber:string;
  visaType: string;
  visitTitle: string;
  visaNumber:string;
  visaExpiryDate: Date;
}
