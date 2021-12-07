import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AddDiscountReconciliationReport } from 'src/app/models/reconciliationReport';
import{AddFinalRejectionModel} from 'src/app/models/addFinalRejectionModel';

@Injectable({
  providedIn: 'root'
})
export class ReconciliationService {

  constructor(private http: HttpClient) { }

  getReconciliationBtsearch(providerId: any, payerId:string, startDate:string, endDate:string, page: number, pageSize: number){
    const requestURL = `/providers/${providerId}/reconciliation-report/fetchReconciliation?payerId=${payerId}&startDate=${startDate}&endDate=${endDate}&page=${page}&size=${pageSize}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL);
    return this.http.request(request);
  }
  getSearchAddReconciliation(providerId: any, payerId:string, startDate:string, endDate:string){
    const requestURL = `/providers/${providerId}/reconciliation-report/searchDiscount?payerId=${payerId}&startDate=${startDate}&endDate=${endDate}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL);
    return this.http.request(request);
  }

  getAddDiscount(providerId: string, data:AddDiscountReconciliationReport): Observable<any>{
    const requestURL = `/providers/${providerId}/reconciliation-report/save/addDiscount`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
 
  }
  addFinalRejection(providerId: any, data:AddFinalRejectionModel): Observable<any> { 
    const requestURL = `/providers/${providerId}/reconciliation-report/saveFinalRejection?reconciliationId=${data.reconciliationId}&finalRejectionAmount=${data.finalRejectionAmount}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, data, { headers: headers });
    return this.http.request(request);
  }
  

}
