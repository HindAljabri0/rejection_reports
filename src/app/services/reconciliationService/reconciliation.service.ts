import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AddDiscountReconciliationReport } from 'src/app/models/reconciliationReport';
import { AddFinalRejectionModel } from 'src/app/models/addFinalRejectionModel';
import { AddPaymentReconciliationModel } from 'src/app/models/addPaymentReconciliationModel';

@Injectable({
  providedIn: 'root'
})
export class ReconciliationService {

  constructor(private http: HttpClient) { }

  getReconciliationBtsearch(providerId: any, payerId: string, startDate: string, endDate: string, page?: number, pageSize?: number) {
    const requestURL = `/providers/${providerId}/reconciliation-report/fetchReconciliation?payerId=${payerId}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${pageSize}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL);
    return this.http.request(request);
  }
  getSearchAddReconciliation(providerId: any, payerId: string, startDate: string, endDate: string) {
    const requestURL = `/providers/${providerId}/reconciliation-report/searchDiscount?payerId=${payerId}&startDate=${startDate}&endDate=${endDate}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL);
    return this.http.request(request);
  }

  getReconciliationReceivalble(providerId: any, payerId: string, fromDate: string, toDate: string) {
    const requestURL = `/providers/${providerId}/payment/account/receivable/fetch?payerId=${payerId}&fromDate=${fromDate}&toDate=${toDate}`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }

  getAddDiscount(providerId: string, data: AddDiscountReconciliationReport): Observable<any> {
    const requestURL = `/providers/${providerId}/reconciliation-report/save/discount`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);

  }
  addFinalRejection(providerId: any, data: AddFinalRejectionModel): Observable<any> {
    const requestURL = `/providers/${providerId}/reconciliation-report/saveFinalRejection?reconciliationId=${data.reconciliationId}&finalRejectionAmount=${data.finalRejectionAmount}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }

  addPayment(providerId: any, data: any, paymentId: number) {
    const requestURL = `/providers/${providerId}/reconciliation-report/addPayment?paymentId=${paymentId}&reconciliationId=${data.reconciliationId}&receivableDate=${data.receivableDate}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, {}, { headers: headers });
    return this.http.request(request);
  }

  getArBreakDownData(providerId: any, data: any): Observable<any> {
    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    let requestURL = '';
    if (!data.status) {
      requestURL = `/providers/${providerId}/account/receivable/report`;
    } else {
      requestURL = `/providers/${providerId}/account/receivable/status/report`;
    }
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { params: searchparams });
    return this.http.request(request);
  }

  getArBreakDownCategoryData(providerId: any, data: any): Observable<any> {
    let searchparams = new HttpParams();
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
      }
    }
    const requestURL = `/providers/${providerId}/account/receivable/category/report`;
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { params: searchparams });
    return this.http.request(request);
  }

}
