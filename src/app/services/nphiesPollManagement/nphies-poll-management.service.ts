import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authService/authService.service';

@Injectable({
  providedIn: 'root'
})
export class NphiesPollManagementService {

  constructor(private http: HttpClient) { }

  sendCommunication(providerId: string, body: any,isApproval = false,isPrescriber = false) {
    
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = environment.nphiesPollClaimManagement + `/providers/${providerId}/claim/communication`;
    
    if(isApproval){
      requestURL = environment.nphiesPollApprovalManagement + `/providers/${providerId}/approval/communication`;
    }else 
    if(isPrescriber){
        requestURL = environment.nphiesPollApprovalManagement + `/providers/${providerId}/prescriber/communication`;
      }else if(isHeadOffice && !isPrescriber && !isApproval){
      requestURL =environment.nphiesPollClaimManagement + `/head-office/${providerId}/claim/communication`;
    }
    const request = new HttpRequest('POST', requestURL, body);
    return this.http.request(request);
  }

  senPaymentNotice(providerId: string, body: any){
    const requestUrl = `/providers/${providerId}/paymentNotice/save?reconciliationId=${body.reconciliationId}`;
    const request = new HttpRequest('POST', environment.nphiesPollClaimManagement + requestUrl, null);
    return this.http.request(request);
  }
}
