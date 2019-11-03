import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private http:HttpClient) { }

  getresults(providerId:string, fromDate:string, toDate:string, payerId:string, status:string){
    const requestURL:string = '/'+providerId+'/search/claim-results?fromDate='+fromDate
    +'&toDate='+toDate+'&payerId='+payerId+'&status='+status;
    const request = new HttpRequest('GET', environment.host+requestURL);
    return this.http.request(request);
  }
}


export class ClaimResultData{
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
