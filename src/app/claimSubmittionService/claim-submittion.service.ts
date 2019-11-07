import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimSubmittionService {

  constructor(private http:HttpClient) { }


  submitClaims(claims:string[], providerId:string, payerId:string){
    let requestURL:string = `/${providerId}/${payerId}/claims/queue?claimids=`;
    for(let claim of claims){
      requestURL += claim + ','
    }
    const request = new HttpRequest('POST', environment.claimServiceHost+requestURL.substr(0,requestURL.length-1), {});
    return this.http.request(request);
  }
}
