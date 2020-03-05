import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimSubmittionService {

  constructor(private http:HttpClient) { }


  submitClaims(claims:string[], providerId:string, payerId:string){
    let requestURL:string = `/providers/${providerId}/submit`;
    const request = new HttpRequest('POST', environment.claimServiceHost+requestURL, {claimIds:claims},  {});
    return this.http.request(request);
  }

  submitAllClaims(providerId:string, fromDate:string, toDate:string, payerId:string){
    let requestURL:string = `/providers/${providerId}/submit/criteria?fromDate=`+fromDate
    +'&toDate='+toDate;
    const request = new HttpRequest('POST', environment.claimServiceHost+requestURL,  {});
    return this.http.request(request);
  }
}
