import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { SERVICE_CODE_RESTRICTION_KEY } from '../administration/superAdminService/super-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  searchICDCode(searchQuery: string) {
    const requestURL: string = '/diagnosis/search?query=' + searchQuery;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  searchServiceCode(serviceCode: string, providerId: string, payerId: string, page?: number, pageSize?: number) {
    const requestURL = `/price-list/search`;
    const body = {
      serviceCode: serviceCode,
      providerId: providerId,
      payerId: payerId
    };
    const request = new HttpRequest('POST', environment.adminServiceHost + requestURL, body);
    return this.http.request(request);
  }

  checkIfServiceCodeRestrictionIsEnabled(providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/config/${SERVICE_CODE_RESTRICTION_KEY}/payers/${payerId}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  checkIfPriceListExist(providerId: string, payerId: string) {
    const requestURL = `/price-list/providers/${providerId}/check-payer/${payerId}`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  getLOVsForClaimCreation() {
    const requestURL = `/lov/get`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

}
