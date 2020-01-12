import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getPaymentSummary(providerId: string, fromDate: string, toDate: string, payerId: string, page?: number, pageSize?: number) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    const requestURL = `/${providerId}/payment/payment-summary?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getPaymentClaimSummary(providerId: string, paymentReference: string, page?: number, pageSize?: number) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    const requestURL = `/${providerId}/payment/payment-claim-summary?` +
      `paymentReference=${paymentReference}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getSubmittedInvoicesSummary(providerId: string, fromDate: string, toDate: string, payerId: string, page?: number, pageSize?: number) {
    if (page == null) page = 0;
    if (pageSize == null) pageSize = 10;
    const requestURL = `/${providerId}/claim/paid?` +
      `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}&page=${page}&size=${pageSize}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getSubmittedServicesOfClaim(providerId: string, payerId: string, claimId: string) {
    const requestURL = `/${providerId}/claim/paid/service?` +
      `payerId=${payerId}&claimId=${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  getPaymentClaimDetail(providerId: string, claimId: number) {
    const requestURL = `/${providerId}/payment/payment-claim-detail?` +
      `claimId=${claimId}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL);
    return this.http.request(request);
  }

  downloadPaymentClaimSummaryAsCSV(providerId: string, paymentReference: string) {
    const requestURL = `/${providerId}/payment/payment-claim-summary/csv?` +
      `paymentReference=${paymentReference}`;
    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "text" });
    return this.http.request(request);
  }

  downloadSubmittedInvoices(providerId: string, fromDate?: string, toDate?: string, payerId?: string) {
    let requestURL: string = '/' + providerId + '/claim/paid/csv?' + status;

    requestURL += `fromDate=${fromDate}&toDate=${toDate}&payerId=${payerId}`;

    const request = new HttpRequest('GET', environment.claimSearchHost + requestURL, "", { responseType: "text" });
    return this.http.request(request);

  }

}
