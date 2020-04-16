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

  public checkEligibilityByDateOrUploadId(providerId:string, payerId:string, from:string, to:string, uploadId:string){
    let requestUrl = `/providers/${providerId}/eligibility/criteria`;
    if(uploadId != null){
      requestUrl += `?payerId=${payerId}&uploadId=${uploadId}`;
    } else  {
      requestUrl += `?payerId=${payerId}&fromDate=${from}&toDate=${to}`;
    }
    const request = new HttpRequest('POST', environment.claimServiceHost+requestUrl, '');
    return this.http.request(request);
  }
}
