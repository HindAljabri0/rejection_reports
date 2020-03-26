import { Paginateable } from './paginateable';

export class SearchedClaim extends Paginateable{
  
  claimId:string;
  claimDate:string;
  memberId:string;
  nationalId:string;
  netAmount:number;
  netVatAmount:number;
  patientFileNumber:string;
  physicianId:string;
  providerClaimNumber:string;
  status:string;
  statusDetail:string;
  unitOfNetAmount:string;
  unitOfNetVatAmount:string;


  constructor (body: {}){
    super(body);
    if(body!= null){
      this.claimId = body['claimId'];
      this.claimDate = body['claimDate'];
      this.memberId = body['memberId'];
      this.nationalId = body['nationalId'];
      this.netAmount = body['netAmount'];
      this.netVatAmount = body['netVatAmount'];
      this.patientFileNumber = body['patientFileNumber'];
      this.physicianId = body['physicianId'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.status = body['status'];
      this.statusDetail = body['statusDetail'];
      this.unitOfNetAmount = body['unitOfNetAmount'];
      this.unitOfNetVatAmount = body['unitOfNetVatAmount'];
    }
  }
}