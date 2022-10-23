import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NphiesDownloadApprovalEligibilityService {

  constructor(private http: HttpClient) { }

  formatDate(date: string) {
    const splittedDate = date.split('-');
    if (splittedDate[2].length == 4) {
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else { return date; }
  }
  downloadApprovleExcelsheet(approvalSearchRequest: ApprovalSearchRequest) {

    let requestURL = `/providers/${approvalSearchRequest.providerId}/approvle?`;

    if (approvalSearchRequest.payerId != null) {
      requestURL += `&payerId=${approvalSearchRequest.payerId}`;
    }
    if (approvalSearchRequest.nphiesRequestId != null) {
      requestURL += `&nphiesRequestId=${approvalSearchRequest.nphiesRequestId}`;
    }
    if (approvalSearchRequest.documentId != null) {
      requestURL += `&documentId=${approvalSearchRequest.documentId}`;
    }
    if (approvalSearchRequest.destinationId) {
      requestURL += `&destinationId=${approvalSearchRequest.destinationId}`;
    }
    if (approvalSearchRequest.status != null) {
      requestURL += `&status=${approvalSearchRequest.status}`;
    }
    if (approvalSearchRequest.preAuthRefNo != null) {
      requestURL += `&preAuthRefNo=${approvalSearchRequest.preAuthRefNo}`;
    }
    if (approvalSearchRequest.requestBundleId != null) {
      requestURL += `&requestBundleId=${approvalSearchRequest.requestBundleId}`;

    }
    if (approvalSearchRequest.type != null) {
      requestURL += `&type=${approvalSearchRequest.type}`;
    }


    if (approvalSearchRequest.fromDate != null) {
      requestURL += `&fromDate=${this.formatDate(approvalSearchRequest.fromDate)}`;
    }

    if (approvalSearchRequest.toDate != null) {
      requestURL += `&toDate=${this.formatDate(approvalSearchRequest.toDate)}`;
    }
    const request = new HttpRequest('GET', environment.nphiesDownloadApprovleEligibility + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }
 


  downloadEligibilityExcelsheet(eligibilitySearchModel: EligibilitySearchModel) {

    let requestURL = `/providers/${eligibilitySearchModel.providerId}/eligibility?`;

    if (eligibilitySearchModel.payerId != null) {
      requestURL += `&payerId=${eligibilitySearchModel.payerId}`;
    }
    if (eligibilitySearchModel.eligibilityId != null) {
      requestURL += `&eligibilityId=${eligibilitySearchModel.eligibilityId}`;
    }
    if (eligibilitySearchModel.documentId != null) {
      requestURL += `&documentId=${eligibilitySearchModel.documentId}`;
    }
   
    if (eligibilitySearchModel.status != null) {
      requestURL += `&status=${eligibilitySearchModel.status}`;
    }
    
 


    if (eligibilitySearchModel.fromDate != null) {
      requestURL += `&fromDate=${this.formatDate(eligibilitySearchModel.fromDate)}`;
    }

    if (eligibilitySearchModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(eligibilitySearchModel.toDate)}`;
    }




    // tslint:disable-next-line:max-line-length
    const request = new HttpRequest('GET', environment.nphiesDownloadApprovleEligibility + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

}
