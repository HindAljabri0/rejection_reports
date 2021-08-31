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
    providerId: string, nationality: string, fullName: string, memberCardId: string,fileId:string,
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

}
