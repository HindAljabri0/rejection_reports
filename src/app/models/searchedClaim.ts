import { Paginateable } from './paginateable';

export class SearchedClaim extends Paginateable{
  
  claimId:string;
  providerClaimNumber:string;
  drName:string;
  policyNumber:string;
  memberId:string;
  nationalId:string;
  patientFileNumber:string;
  claimDate:string;
  netAmount:number;
  netVatAmount:number;
  unitOfNetAmount:string;
  unitOfNetVatAmount:string;
  status:string;
  statusDetail:string;
  payerId:string;
  eligibilitycheck:string;
  numOfAttachments:number;
  numOfPriceListErrors:number;

  constructor (body: {}){
    super(body);
    if(body!= null){
      this.claimId = body['claimId'];
      this.claimDate = body['claimDate'];
      this.policyNumber = body['policyNumber'];
      this.memberId = body['memberId'];
      this.nationalId = body['nationalId'];
      this.netAmount = body['netAmount'];
      this.netVatAmount = body['netVatAmount'];
      this.patientFileNumber = body['patientFileNumber'];
      this.drName = body['drName'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.status = body['status'];
      this.statusDetail = body['statusDetail'];
      this.unitOfNetAmount = body['unitOfNetAmount'];
      this.unitOfNetVatAmount = body['unitOfNetVatAmount'];
      this.payerId = body['payerId'];
      this.eligibilitycheck = body['eligibilityCheck'];
      this.numOfAttachments = body['numOfAttachments'];
      this.numOfPriceListErrors = body['numOfPriceListErrors'];
    }
  }
}