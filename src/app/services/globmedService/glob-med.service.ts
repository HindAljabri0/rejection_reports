import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobMedService {

  constructor(private http: HttpClient) { }

  search(providerId: string, payerId:string, fromDate: string, toDate: string, type:number, page?: number, pageSize?: number){
    if(type == 1){
      return this.searchClaims(providerId, fromDate, toDate, page, pageSize);
    } else {
      return this.searchClaimsForEBilling(providerId, payerId, fromDate, toDate, page, pageSize);
    }
  }

  private searchClaims(providerId: string, fromDate: string, toDate: string, page?: number, pageSize?: number) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    const requestURL = `/providers/${providerId}/globmed/summary?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getDownloadableClaims(providerId: string, providerName: string, fromDate: string, toDate: string) {
    const requestURL = `/providers/${providerId}/globmed/summary/download?fromDate=${fromDate}&toDate=${toDate}&providerName=${providerName}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "arraybuffer" });
    return this.http.request(request);
  }

  private searchClaimsForEBilling(providerId: string, payerId:string, fromDate: string, toDate: string, page?: number, pageSize?: number) {
    const requestURL = `/providers/${providerId}/globmed/${payerId}/ebilling?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getDownloadableEBillingClaims(providerId: string, payerId:string, providerName: string, fromDate: string, toDate: string) {
    const requestURL = `/providers/${providerId}/globmed/${payerId}/ebilling/download?fromDate=${fromDate}&toDate=${toDate}&providerName=${providerName}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "arraybuffer" });
    return this.http.request(request);
  }

}
