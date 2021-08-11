import { Address } from "./address";
import { InsurancePlan } from "./insurancePlan";

export class BeneficiaryModel {



    firstName: string;
    secondName: string;
    thirdName: string;
    familyName: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    contactNumber: string;
    email: string;
    emergencyPhoneNumber: string;
    bloodGroup: string;
    documentType: string;
    documentId: string;
    fileId: string;
    eHealthId: string;
    residencyType: string;
    maritalStatus: string;
    preferredLanguage: string;
    addresses: Array<Address>;
    insurancePlans: Array<InsurancePlan>;



    constructor(body: {}) {

        this.firstName = body['fileRowNumber'];
        this.secondName = body['fileRowNumber'];
        this.thirdName = body['fileRowNumber']
        this.familyName = body['fileRowNumber']
        this.fullName = body['fileRowNumber'];
        this.dateOfBirth = body['fileRowNumber']
        this.gender = body['fileRowNumber']
        this.nationality = body['fileRowNumber']
        this.contactNumber = body['fileRowNumber']
        this.email = body['fileRowNumber'];
        this.emergencyPhoneNumber = body['fileRowNumber']
        this.bloodGroup = body['fileRowNumber']
        this.documentType = body['fileRowNumber']
        this.documentId = body['fileRowNumber']
        this.fileId = body['fileRowNumber']
        this.eHealthId = body['fileRowNumber']
        this.residencyType = body['fileRowNumber']
        this.maritalStatus = body['fileRowNumber']
        this.preferredLanguage = body['fileRowNumber']
        this.addresses = body['fileRowNumber'];
        this.insurancePlans = body['fileRowNumber'];

    }




}