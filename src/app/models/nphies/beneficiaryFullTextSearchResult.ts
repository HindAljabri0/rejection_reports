
export class BeneficiariesSearchResult {

  id: number;
  name: string;
  documentId: string;
  documentType: string;

  firstName: string;
  secondName: string;
  thirdName: string;
  familyName: string;
  fullName: string;
  fileId: string;
  dob: string;
  gender: string;


  eHealthId: string;
  nationality: string;
  residencyType: string;
  contactNumber: string;
  maritalStatus: string;
  bloodGroup: string;
  preferredLanguage: string;
  emergencyPhoneNumber: string;
  email: string;
  addressLine: string;
  streetLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isNewBorn?: boolean;


  plans: {
    planId: string;
    payerId: string;
    payerName: string;
    expiryDate: Date;
    memberCardId: string;
    primary: boolean;
    payerNphiesId: string;
    coverageType: string;
    relationWithSubscriber: string;
  }[];
}
