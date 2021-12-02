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

  getReconciliationBtsearch(providerId: any, payerId:string, startDate:string, endDate:string, page: number, pageSize: number){
    const requestURL = `/providers/${providerId}/reconciliation-report/fetchReconciliation?payerId=${payerId}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${pageSize}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }

}
