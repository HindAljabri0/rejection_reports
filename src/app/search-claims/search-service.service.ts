import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {

  constructor(private http:HttpClient) { }

  getSummaries(providerId:string, fromDate:string, toDate:string, payerId:string, status:string){
    const requestURL:string = '/'+providerId+'/search/claim-summary?fromDate='+fromDate
    +'&toDate='+toDate+'&payerId='+payerId+'&status='+status;
    const request = new HttpRequest('GET', environment.claimSearchHost+requestURL);
    return this.http.request(request);
  }

  getResults(providerId:string, fromDate:string, toDate:string, payerId:string, status:string, page?:number, pageSize?:number){
    if(page == null) page = 0;
    if(pageSize == null) pageSize = 10;
    const requestURL:string = '/'+providerId+'/search/claim-results?fromDate='+fromDate
    +'&toDate='+toDate+'&payerId='+payerId+'&status='+status+'&page='+page+'&size='+pageSize;
    const request = new HttpRequest('GET', environment.claimSearchHost+requestURL);
    return this.http.request(request);
  }
}

export class SearchStatusSummary {
  status:string;
  totalClaims:number = 0;
  totalNetAmount:number = 0;
  totalVatNetAmount:number = 0;
  constructor(body:{}){
    if(body != null){
      this.status = body['status'];
      this.totalClaims = body['totalNumber'];
      this.totalNetAmount = body['amount'];
      this.totalVatNetAmount = body['netVatAmount'];
    } else {
      this.status = '-';
    }
  }
}

export class SearchResultPaginator{
  totalElements:number;
  totalPages:number;
  size:number;
  number:number;
  numberOfElements:number;
  first:boolean;
  empty:boolean;
  last:boolean;
  content:ClaimResultContent[];
  constructor(body:{}){
    this.totalElements = body['totalElements'];
    this.totalPages = body['totalPages'];
    this.size = body['size'];
    this.number = body['number'];
    this.numberOfElements = body['numberOfElements'];
    this.first = body['first'];
    this.empty = body['empty'];
    this.content = new Array();
    body['content'].forEach(element => {
      this.content.push(new ClaimResultContent(element));
    });
  }
}
export class ClaimResultContent{
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
