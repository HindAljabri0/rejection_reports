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
    providerId: string, organizationId: string, uploadId: string, batchId: string, caseTypes: string[],
    claimRefNo: string, patientFileNo: string, invoiceNo: string, policyNo: string, statuses: string[], memberId: string,
    claimIDs: string[], fromDate: string, toDate: string, payerIds?: string[], drname?: string, nationalId?: string, claimDate?: string,
    netAmount?: string, batchNo?: string) {

    let requestURL = `/providers/${providerId}/remove/criteria?`;
    if (claimIDs && claimIDs.length > 0) {
      requestURL += `claimIds=${claimIDs}`;
    } else {

      if (payerIds && payerIds.length > 0) {
        requestURL += `payerIds=${payerIds.join(',')}&`;
      }

      if (organizationId && !uploadId) {
        requestURL += `organizationId=${organizationId}&`;
      }

      if (batchId) {
        requestURL += `batchId=${batchId}&`;
      }
      if (uploadId) {
        requestURL += `uploadId=${uploadId}&`;
      }

      if (caseTypes) {
        requestURL += `caseTypes=${caseTypes}&`;
      }
      if (invoiceNo) {
        requestURL += `invoiceNo=${invoiceNo}&`;
      }
      if (policyNo) {
        requestURL += `policyNo=${policyNo}&`;
      }
      if (statuses) {
        requestURL += `statuses=${statuses}&`;
      }
      if (fromDate) {
        requestURL += `claimDate=${this.formatDate(fromDate)}&`;
      }
      if (toDate) {
        requestURL += `toDate=${this.formatDate(toDate)}&`;
      }
      if (claimRefNo) {
        requestURL += `claimRefNo=${claimRefNo}&`;
      }
      if (patientFileNo) {
        requestURL += `patientFileNo=${patientFileNo}&`;
      }
      if (memberId) {
        requestURL += `memberId=${memberId}&`;
      }
      if (drname) {
        requestURL += `drname=${drname}&`;
      }
      if (nationalId) {
        requestURL += `nationalId=${nationalId}&`;
      }
      if (claimDate) {
        requestURL += `claimDate=${this.formatDate(claimDate)}&`;
      }
      if (netAmount) {
        requestURL += `netAmount=${netAmount}&`;
      }
      if (batchNo) {
        requestURL += `batchNo=${batchNo}&`;
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
    documentId?: string,
    organizationId?: string
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

    //     providerId
    // claimDate
    // toDate
    // payerIds
    // batchId
    // uploadId
    // statuses
    // claimIds
    // provderClaimReferenceNumber
    // patientFileNo
    // memberId
    // documentId
    // invoiceNo
    // organizationId

    let requestURL = `/providers/${providerId}/claims/submit?`;



    if (provderClaimReferenceNumber) {
      requestURL += `&provderClaimReferenceNumber=${provderClaimReferenceNumber}`;
    }

    if (toDate) {
      requestURL += `&toDate=${this.formatDate(toDate)}`;
    }

    if (payerIds && payerIds.length > 0) {
      requestURL += `&payerIds=${payerIds.join(',')}`;
    }

    if (batchId) {
      requestURL += `&batchId=${batchId}`;
    }

    if (uploadId) {
      requestURL += `&uploadId=${uploadId}`;
    }

    if (claimIds && claimIds.length > 0) {
      requestURL += `&claimIds=${claimIds.join(',')}`;
    }

    if (memberId) {
      requestURL += `&memberId=${memberId}`;
    }

    if (invoiceNo) {
      requestURL += `&invoiceNo=${invoiceNo}`;
    }

    if (patientFileNo) {
      requestURL += `&patientFileNo=${patientFileNo}`;
    }

    if (claimDate) {
      requestURL += `&claimDate=${this.formatDate(claimDate)}`;
    }

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
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
      requestURL += `&documentId=${documentId}`;
    }

    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestURL, {});
    return this.http.request(request);
  }

  cancelClaims(
    providerId: string,
    cancelReason: string,
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
    documentId?: string,
    statuses?: string[],
    organizationId?: string
  ) {

    let requestURL = `/providers/${providerId}/approval/cancelAll/request?`;

    if (cancelReason) {
      requestURL += `&cancelReason=${cancelReason}`;
    }

    if (provderClaimReferenceNumber) {
      requestURL += `&provderClaimReferenceNumber=${provderClaimReferenceNumber}`;
    }

    if (toDate) {
      requestURL += `&toDate=${this.formatDate(toDate)}`;
    }

    if (payerIds && payerIds.length > 0) {
      requestURL += `&payerIds=${payerIds.join(',')}`;
    }

    if (batchId) {
      requestURL += `&batchId=${batchId}`;
    }

    if (uploadId) {
      requestURL += `&uploadId=${uploadId}`;
    }

    if (claimIds && claimIds.length > 0) {
      requestURL += `&claimIds=${claimIds.join(',')}`;
    }

    if (memberId) {
      requestURL += `&memberId=${memberId}`;
    }

    if (invoiceNo) {
      requestURL += `&invoiceNo=${invoiceNo}`;
    }

    if (patientFileNo) {
      requestURL += `&patientFileNo=${patientFileNo}`;
    }

    if (claimDate) {
      requestURL += `&claimDate=${this.formatDate(claimDate)}`;
    }

    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }

    if (statuses && statuses.length > 0) {
      requestURL += `&statuses=${statuses.join(',')}`;
    }

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
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

  inquireClaims(
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
    documentId?: string,
    statuses?: string[],
    organizationId?: string
  ) {

    let requestURL = `/providers/${providerId}/claims/inquiry?`;

    if (uploadId) {
      requestURL += `uploadId=${uploadId}`;
    }

    if (provderClaimReferenceNumber) {
      requestURL += `&provderClaimReferenceNumber=${provderClaimReferenceNumber}`;
    }

    if (toDate) {
      requestURL += `&toDate=${this.formatDate(toDate)}`;
    }

    if (payerIds && payerIds.length > 0) {
      requestURL += `&payerIds=${payerIds.join(',')}`;
    }

    if (batchId) {
      requestURL += `&batchId=${batchId}`;
    }

    if (claimIds && claimIds.length > 0) {
      requestURL += `&claimIds=${claimIds.join(',')}`;
    }

    if (memberId) {
      requestURL += `&memberId=${memberId}`;
    }

    if (invoiceNo) {
      requestURL += `&invoiceNo=${invoiceNo}`;
    }

    if (patientFileNo) {
      requestURL += `&patientFileNo=${patientFileNo}`;
    }

    if (claimDate) {
      requestURL += `&claimDate=${this.formatDate(claimDate)}`;
    }

    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
    }

    if (statuses && statuses.length > 0) {
      requestURL += `&statuses=${statuses.join(',')}`;
    }


    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestURL, {});
    return this.http.request(request);
  }

  inquireApprovalRequest(providerId: string, requestId: number) {
    let requestUrl = `/providers/${providerId}/approval/inquiry?`;
    if (requestId) {
      requestUrl += `approvalRequestId=${requestId}`;
    }
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, {});
    return this.http.request(request);
  }

  getJSONTransactions(providerId: string, claimId: number) {
    const requestUrl = `/providers/${providerId}/claims/view/jsons/${claimId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getJSON(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/claims/transactionlog/json`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }

  approvalToPrepareSave(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/prepare/save`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }

  convertToClaim(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/convert/claim`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
}
