import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderNphiesApprovalService {

  constructor(private http: HttpClient) { }

  sendApprovalRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/request`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }

  getApprovalRequestTransactions(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approvals/fetch/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  cancelApprovalRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/cancel/request`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }

  nullifyApprovalRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/nullify/request`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }



  getTransactionDetails(providerId: string, requestId: number, responseId: number) {
    const requestUrl = `/providers/${providerId}/approval?requestId=${requestId}&responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getTransactionDetailsFromCR(providerId: string, requestId: number, communicationId) {
    // tslint:disable-next-line:max-line-length
    const requestUrl = `/providers/${providerId}/approval/communication-request/detail?requestId=${requestId}&communicationId=${communicationId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getNphisClaimDetails(providerId: string, claimId: number, uploadId: number) {
    const requestUrl = `/providers/${providerId}/claim?claimId=${claimId}&uploadId=${uploadId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  statusCheck(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/checkstatus`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
}
