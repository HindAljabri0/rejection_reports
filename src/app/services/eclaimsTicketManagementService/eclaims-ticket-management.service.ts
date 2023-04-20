import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EclaimsTicketManagementService {

  constructor(private http: HttpClient) { }

  sendEclaimsTicket(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/ticket/create`;
    const request = new HttpRequest('POST', environment.eclaimsTicketManagement + requestUrl, body);
    return this.http.request(request);
  }
  sendTicketReply(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/ticket/reply/create`;
    const request = new HttpRequest('POST', environment.eclaimsTicketManagement + requestUrl, body);
    return this.http.request(request);
  }
  fetchEclaimsTicketSummary(providerId: string, queryString: string, status: string, pageIndex: number, pageSize: number) {
    const requestUrl = `/providers/${providerId}/ticket?query=${queryString}&status=${status}&page=${pageIndex}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.eclaimsTicketManagement + requestUrl);
    return this.http.request(request);
  }

  fetchEclaimsTicketDetails(providerId: string, ticketId: any) {
    const requestUrl = `/providers/${providerId}/ticket/details/${ticketId}`;
    const request = new HttpRequest('GET', environment.eclaimsTicketManagement + requestUrl);
    return this.http.request(request);
  }

  fetchPayerList() {
    const requestUrl = `/providers/lov/payers`;
    const request = new HttpRequest('GET', environment.eclaimsTicketManagement + requestUrl);
    return this.http.request(request);
  }

  fetchProductList() {
    const requestUrl = `/providers/lov/products`;
    const request = new HttpRequest('GET', environment.eclaimsTicketManagement + requestUrl);
    return this.http.request(request);
  }

  fetchTypeList() {
    const requestUrl = `/providers/lov/types`;
    const request = new HttpRequest('GET', environment.eclaimsTicketManagement + requestUrl);
    return this.http.request(request);
  }
}
