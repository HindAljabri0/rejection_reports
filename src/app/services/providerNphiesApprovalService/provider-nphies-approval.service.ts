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
  deleteClaimById(providerId: string, claimId: string) {
    const requestUrl = `/providers/${providerId}/remove/${claimId}`;
    const request = new HttpRequest('DELETE', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }
  deleteClaimByCriteria(
    providerId: string, payerId: string, organizationId: string, uploadId: string, batchId: string, caseTypes: string[],
    claimRefNo: string, patientFileNo: string, invoiceNo: string, policyNo: string, statuses: string[], memberId: string,
    claimIDs: string[], fromDate: string, toDate: string, drname?: string, nationalId?: string, claimDate?: string, netAmount?: string, batchNo?: string) {

    let requestURL = `/providers/${providerId}/criteria?`;
    if (claimIDs != null && claimIDs.length > 0) {
      requestURL += `claimIDs=${claimIDs}`;
    } else {
      if (payerId != null && uploadId == null) {
        requestURL += `payerId=${payerId}&`;
      }
      if (organizationId != null && uploadId == null) {
        requestURL += `organizationId=${organizationId}&`
      }

      if (batchId != null) {
        requestURL += `batchId=${batchId}&`;
      }
      if (uploadId != null) {
        requestURL += `uploadId=${uploadId}&`;
      }

      if (caseTypes != null) {
        requestURL += `caseTypes=${caseTypes}&`;
      }
      if (invoiceNo != null) {
        requestURL += `invoiceNo=${invoiceNo}&`;
      }
      if (policyNo != null) {
        requestURL += `policyNo=${policyNo}&`;
      }
      if (statuses != null) {
        requestURL += `statuses=${statuses}&`;
      }
      if (fromDate != null) {
        requestURL += `fromDate=${fromDate}&`;
      }
      if (toDate != null) {
        requestURL += `toDate=${toDate}&`;
      }
      if (claimRefNo != null) {
        requestURL += `claimRefNo=${claimRefNo}&`;
      }
      if (patientFileNo != null) {
        requestURL += `patientFileNo=${patientFileNo}&`;
      }
      if (memberId != null) {
        requestURL += `memberId=${memberId}&`;
      }
      if (drname != null && drname !== '' && drname !== undefined) {
        requestURL += `drname=${drname}&`;
      }
      if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
        requestURL += `nationalId=${nationalId}&`;
      }
      if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
        requestURL += `claimDate=${claimDate}`;
      }
      if (netAmount != null && netAmount !== '' && netAmount !== undefined) {
        requestURL += `netAmount=${netAmount}`;
      }
      if (batchNo != null && batchNo !== '' && batchNo !== undefined) {
        requestURL += `batchNo=${batchNo}`;
      }
    }

    const request = new HttpRequest('DELETE', environment.providerNphiesApproval + requestURL);
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

  getNphisClaimDetails(providerId: string, claimId: number) {
    let requestUrl = `/providers/${providerId}/claims/${claimId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  statusCheck(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/checkstatus`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
  submitClaims(
    providerId: string,
    claimIds?: string[],
    uploadId?: string,
    provderClaimReferenceNumber?: string,
    toDate?: string,
    payerIds?: string[],
    batchId?: string,
    memberId?: string,
    invoiceNo?: string,
    patientFileNo?: string,
    claimDate?: string,
    // claimTypes?: string[],
    // claimSubTypes?: string[],
    // statuses?: string[],
    documentId?: string
  ) {

    // fromDate?: string,
    // organizationId?: string,
    // casetype?: string[],
    // claimRefNo?: string,
    // policyNo?: string,
    // drname?: string,
    // nationalId?: string,
    // netAmount?: string,
    // batchNo?: string

    let requestURL = `/providers/${providerId}/claims/submit?`;



    if (provderClaimReferenceNumber) {
      requestURL += `&claimRefNo=${provderClaimReferenceNumber}`;
    }

    if (toDate) {
      requestURL += `&toDate=${this.formatDate(toDate)}`;
    }

    if (payerIds && payerIds.length > 0) {
      requestURL += `&payerIds=${payerIds.join(',')}`;
    }

    if (batchId) {
      requestURL += `batchId=${batchId}`;
    }

    if (uploadId) {
      requestURL += `uploadId=${uploadId}`;
    }

    if (claimIds && claimIds.length > 0) {
      requestURL += `&claimIds=${claimIds.join(',')}`;
    }

    if (memberId) {
      requestURL += `&memberId=${memberId}`;
    }

    if (invoiceNo) {
      requestURL += `invoiceNo=${invoiceNo}`;
    }

    if (patientFileNo) {
      requestURL += `&patientFileNo=${patientFileNo}`;
    }

    if (claimDate) {
      requestURL += `&claimDate=${claimDate}`;
    }

    // if (claimTypes && claimTypes.length > 0) {
    //   requestURL += `&claimTypes=${claimTypes.join(',')}`;
    // }

    // if (claimSubTypes && claimSubTypes.length > 0) {
    //   requestURL += `&claimSubTypes=${claimSubTypes.join(',')}`;
    // }

    // if (statuses && statuses.length > 0) {
    //   requestURL += `&statuses=${statuses.join(',')}`;
    // }

    if (documentId) {
      requestURL += `documentId=${documentId}`;
    }

    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestURL, {});
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
