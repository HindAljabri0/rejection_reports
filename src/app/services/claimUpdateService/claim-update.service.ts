import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimUpdateService {

  constructor(private httpClient:HttpClient) { }

  updateClaim(providerId:string, payerId:string, claimId:number, data:{}){
    const requestUrl = `/providers/${providerId}/${claimId}`;
    const httpRequest = new HttpRequest('PUT', environment.claimServiceHost+requestUrl, data);
    return this.httpClient.request(httpRequest);
  }

  deleteClaim(providerId: string, claimId){
    const requestUrl = `/providers/${providerId}/${claimId}`;
    const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost+requestUrl);
    return this.httpClient.request(httpRequest);
  }
}
