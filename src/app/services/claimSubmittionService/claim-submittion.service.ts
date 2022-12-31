import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimSubmittionService {

  constructor(private http: HttpClient) { }


  submitClaims(claims: string[], providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/submit?payerID=${payerId}`;
    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, { claimIds: claims }, {});
    return this.http.request(request);
  }

  submitAllClaims(
    providerId: string,
    fromDate?: string,
    toDate?: string,
    payerId?: string,
    organizationId?: string,
    batchId?: string,
    uploadId?: string,
    casetype?: string,
    claimIds?: string[],
    claimRefNo?: string,
    memberId?: string,
    invoiceNo?: string,
    patientFileNo?: string,
    policyNo?: string,
    drname?: string,
    nationalId?: string,
    claimDate?: string,
    netAmount?:string,
    batchNo?:string) {
    let requestURL: string;

    requestURL = `/providers/${providerId}/submit/criteria?`;
    if (uploadId != null) {
      requestURL += `uploadId=${uploadId}`;
    } else if ((payerId != null || organizationId != null) && fromDate != null && toDate != null) {
      requestURL += `payerID=${payerId}&organizationId=${organizationId}&fromDate=` + this.formatDate(fromDate)
        + '&toDate=' + this.formatDate(toDate);
    } else if (batchId != null) {
      requestURL += `batchId=${batchId}`;
    } else if (invoiceNo != null) {
      requestURL += `invoiceNo=${invoiceNo}`;
    } else if (policyNo != null) {
      requestURL += `policyNo=${policyNo}`;
    }

    if (claimRefNo != null && claimRefNo !== undefined && claimRefNo !== '') {
      requestURL += `&claimRefNo=${claimRefNo}`;
    }
    if (memberId != null && memberId !== undefined && memberId !== '') {
      requestURL += `&memberId=${memberId}`;
    }

    if (patientFileNo != null && patientFileNo !== undefined && patientFileNo !== '') {
      requestURL += `&patientFileNo=${patientFileNo}`;
    }
    if (drname != null && drname !== '' && drname !== undefined) {
      requestURL += `&drname=${drname}`;
    }
    if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
      requestURL += `&nationalId=${nationalId}`;
    }
    if (casetype != null && casetype.length > 0) {
      requestURL += `&casetype=${casetype}`;
    }
    if (claimIds != null && claimIds.length > 0) {
      requestURL += `&claimIds=${claimIds.join(',')}`;
    }
    if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
      requestURL += `&claimDate=${claimDate}`;
    }
    if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
      requestURL += `&batchNo=${batchNo}`;
    }
    const request = new HttpRequest('POST', environment.claimServiceHost + requestURL, {});
    return this.http.request(request);
  }
  formatDate(date: string) {
    const splittedDate = date.split('-');
    if (splittedDate[2].length == 4) {
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else {
      return date;
    }
  }
}
