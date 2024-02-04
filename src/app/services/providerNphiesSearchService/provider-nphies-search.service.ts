
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClaimSearchCriteriaModel } from 'src/app/models/nphies/claimSearchCriteriaModel';
import { NumericLiteral } from 'typescript';
import { Provider } from 'src/app/models/nphies/provider';
import { AuthService } from '../authService/authService.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderNphiesSearchService {
 
  constructor(private http: HttpClient) { }

  getSpecialityList(providerId: string) {
    const requestURL = '/providers/' + providerId + '/speciallity/fetch';
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }
  getSpecialityByCode(providerId: string, code: string) {
    const requestURL = '/providers/' + providerId + '/speciallity/get/specialityname?speciallityCode=' + code;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }
  NphisBeneficiarySearchByCriteria(
    providerId: string, nationality: string, fullName: string, memberCardId: string, fileId: string,
    contactNumber: string, payerId: string, tpa: string , page: number, size: number) {

    let requestURL = `/providers/${providerId}/beneficiaries/criteria?`;

    if (nationality != null && nationality.trim().length > 0) {
      requestURL += `nationality=${nationality}&`;
    }
    if (fullName != null && fullName.trim().length > 0) {
      requestURL += `fullName=${fullName}&`;
    }
    if (memberCardId != null && memberCardId.trim().length > 0) {
      requestURL += `memberCardId=${memberCardId}&`;
    }
    if (contactNumber != null && contactNumber.trim().length > 0) {
      requestURL += `contactNumber=${contactNumber}&`;
    }
    if (fileId != null && fileId.trim().length > 0) {
      requestURL += `fileId=${fileId}&`;
    }
    if (payerId != null && payerId.trim().length > 0) {
      requestURL += `payerId=${payerId}&`;
    }
    if (tpa != null && tpa.trim().length > 0) {
      requestURL += `tpa=${tpa}&`;
    }
    if (page != null) {
      requestURL += `page=${page}&`;
    }
    if (size != null) {
      requestURL += `size=${size}&`;
    }

    const httpRequest = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(httpRequest);
  }

  beneficiaryFullTextSearch(providerId: string, query: string) {
    const requestUrl = `/providers/${providerId}/beneficiaries?query=${query}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }


  getCodeDescriptionList(providerId: string, itemType: string, serviceDate?: String) {

    let requestURL = '/providers/' + providerId + '/approval/itemcodes?itemType=' + itemType;
    if (serviceDate && serviceDate!=null) {
        requestURL += `&serviceDate=${serviceDate}`;
    }
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
}
getItemList(
    providerId: string, itemType: string, query: string, payerNphiesId: string,
    claimType: string, requestDate: string, tpaNphiesId: string, pageNumber: number, pageSize: number, requestType?: String) {

    let requestURL = '/providers/' + providerId + '/items?';

    if (itemType && itemType.trim().length > 0) {
        requestURL += `itemType=${itemType}&`;
    }
    if (requestType && requestType.trim().length > 0) {
        requestURL += `requestType=${requestType}&`;
    }
    if (query && query.trim().length > 0) {
        requestURL += `query=${query}&`;
    }
    if (payerNphiesId && payerNphiesId.trim().length > 0) {
        requestURL += `payerNphiesId=${payerNphiesId}&`;
    }
    if (claimType && claimType.trim().length > 0) {
        requestURL += `claimType=${claimType}&`;
    }
    if (requestDate && requestDate.trim().length > 0) {
        requestURL += `requestDate=${requestDate}&`;
    }

    if (tpaNphiesId && tpaNphiesId.trim().length > 0) {
        requestURL += `tpaNphiesId=${tpaNphiesId}&`;
    }
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let headOfficeProviderId = localStorage.getItem("headOfficeProviderId");
    //console.log("print the value ="+headOfficeProviderId);

    if (!isHeadOffice && headOfficeProviderId) {
        requestURL += `headOfficeProviderId=${headOfficeProviderId}&`;
    }
    if (pageNumber) {
        requestURL += `pageNumber=${pageNumber}&`;
    }
    if (pageSize) {
        requestURL += `pageSize=${pageSize}&`;
    }
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
}


  searchPriceList(
    providerId: string, priceListId: string, query: string, pageNumber: number, pageSize: number) {

    let requestURL = '/providers/' + providerId + '/items/pricelist/search?';


    if (query && query.trim().length > 0) {
      requestURL += `query=${query}&`;
    }
    if (priceListId) {
      requestURL += `priceListId=${priceListId}&`;
    }

    if (pageNumber !== null && pageNumber !== undefined) {
      requestURL += `pageNumber=${pageNumber}&`;
    }
    if (pageSize) {
      requestURL += `pageSize=${pageSize}&`;
    }
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let headOfficeProviderId=localStorage.getItem("headOfficeProviderId");
    //console.log("print the value ="+headOfficeProviderId);
    
    if(!isHeadOffice && headOfficeProviderId){
      requestURL += `headOfficeProviderId=${headOfficeProviderId}&`;
    }
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  searchTransactionsLog(
    transactionId?: string,
    providerId?: string,
    payerId?: string,
    type?: string,
    fromDate?: string,
    toDate?: string,
    page?: number,
    size?: number) {
    let requestUrl = '/transactions?';

    if (transactionId != null) {
      requestUrl += `transactionId=${transactionId}`;
    }

    if (providerId != null) {
      requestUrl += `&providerId=${providerId}`;
    }

    if (payerId != null) {
      requestUrl += `&payerId=${payerId}`;
    }

    if (type != null) {
      requestUrl += `&type=${type}`;
    }

    if (fromDate != null) {
      requestUrl += `&fromDate=${fromDate}`;
    }

    if (toDate != null) {
      requestUrl += `&toDate=${toDate}`;
    }

    if (page != null) {
      requestUrl += `&page=${page}`;
    }

    if (size != null) {
      requestUrl += `&size=${size}`;
    }

    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl);
    return this.http.request(request);
  }

  getPayers() {
    const requestUrl = `/lovs/payers`;
    const httpRequest = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(httpRequest);
  }
  getPayersNotTBA() {
    const requestUrl = `/lovs/allPayers`;
    const httpRequest = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(httpRequest);
  }

  getTransactionTypes() {
    const requestUrl = `/lovs/transactionTypes`;
    const httpRequest = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(httpRequest);
  }

  getProcessedTransaction(providerId: string, claimType: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/approvals/processed?claimType=${claimType}&page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }
  getApaProcessedTransaction(providerId: string, claimType: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/advance/preauth/processed?claimType=${claimType}&page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }
  getPrescriptionProcessedTransaction(providerId: string) {
      const requestUrl = `/providers/${providerId}/prescriber/processed`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }

  getPrescriptionCommunicationRequests(providerId: string) {
    const requestUrl = `/providers/${providerId}/prescriber/communication-requests`;
  const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
  return this.http.request(request);
}


getPrescriberCommunications(providerId: string, responseId: number) {
    const requestUrl = `/providers/${providerId}/prescriber?responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
}
  getCommunicationRequests(providerId: string, claimType: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/approvals/communication-requests?claimType=${claimType}&page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }

  getApaRequests(providerId: string, claimType: string, page?: number, pageSize?: number) {
    if (page == null) {
      page = 0;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const requestUrl = `/providers/${providerId}/advance/preauth/communication-requests?claimType=${claimType}&page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }

  getCommunications(providerId: string, responseId: number) {
    const requestUrl = `/providers/${providerId}/communications?responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }
  getClaimCommunications(providerId: string, responseId: number) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${providerId}/claims/communications?responseId=${responseId}`;
    if (isHeadOffice) {
      requestURL = `/head-office/${providerId}/claims/communications?responseId=${responseId}`;
    }
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestURL);
    return this.http.request(request);
  }
  getClaimCount(claimSearchCriteriaModel: ClaimSearchCriteriaModel , isSearchByStatus?:boolean) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claimcount?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${claimSearchCriteriaModel.providerId}/claimcount?`;
    }
    if (claimSearchCriteriaModel.payerIds != null) {
      requestURL += `&payerIds=${claimSearchCriteriaModel.payerIds}`;
    }
    if (claimSearchCriteriaModel.claimTypes != null) {
      requestURL += `&claimTypes=${claimSearchCriteriaModel.claimTypes}`;
    }
    if (claimSearchCriteriaModel.batchId != null) {
      requestURL += `&batchId=${claimSearchCriteriaModel.batchId}`;
    }
    if (claimSearchCriteriaModel.memberId != null) {
      requestURL += `&memberId=${claimSearchCriteriaModel.memberId}`;
    }
    if (claimSearchCriteriaModel.documentId != null) {
      requestURL += `&documentId=${claimSearchCriteriaModel.documentId}`;
    }

    if (claimSearchCriteriaModel.organizationId) {
      requestURL += `&organizationId=${claimSearchCriteriaModel.organizationId}`;
    }

    if (claimSearchCriteriaModel.uploadId != null) {
      requestURL += `&uploadId=${claimSearchCriteriaModel.uploadId}`;
    }
    if (claimSearchCriteriaModel.claimSubTypes != null) {
      requestURL += `&claimSubTypes=${claimSearchCriteriaModel.claimSubTypes}`;
    }
    if (claimSearchCriteriaModel.provderClaimReferenceNumber != null) {
      requestURL += `&provderClaimReferenceNumber=${claimSearchCriteriaModel.provderClaimReferenceNumber}`;
    }
    if (claimSearchCriteriaModel.patientFileNo != null) {
      requestURL += `&patientFileNo=${claimSearchCriteriaModel.patientFileNo}`;
    }
    if (claimSearchCriteriaModel.invoiceNo != null) {
      requestURL += `&invoiceNo=${claimSearchCriteriaModel.invoiceNo}`;
    }
    if (claimSearchCriteriaModel.requestBundleId != null) {
      requestURL += `&requestBundleId=${claimSearchCriteriaModel.requestBundleId}`;
    }
    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }
    if (claimSearchCriteriaModel.claimSubmissionDate != null) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSearchCriteriaModel.claimSubmissionDate)}`;
      }
      if (claimSearchCriteriaModel.claimResponseDate != null) {
        requestURL += `&claimResponseDate=${this.formatDate(claimSearchCriteriaModel.claimResponseDate)}`;
      }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }

    if (isSearchByStatus!=null && isSearchByStatus) {
      requestURL += `&statuses=${claimSearchCriteriaModel.statuses.toString()}`;
    }
    if (claimSearchCriteriaModel.bundleIds != null) {
      requestURL += `&bundleIds=${claimSearchCriteriaModel.bundleIds}`;
    }

    // tslint:disable-next-line:max-line-length
    requestURL += (claimSearchCriteriaModel.statuses != null && !claimSearchCriteriaModel.statuses.includes('All') && !claimSearchCriteriaModel.statuses.includes('all') &&  !isSearchByStatus? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '')
    //requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claimcount?`;
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestURL);

    return this.http.request(request);
}
    
    
  
  getClaimSummary(claimSearchCriteriaModel: ClaimSearchCriteriaModel , isSearchByStatus?:boolean) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claims?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${claimSearchCriteriaModel.providerId}/claims?`;
    }
    if (claimSearchCriteriaModel.payerIds != null) {
      requestURL += `&payerIds=${claimSearchCriteriaModel.payerIds}`;
    }
    if (claimSearchCriteriaModel.claimTypes != null) {
      requestURL += `&claimTypes=${claimSearchCriteriaModel.claimTypes}`;
    }
    if (claimSearchCriteriaModel.batchId != null) {
      requestURL += `&batchId=${claimSearchCriteriaModel.batchId}`;
    }
    if (claimSearchCriteriaModel.memberId != null) {
      requestURL += `&memberId=${claimSearchCriteriaModel.memberId}`;
    }
    if (claimSearchCriteriaModel.documentId != null) {
      requestURL += `&documentId=${claimSearchCriteriaModel.documentId}`;
    }

    if (claimSearchCriteriaModel.organizationId) {
      requestURL += `&organizationId=${claimSearchCriteriaModel.organizationId}`;
    }

    if (claimSearchCriteriaModel.uploadId != null) {
      requestURL += `&uploadId=${claimSearchCriteriaModel.uploadId}`;
    }
    if (claimSearchCriteriaModel.claimSubTypes != null) {
      requestURL += `&claimSubTypes=${claimSearchCriteriaModel.claimSubTypes}`;
    }
    if (claimSearchCriteriaModel.provderClaimReferenceNumber != null) {
      requestURL += `&provderClaimReferenceNumber=${claimSearchCriteriaModel.provderClaimReferenceNumber}`;
    }
    if (claimSearchCriteriaModel.patientFileNo != null) {
      requestURL += `&patientFileNo=${claimSearchCriteriaModel.patientFileNo}`;
    }
    if (claimSearchCriteriaModel.invoiceNo != null) {
      requestURL += `&invoiceNo=${claimSearchCriteriaModel.invoiceNo}`;
    }
    if (claimSearchCriteriaModel.requestBundleId != null) {
      requestURL += `&requestBundleId=${claimSearchCriteriaModel.requestBundleId}`;
    }
    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }
    if (claimSearchCriteriaModel.claimSubmissionDate != null) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSearchCriteriaModel.claimSubmissionDate)}`;
      }
      if (claimSearchCriteriaModel.claimResponseDate != null) {
        requestURL += `&claimResponseDate=${this.formatDate(claimSearchCriteriaModel.claimResponseDate)}`;
      }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }

    if (isSearchByStatus!=null && isSearchByStatus) {
      requestURL += `&statuses=${claimSearchCriteriaModel.statuses.toString()}`;
    }
    if (claimSearchCriteriaModel.bundleIds != null) {
      requestURL += `&bundleIds=${claimSearchCriteriaModel.bundleIds}`;
    }

    // tslint:disable-next-line:max-line-length
    requestURL += (claimSearchCriteriaModel.statuses != null && !claimSearchCriteriaModel.statuses.includes('all') && !claimSearchCriteriaModel.statuses.includes('All') &&  !isSearchByStatus? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '')
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestURL);
    return this.http.request(request);
  }


  getClaimResults(claimSearchCriteriaModel: ClaimSearchCriteriaModel , isSearchByStatus?:boolean) {
    const isHeadOffice = AuthService.isProviderHeadOffice();
    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claims/details?`;
    if (isHeadOffice) {
      requestURL = `/head-office/${claimSearchCriteriaModel.providerId}/claims/details?`;
    }
    if (claimSearchCriteriaModel.page == null) {
      claimSearchCriteriaModel.page = 0;
    }
    if (claimSearchCriteriaModel.pageSize == null) {
      claimSearchCriteriaModel.pageSize = 10;
    }
    if (claimSearchCriteriaModel.payerIds != null) {
      requestURL += `&payerIds=${claimSearchCriteriaModel.payerIds}`;
    }
    if (claimSearchCriteriaModel.batchId != null) {
      requestURL += `&batchId=${claimSearchCriteriaModel.batchId}`;
    }
    if (claimSearchCriteriaModel.memberId != null) {
      requestURL += `&memberId=${claimSearchCriteriaModel.memberId}`;
    }
    if (claimSearchCriteriaModel.documentId != null) {
      requestURL += `&documentId=${claimSearchCriteriaModel.documentId}`;
    }
    if (claimSearchCriteriaModel.netAmount != null) {
      requestURL += `&netAmount=${claimSearchCriteriaModel.netAmount}`;
    }
    if (claimSearchCriteriaModel.organizationId) {
      requestURL += `&organizationId=${claimSearchCriteriaModel.organizationId}`;
    }
    if (claimSearchCriteriaModel.uploadId != null) {
      requestURL += `&uploadId=${claimSearchCriteriaModel.uploadId}`;
    }
    if (claimSearchCriteriaModel.claimSubTypes != null) {
      requestURL += `&claimSubTypes=${claimSearchCriteriaModel.claimSubTypes}`;
    }
    if (claimSearchCriteriaModel.claimTypes != null) {
      requestURL += `&claimTypes=${claimSearchCriteriaModel.claimTypes}`;
    }
    if (claimSearchCriteriaModel.provderClaimReferenceNumber != null) {
      requestURL += `&provderClaimReferenceNumber=${claimSearchCriteriaModel.provderClaimReferenceNumber}`;

    }
    if (claimSearchCriteriaModel.patientFileNo != null) {
      requestURL += `&patientFileNo=${claimSearchCriteriaModel.patientFileNo}`;
    }
    if (claimSearchCriteriaModel.invoiceNo != null) {
      requestURL += `&invoiceNo=${claimSearchCriteriaModel.invoiceNo}`;
    }
    if (claimSearchCriteriaModel.requestBundleId != null) {
      requestURL += `&requestBundleId=${claimSearchCriteriaModel.requestBundleId}`;
    }

    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }
    if (claimSearchCriteriaModel.claimSubmissionDate != null) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSearchCriteriaModel.claimSubmissionDate)}`;
      }
      if (claimSearchCriteriaModel.claimResponseDate != null) {
        requestURL += `&claimResponseDate=${this.formatDate(claimSearchCriteriaModel.claimResponseDate)}`;
      }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }
    if (isSearchByStatus!=null && isSearchByStatus) {
      requestURL += `&statuses=${claimSearchCriteriaModel.statuses.toString()}`;
    }
    if (claimSearchCriteriaModel.isRelatedClaim !=null) {
      requestURL += `&isRelatedClaim=${claimSearchCriteriaModel.isRelatedClaim}`;
    }
    if (claimSearchCriteriaModel.reissueReason != null) {
      requestURL += `&reissueReason=${claimSearchCriteriaModel.reissueReason}`;
    }
    if (claimSearchCriteriaModel.bundleIds != null) {
      requestURL += `&bundleIds=${claimSearchCriteriaModel.bundleIds}`;
    }


    // tslint:disable-next-line:max-line-length
    requestURL += (claimSearchCriteriaModel.statuses != null && !isSearchByStatus  ? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '') + '&page=' + claimSearchCriteriaModel.page + '&size=' + claimSearchCriteriaModel.pageSize;
        const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestURL);
    return this.http.request(request);
  }


  getPaymentReconciliation(providerId: string, body: any) {
    let requestUrl = `/providers/${providerId}/payment-reconciliation?`;
    if (body.fromDate) {
      requestUrl += `fromDate=${body.fromDate}&`;
    }
    if (body.toDate) {
      requestUrl += `toDate=${body.toDate}&`;
    }
    if (body.issuerId) {
      requestUrl += `issuerId=${body.issuerId}&`;
    }
    if (body.destinationId) {
      requestUrl += `destinationId=${body.destinationId}&`;
    }

    if (body.page !== undefined && body.page !== null) {
      requestUrl += `page=${body.page}&`;
    }
    if (body.pageSize) {
      requestUrl += `pageSize=${body.pageSize}&`;
    }

    requestUrl = requestUrl.slice(0, requestUrl.length - 1);

    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl, body);
    return this.http.request(request);
  }

  getProcessedPaymentReconciliation(providerId: string, body: any) {
    let requestUrl = `/providers/${providerId}/payment-reconciliation/processed?`;

    if (body.page !== undefined && body.page !== null) {
      requestUrl += `page=${body.page}&`;
    }
    if (body.pageSize) {
      requestUrl += `pageSize=${body.pageSize}&`;
    }

    requestUrl = requestUrl.slice(0, requestUrl.length - 1);

    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl, body);
    return this.http.request(request);
  }

  getPaymentReconciliationDetails(providerId: string, reconciliationId: number) {
    const requestUrl = `/providers/${providerId}/reconciliationDetails/fetch?reconciliationId=${reconciliationId}`;
    const request = new HttpRequest('GET', environment.providerNphiesClaimsSearch + requestUrl);
    return this.http.request(request);
  }

  searchICDCode(searchQuery: string) {
    const requestURL: string = '/diagnosis/search?query=' + searchQuery;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  searchLOINK(providerId: string, searchQuery: string) {
    const requestURL: string = '/providers/' + providerId + '/approval/loinc?code=' + searchQuery;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }
  addNewProvider(providerId: string, providerInfo: Provider) {
    const requestUrl = `/providers/${providerId}/addNewProvider`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, providerInfo);
    return this.http.request(request);
  }

  formatDate(date: string) {
    const splittedDate = date.split('-');
    if (splittedDate[2].length == 4) {
      const formattedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
      return formattedDate;
    } else { return date; }
  }

  getApprovalToClaimPrepareCriteria(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approvalToClaim/prepare/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  getApprovalToClaimConvertCriteria(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approvalToClaim/convert/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  getEligibilityJSONTransactions(providerId: string, eligibilityRequestId: number) {
    const requestUrl = `/providers/${providerId}/nphis/eligibility/jsons/${eligibilityRequestId}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }

  getEligibilityJSON(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/nphis/eligibility/view/json`;
    const request = new HttpRequest('POST', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  downloadMultiSheetSummaries(claimSearchCriteriaModel: ClaimSearchCriteriaModel) {

    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claims/multisheet?`;

    if (claimSearchCriteriaModel.payerIds != null) {
      requestURL += `&payerIds=${claimSearchCriteriaModel.payerIds}`;
    }
    if (claimSearchCriteriaModel.batchId != null) {
      requestURL += `&batchId=${claimSearchCriteriaModel.batchId}`;
    }
    if (claimSearchCriteriaModel.memberId != null) {
      requestURL += `&memberId=${claimSearchCriteriaModel.memberId}`;
    }
    if (claimSearchCriteriaModel.documentId != null) {
      requestURL += `&documentId=${claimSearchCriteriaModel.documentId}`;
    }
    if (claimSearchCriteriaModel.organizationId) {
      requestURL += `&organizationId=${claimSearchCriteriaModel.organizationId}`;
    }
    if (claimSearchCriteriaModel.uploadId != null) {
      requestURL += `&uploadId=${claimSearchCriteriaModel.uploadId}`;
    }
    if (claimSearchCriteriaModel.claimSubTypes != null) {
      requestURL += `&claimSubTypes=${claimSearchCriteriaModel.claimSubTypes}`;
    }
    if (claimSearchCriteriaModel.provderClaimReferenceNumber != null) {
      requestURL += `&provderClaimReferenceNumber=${claimSearchCriteriaModel.provderClaimReferenceNumber}`;

    }
    if (claimSearchCriteriaModel.patientFileNo != null) {
      requestURL += `&patientFileNo=${claimSearchCriteriaModel.patientFileNo}`;
    }
    if (claimSearchCriteriaModel.invoiceNo != null) {
      requestURL += `&invoiceNo=${claimSearchCriteriaModel.invoiceNo}`;
    }

    if (claimSearchCriteriaModel.requestBundleId != null) {
      requestURL += `&requestBundleId=${claimSearchCriteriaModel.requestBundleId}`;
    }

    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }
    if (claimSearchCriteriaModel.claimSubmissionDate != null) {
        requestURL += `&claimSubmissionDate=${this.formatDate(claimSearchCriteriaModel.claimSubmissionDate)}`;
      }
    if (claimSearchCriteriaModel.claimResponseDate != null) {
        requestURL += `&claimResponseDate=${this.formatDate(claimSearchCriteriaModel.claimResponseDate)}`;
      }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }

    if (claimSearchCriteriaModel.bundleIds != null) {
      requestURL += `&bundleIds=${claimSearchCriteriaModel.bundleIds.split(',')}`;
    }

    requestURL += (claimSearchCriteriaModel.statuses != null ? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '');

    // tslint:disable-next-line:max-line-length
    const request = new HttpRequest('GET', environment.nphiesClaimDownload + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

  getPrescribedMedicationList(providerId: string) {
    const requestURL = '/providers/' + providerId + '/prescribed/itemcodes';
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  getJsonFormData(providerId, preAuthId, printFor) {
    const requestURL = '/providers/' + providerId + '/json/' + preAuthId + '/' + printFor;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  getTpaNphies() {
    const requestURL = '/payers/organizationDetails/list';
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }





  /* getSupptingInfoPrintingFom(key: string, data:any) {
    const { supportingInfo } = data;
    if (supportingInfo.length > 0) {
      const index = supportingInfo.findIndex(rec => rec.category === key);
      if (index >= 0) return supportingInfo[index].value;
      else return '';
    } else return '';
  }

  getPrincipalCodePrintingFom(index: number, data:any) {
    const { careTeam } = data;
    if (careTeam.length >= index + 1) return careTeam[index].specialityCode;
    else return '';
  }

  getDiagnosisPrintingFom(data:any){
    const {diagnosis} = data;
    if(diagnosis.length > 0) return diagnosis.map(res=>res.diagnosisDescription).join(', ');
    else return '';
  } */
}
