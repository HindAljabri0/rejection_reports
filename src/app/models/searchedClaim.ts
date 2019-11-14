export class SearchedClaim{
  claimId:string;
  claimDate:string;
  memberId:string;
  netAmount:number;
  netVatAmount:number;
  patientFileNumber:string;
  physicianId:string;
  providerClaimNumber:string;
  status:string;
  unitOfNetAmount:string;
  unitOfNetVatAmount:string;
  constructor(body: {}){
    if(body!= null){
      this.claimId = body['claimId'];
      this.claimDate = body['claimDate'];
      this.memberId = body['memberId'];
      this.netAmount = body['netAmount'];
      this.netVatAmount = body['netVatAmount'];
      this.patientFileNumber = body['patientFileNumber'];
      this.physicianId = body['physicianId'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.status = body['status'];
      this.unitOfNetAmount = body['unitOfNetAmount'];
      this.unitOfNetVatAmount = body['unitOfNetVatAmount'];
    }
  }
}