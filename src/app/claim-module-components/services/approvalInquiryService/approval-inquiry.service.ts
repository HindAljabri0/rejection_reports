import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalInquiryService {

  constructor(private http: HttpClient) { }

  getClaimDataByApprovalNumber(providerId: string, payerId: string, approvalNumber: string, approvalType: string) {
    const requestUrl = `/providers/${providerId}/inquiry/approval`;
    const body = {
      approvalReferenceNumber: approvalNumber,
      approvalType,
      payerId
    };
    const request = new HttpRequest('POST', environment.claimInquireServiceHost + requestUrl, body);
    return this.http.request(request);
  }
}
