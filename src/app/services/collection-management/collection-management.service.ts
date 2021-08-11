import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionManagementService {

  constructor(private http: HttpClient) { }

  addAccountReceivalble(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/payment/account/receivable/save?paymentIds=${data.paymentIds}&receivableDate=${data.receivableDate}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, {}, { headers: headers });
    return this.http.request(request);
  }

  getAccountReceivalble(providerId: any, payerId: any) {
    const requestURL = `/providers/${providerId}/payment/account/receivable/fetch?payerId=${payerId}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }

  deletePayment(providerId: any, payementId: any) {
    const requestURL = `/providers/${providerId}/payment/account/receivable/remove?paymentId=${payementId}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  addIntitalRejection(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/account/receivable/save/rejection`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  getAccountReceivableMonthly(providerId: any, payerId: string, year: string) {
    const requestURL = `/providers/${providerId}/account/receivable/${payerId}/details?year=${year}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  getAccountReceivablePayer(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/account/receivable/payer/by-year`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  getAccountReceivableYear(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/account/receivable/first/by-year`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  getAccountReceivableYearDetailsData(providerId: any, data: any) {
    const requestURL = `/providers/${providerId}/account/receivable/payer/by-month`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  getAccountReceivableDetailsMonthly(providerId: any, payerId: string, month: string) {
    const requestURL = `/providers/${providerId}/account/receivable/fetch/payments/by-month?month=${month}&payerId=${payerId}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }



}
