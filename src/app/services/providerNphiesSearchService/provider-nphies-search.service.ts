import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  NphisBeneficiarySearchByCriteria(
    providerId: string, nationality: string, fullName: string, memberCardId: string, fileId: string,
    contractNumber: string) {

    let requestURL = `/providers/${providerId}/beneficiaries/criteria`;

    if (nationality != null) {
      requestURL += `nationality=${nationality}&`;
    }
    if (fullName != null) {
      requestURL += `fullName=${fullName}&`;
    }
    if (memberCardId != null) {
      requestURL += `memberCardId=${memberCardId}&`;
    }
    if (contractNumber != null) {
      requestURL += `contractNumber=${contractNumber}&`;
    }
    if (fileId != null) {
      requestURL += `fileId=${fileId}&`;
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

  searchTransactionsLog(transactionId?:string,providerId?: string, payerId?: string, type?: string, fromDate?: string, toDate?: string, page?: number, size?: number) {
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

  getTransactionTypes() {
    const requestUrl = `/lovs/transactionTypes`;
    const httpRequest = new HttpRequest('GET', environment.providerNphiesSearch + requestUrl);
    return this.http.request(httpRequest);
  }

}
