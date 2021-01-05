import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobMedService {

  constructor(private http: HttpClient) { }

  searchClaims(providerId:string, fromDate:string, toDate:string, page?:number, pageSize?:number){
    if(page == null) page = 0;
    if(pageSize == null) pageSize = 10;
    const requestURL = `/providers/${providerId}/globmed/summary?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getDownloadableClaims(providerId:string, providerName:string, fromDate:string, toDate:string){
    const requestURL = `/providers/${providerId}/globmed/summary/download?fromDate=${fromDate}&toDate=${toDate}&providerName=${providerName}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

}
