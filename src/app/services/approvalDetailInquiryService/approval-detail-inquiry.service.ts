import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClaimCriteriaModel } from 'src/app/models/ClaimCriteriaModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalDetailInquiryService {

  constructor(private http: HttpClient) { }


  verifyApprovalByCriteria(providerId: string, criteria: ClaimCriteriaModel) {
    const requestUrl = `/providers/${providerId}/queue/criteria?` + criteria.toQueryParams();
    const request = new HttpRequest('GET', environment.approvalDetailInquiryService + requestUrl);
    return this.http.request(request);
  }
}
