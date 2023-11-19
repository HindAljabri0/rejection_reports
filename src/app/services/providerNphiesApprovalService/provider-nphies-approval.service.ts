import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { folder } from 'jszip';
import { AuthService } from '../authService/authService.service';

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
  sendCnhiApprovalRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/cnhi/request`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
  sendApprovalPBMRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/pbm-validation`;
    const request = new HttpRequest('POST', environment.nphiesApprovalPBM + requestUrl, body);
    return this.http.request(request);
  }
  LinkAttachments(providerId: string,
    folderName: string,
    isReplace: boolean,
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    statuses?: string[],
    organizationId?: string,
    requestBundleId?: string,
    bundleIds?:string[],
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
  ) {
    let requestURL = `/providers/${providerId}/claims/link/attachment?isReplace=${isReplace}`;
    if (folderName) {
      requestURL += `&folderName=${folderName}`;
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
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    if (bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
    return this.http.request(request);
  }
  deleteClaimById(providerId: string, claimId: string, claimProviderId: string) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/remove/${claimId}`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/remove?claimId=${claimId}&claimProviderId=${claimProviderId}`;
    }
    const request = new HttpRequest('DELETE', environment.providerNphiesClaim + requestURL);
    return this.http.request(request);
  }
  replicateClaimById(providerId: string, claimId: string) {
    let requestUrl = `/providers/${providerId}/claim/replicate?`;
    if (claimId != null) {
      requestUrl += `claimId=${claimId}&`;
    }

    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, {});
    return this.http.request(request);
  }
  inActiveClaimById(providerId: string, claimId: string) {
    let requestUrl = `/providers/${providerId}/claim/inactive?`;
    if (claimId != null) {
      requestUrl += `claimId=${claimId}&`;
    }

    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, {});
    return this.http.request(request);
  }
  /* deleteClaimByCriteria(
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
  } */

  deleteClaimByCriteria(
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    organizationId?: string,
    statuses?: string[],
    requestBundleId?: string,
    bundleIds?:string,
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
    ) {

    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/remove/criteria?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/remove/criteria?`;
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
    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
    }
    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }
    if (statuses) {
      requestURL += `&statuses=${statuses}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    if (bundleIds&& bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds.split(",")}`;
    }
    const request = new HttpRequest('DELETE', environment.providerNphiesClaim + requestURL);
    return this.http.request(request);
  }

  getApprovalRequestTransactions(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approvals/fetch/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  getPrescriberRequestTransactions(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/prescriber/fetch/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  cancelApprovalRequest(providerId: string, body: any, isApproval = false) {
    if (isApproval) {
      let requestURL = `/providers/${providerId}/approval/cancel/request`;
      const request = new HttpRequest('POST', environment.providerNphiesApproval + requestURL, body);
      return this.http.request(request);
    } else {
      const isHeadOffice = AuthService.isProviderHeadOffice();
      let requestURL = `/providers/${providerId}/claims/cancel/request`;
      if (isHeadOffice) {
        requestURL = `/head-office/${providerId}/claims/cancel/request`;
      }
      const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, body);
      return this.http.request(request);
    }
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

  getPrescriberTransactionDetails(providerId: string, requestId: number, responseId: number) {
    const requestUrl = `/providers/${providerId}/prescriber?requestId=${requestId}&responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getTransactionDetailsFromCR(providerId: string, requestId: number, communicationId) {
    // tslint:disable-next-line:max-line-length
    const requestUrl = `/providers/${providerId}/approval/communication-request/detail?requestId=${requestId}&communicationId=${communicationId}`;
    const request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getNphisClaimDetails(providerId: string, _claimId: number, _claimProviderId: string) {
    let requestUrl = `/providers/${providerId}/claims/${_claimId}`;
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let request = new HttpRequest('GET', environment.providerNphiesClaim + requestUrl);
    if (isHeadOffice) {
      requestUrl = `/head-office/${providerId}/claims/branch/claim/detail`;
      request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, { claimId: _claimId, claimProviderId: _claimProviderId });
    }

    //http://localhost:8025/head-office/1649/claims/branch/claim/detail

    return this.http.request(request);
  }

  statusCheck(providerId: string, body: any, isApproval = false) {
    let requestURL = `/providers/${providerId}/approval/checkstatus`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestURL, body);
    return this.http.request(request);
  }

  claimStatusCheck(providerId: string, body: any, isApproval = false) {

    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/checkstatus`;
    if (isHeadOffice && !isApproval) {
      requestURL = `/head-office/${providerId}/claims/branch/checkstatus`;
    }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, body);
    return this.http.request(request);
  }

  getAdvanceApprovalRequestTransactions(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/advance/preauth/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
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
    claimTypes?: string,
    netAmount?: string,
    // claimSubTypes?: string[],
    documentId?: string,
    organizationId?: string,
    requestBundleId?: string,
    bundleIds?:string,
    statuses?: string[],
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
  ) {

 
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/submit?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/submit?`;
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

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
    }
    if (bundleIds && bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds.split(",")}`;
    }

    // if (claimTypes && claimTypes.length > 0) {
    //   requestURL += `&claimTypes=${claimTypes.join(',')}`;
    // }

    // if (claimSubTypes && claimSubTypes.length > 0) {
    //   requestURL += `&claimSubTypes=${claimSubTypes.join(',')}`;
    // }

    if (statuses && statuses.length > 0) {
      requestURL += `&statuses=${statuses.join(',')}`;
    }

    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    statuses?: string[],
    organizationId?: string,
    requestBundleId?: string,
    bundleIds?:string[],
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string
  ) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/cancelAll/request?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/cancelAll/request?`;
    }

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
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }

    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }

     if ( bundleIds && bundleIds.length>0 ) {

       requestURL += `&bundleIds=${bundleIds}`;
     }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    statuses?: string[],
    organizationId?: string,
    requestBundleId?: string,
    bundleIds?:string,
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
   
  ) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/inquiry?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/inquiry?`;
    }

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

    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    if (bundleIds && bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds.split(",")}`;
    }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
    return this.http.request(request);
  }

  inquireApprovalRequest(providerId: string, requestId: number) {
    let requestUrl = `/providers/${providerId}/approval/inquiry?`;
    if (requestId) {
      requestUrl += `approvalRequestId=${requestId}`;
    }
    const request = new HttpRequest('POST', environment.nphiesApprovalInquiry + requestUrl, {});
    return this.http.request(request);
  }

  getJSONTransactions(providerId: string, _claimId: number, _claimProviderId: string, isApproval = false) {
    let requestUrl = `/providers/${providerId}/approval/view/jsons/${_claimId}`;
    let request = new HttpRequest('GET', environment.providerNphiesApproval + requestUrl);
    return this.http.request(request);
  }

  getClaimJSONTransactions(providerId: string, _claimId: number, _claimProviderId: string, isApproval = false) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestUrl = `/providers/${providerId}/claims/view/jsons/${_claimId}`;
    let request = new HttpRequest('GET', environment.providerNphiesClaim + requestUrl);
    if (isHeadOffice && !isApproval) {
      requestUrl = `/head-office/${providerId}/claims/branch/view/jsons`;
      request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, { claimId: _claimId, claimProviderId: _claimProviderId });
    }
    return this.http.request(request);
  }


  getJSON(providerId: string, body: any, isApproval = false) {
    if(isApproval){
      let requestUrl = `/providers/${providerId}/approval/transactionlog/json`;
      const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
      return this.http.request(request);
    }else{
      const isHeadOffice = AuthService.isProviderHeadOffice();
      let requestUrl = `/providers/${providerId}/claims/transactionlog/json`;
      if (isHeadOffice && !isApproval) {
        requestUrl = `/head-office/${providerId}/claims/branch/transactionlog/json`;
      }
      const request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, body);
      return this.http.request(request);
    }
  }

  approvalToPrepareSave(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/prepare/save`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
  editPreparedClaim(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/prepare/edit`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
  convertToClaim(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/convert/claim`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }

  generateAttachment(
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    organizationId?: string,
    attachmentStatus?: string,
    requestBundleId?: string, bundleIds?, statuses?: string[],
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
    ) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/generate/attchment?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/generate/attchment?`;
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

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
    }

    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }

    if (attachmentStatus) {
      requestURL += `&attachmentStatus=${attachmentStatus}`;
    }

    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }

    if (bundleIds && bundleIds != null) {

        requestURL += `&bundleIds=${bundleIds.split(',')}`;
      }

    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
    return this.http.request(request);
  }

  PBMValidation(
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    organizationId?: string,
    statuses?: string[],
    requestBundleId?: string,
    bundleIds?:string,
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
    ) {
    let requestURL = `/providers/${providerId}/claims/pbm-validation?`;
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
    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }
    if (statuses) {
      requestURL += `&statuses=${statuses}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }
    if (bundleIds && bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds.split(',')}`;
    }
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }

    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const httpRequest = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {}, { headers });
    return this.http.request(httpRequest);
  }

  moveToReadyState(
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
    claimTypes?: string,
    netAmount?: string,
    documentId?: string,
    organizationId?: string,
    statuses?: string[],
    requestBundleId?: string,
    bundleIds?:string,
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
  ) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/move-to-ready?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/move-to-ready?`;
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

    if (organizationId) {
      requestURL += `&organizationId=${organizationId}`;
    }
    if (documentId) {
      requestURL += `&documentId=${documentId}`;
    }
    if (statuses) {
      requestURL += `&statuses=${statuses}`;
    }
    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }

    if (bundleIds && bundleIds != null) {
      requestURL += `&bundleIds=${bundleIds.split(",")}`;
    }
    if (claimTypes) {
      requestURL += `&claimTypes=${claimTypes}`;
    }
    if (netAmount) {
      requestURL += `&netAmount=${netAmount}`;
    }
    if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
    return this.http.request(request);
  }

  relatedClaim(providerId: string, claimId: string, claimProviderId: string) {
    let requestUrl = `/providers/${providerId}/claims/partial/resubmit?claimId=${claimId}`;
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, {});
    if (isHeadOffice) {
      requestUrl = `/head-office/${providerId}/claims/branch/partial/resubmit`;
      request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, { claimId: claimId, claimProviderId: claimProviderId });
    }

    return this.http.request(request);
  }

  revalidateClaims(
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
    organizationId?: string,
    requestBundleId?: string,
    filter_netAmount?: string,
    isRelatedClaim?:boolean,
    reissueReason?:boolean,
    claimSubmissionDate?:string,
    claimResponseDate?:string,
  ) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/validate?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/validate?`;
    }

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

    if (requestBundleId) {
      requestURL += `&requestBundleId=${requestBundleId}`;
    }

    if (filter_netAmount) {
      requestURL += `&netAmount=${filter_netAmount}`;
    }
  if (isRelatedClaim) {
      requestURL += `&isRelatedClaim=${isRelatedClaim}`;
    }
    if (reissueReason) {
        requestURL += `&reissueReason=${reissueReason}`;
      }
      if (claimSubmissionDate) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSubmissionDate)}`;
      }
      if (claimResponseDate) {
        requestURL += `&claimResponseDate=${this.formatDate(claimResponseDate)}`;
      }
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestURL, {});
    return this.http.request(request);
  }
  cancelPreviousClaim(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/claim/old/cancel`;
    const request = new HttpRequest('POST', environment.providerNphiesClaim + requestUrl, body);
    return this.http.request(request);
  }
}
