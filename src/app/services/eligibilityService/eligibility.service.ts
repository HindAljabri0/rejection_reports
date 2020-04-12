import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EligibilityService {

  constructor(private http:HttpClient) { }

  public checkEligibility(providerId:string, payerId:string, ids:number[]){
    const requestUrl = `/providers/${providerId}/eligibility?payerId=${payerId}`;
    const request = new HttpRequest('POST', environment.claimServiceHost+requestUrl, ids);
    return this.http.request(request);
  }

  public checkEligibilityByDate(providerId:string, payerId:string, from:string, to:string){
    const requestUrl = `/providers/${providerId}/eligibility/criteria?payerId=${payerId}&fromDate=${from}&toDate=${to}`;
    const request = new HttpRequest('POST', environment.claimServiceHost+requestUrl, '');
    return this.http.request(request);
  }
}
