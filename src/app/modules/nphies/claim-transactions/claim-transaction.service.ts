import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaimTransactionService {

  constructor(private http: HttpClient) { }

  getProcessedTransaction(providerId: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/claims/processed?page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl);
    return this.http.request(request);
  }

  getCommunicationRequests(providerId: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/claims/communication-requests?page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl);
    return this.http.request(request);
  }
}
