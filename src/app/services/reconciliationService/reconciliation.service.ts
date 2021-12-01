import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ReconciliationReport } from 'src/app/models/reconciliationReport';

@Injectable({
  providedIn: 'root'
})
export class ReconciliationService {

  constructor(private http: HttpClient) { }

  getReconciliationBtsearch(providerId: any,data:ReconciliationReport) : Observable<any> {
    const requestURL = `/providers/${providerId}/reconciliation-report/fetchReconciliation?payerId=${data.payerId}&startDate=${data.startDate}&endDate=${data.endDate}&page=${data.page}&size=${data.size}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }

}
