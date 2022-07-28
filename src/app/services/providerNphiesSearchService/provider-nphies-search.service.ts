
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClaimSearchCriteriaModel } from 'src/app/models/nphies/claimSearchCriteriaModel';
import { NumericLiteral } from 'typescript';
import { Provider } from 'src/app/models/nphies/provider';

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
  getSpecialityByCode(providerId: string,code:string) {
    const requestURL = '/providers/' + providerId + '/speciallity/get/specialityname?speciallityCode='+code;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }
  NphisBeneficiarySearchByCriteria(
    providerId: string, nationality: string, fullName: string, memberCardId: string, fileId: string,
    contactNumber: string, page: number, size: number) {

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

  getCodeDescriptionList(providerId: string, itemType: string) {
    const requestURL = '/providers/' + providerId + '/approval/itemcodes?itemType=' + itemType;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  getItemList(
    providerId: string, itemType: string, query: string, payerNphiesId: string,
    claimType: string, requestDate: string, pageNumber: number, pageSize: number) {

    let requestURL = '/providers/' + providerId + '/items?';

    if (itemType && itemType.trim().length > 0) {
      requestURL += `itemType=${itemType}&`;
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

    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
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

  getCommunications(providerId: string, responseId: number) {
    const requestUrl = `/providers/${providerId}/communications?responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(request);
  }
  getClaimSummary(claimSearchCriteriaModel: ClaimSearchCriteriaModel) {
    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claims?`;
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

    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }
    // tslint:disable-next-line:max-line-length
    requestURL += (claimSearchCriteriaModel.statuses != null && !claimSearchCriteriaModel.statuses.includes('All') ? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '')
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
    return this.http.request(request);
  }

  getClaimResults(claimSearchCriteriaModel: ClaimSearchCriteriaModel) {
    let requestURL = `/providers/${claimSearchCriteriaModel.providerId}/claims/details?`;

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

    if (claimSearchCriteriaModel.claimDate != null) {
      requestURL += `&claimDate=${this.formatDate(claimSearchCriteriaModel.claimDate)}`;
    }

    if (claimSearchCriteriaModel.toDate != null) {
      requestURL += `&toDate=${this.formatDate(claimSearchCriteriaModel.toDate)}`;
    }

    requestURL += (claimSearchCriteriaModel.statuses != null ? `&statuses=${claimSearchCriteriaModel.statuses.toString()}` : '') + '&page=' + claimSearchCriteriaModel.page + '&size=' + claimSearchCriteriaModel.pageSize;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestURL);
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

    if (body.page !== undefined && body.page !== null) {
      requestUrl += `page=${body.page}&`;
    }
    if (body.pageSize) {
      requestUrl += `pageSize=${body.pageSize}&`;
    }

    requestUrl = requestUrl.slice(0, requestUrl.length - 1);

    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl, body);
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

    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl, body);
    return this.http.request(request);
  }

  getPaymentReconciliationDetails(providerId: string, reconciliationId: number) {
    const requestUrl = `/providers/${providerId}/reconciliationDetails/fetch?reconciliationId=${reconciliationId}`;
    const request = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
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

}
