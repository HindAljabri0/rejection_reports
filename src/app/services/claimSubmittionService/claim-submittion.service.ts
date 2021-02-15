import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimSubmittionService {

  constructor(private http: HttpClient) { }


  submitClaims(claims: string[], providerId: string, payerId: string) {
    let requestURL: string = `/providers/${providerId}/submit?payerID=${payerId}`;
    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, { claimIds: claims }, {});
    return this.http.request(request);
  }

  submitAllClaims(providerId: string, fromDate?: string, toDate?: string, payerId?: string, batchId?: string, uploadId?: string, casetype?: string, claimRefNo?: string, memberId?: string, invoiceNo?: string, patientFileNo?: string, policyNo?: string) {
    let requestURL: string;
   // debugger;
    if (uploadId != null) {
      requestURL = `/providers/${providerId}/submit/criteria?uploadID=${uploadId}`;
    } else if (payerId != null && fromDate != null && toDate != null) {
      requestURL = `/providers/${providerId}/submit/criteria?payerID=${payerId}&fromDate=` + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate);
    } else if (claimRefNo != null) {
      requestURL = `/providers/${providerId}/submit/criteria?claimRefNo=${claimRefNo}`;
    } else if (batchId != null) {
      requestURL = `/providers/${providerId}/submit/criteria?batchId=${batchId}`;
    }
    else if (invoiceNo != null) {
      requestURL = `/providers/${providerId}/submit/criteria?invoiceNo=${invoiceNo}`;
    }
    else if (patientFileNo != null) {
      requestURL = `/providers/${providerId}/submit/criteria?patientFileNo=${patientFileNo}`;
    }
    else if (policyNo != null) {
      requestURL = `/providers/${providerId}/submit/criteria?policyNo=${policyNo}`;
    }
    else  if (memberId != null) {
      requestURL = `/providers/${providerId}/submit/criteria?memberId=${memberId}`;
    }




    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, {});
    return this.http.request(request);
  }
  formatDate(date: string) {
    const splittedDate = date.split('-');
    if (splittedDate[2].length == 4) {
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else return date;
  }
}
