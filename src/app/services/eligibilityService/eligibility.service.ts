import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EligibilityService {

  constructor(private http: HttpClient) { }

  public checkEligibility(providerId: string, payerId: string, ids: number[]) {
    const requestUrl = `/providers/${providerId}/eligibility?payerId=${payerId}`;
    const request = new HttpRequest('POST', environment.claimServiceHost + requestUrl, ids);
    return this.http.request(request);
  }

  public checkEligibilityByDateOrUploadId(
    providerId: string,
    payerId: string,
    from: string,
    to: string,
    batchId: string,
    uploadId: string,
    casetype: string,
    claimRefNo: string,
    memberId: string,
    invoiceNo: string,
    patientFileNo: string,
    policyNo: string) {
    let requestUrl = `/providers/${providerId}/eligibility/criteria`;
    if (uploadId != null) {
      requestUrl += `?duploadId=${uploadId}`;
    } else if (payerId != null && from != null && to != null) {
      requestUrl += `?payerId=${payerId}&fromDate=${from}&toDate=${to}`;
    } else if (batchId != null) {
      requestUrl += `?batchId=${batchId}`;
    } else if (casetype != null) {
      requestUrl += `?casetype=${casetype}`;
    } else if (claimRefNo != null) {
      requestUrl += `?claimRefNo=${claimRefNo}`;
    } else if (memberId != null) {
      requestUrl += `?nvoiceNo=${invoiceNo}`;
    } else if (patientFileNo != null) {
      requestUrl += `?patientFileNo=${patientFileNo}`;
    } else if (policyNo != null) {
      requestUrl += `?policyNo=${policyNo}`;
    }
    const request = new HttpRequest('POST', environment.claimServiceHost + requestUrl, '');
    return this.http.request(request);
  }
}
