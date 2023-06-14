import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authService/authService.service';

@Injectable({
  providedIn: 'root'
})
export class NphiesPollManagementService {

  constructor(private http: HttpClient) { }

  sendCommunication(providerId: string, body: any,isApproval = false) {
    
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/communication`;
    if (isHeadOffice && !isApproval) {
      requestURL = `/head-office/${providerId}/claims/communication`;
    }
    const request = new HttpRequest('POST', environment.nphiesPollManagement + requestURL, body);
    return this.http.request(request);
  }

  senPaymentNotice(providerId: string, body: any){
    const requestUrl = `/providers/${providerId}/paymentNotice/save?reconciliationId=${body.reconciliationId}`;
    const request = new HttpRequest('POST', environment.nphiesPollManagement + requestUrl, null);
    return this.http.request(request);
  }
}
