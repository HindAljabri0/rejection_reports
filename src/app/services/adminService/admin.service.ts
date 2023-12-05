import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { SERVICE_CODE_RESTRICTION_KEY, PBM_RESTRICTION_KEY, NPHIES_PBM_RESTRICTION_KEY, NPHIES_PBM_APPROVAL_KEY } from '../administration/superAdminService/super-admin.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  searchICDCode(searchQuery: string) {
    const requestURL: string = '/diagnosis/search?query=' + searchQuery;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  searchServiceCode(serviceCode: string, providerId: string, payerId: string, visitDate: Date, serviceType?: string, page?: number, pageSize?: number) {
    const requestURL = `/price-list/search?serviceType=${serviceType}`;
    const body = {
      serviceCode,
      providerId,
      payerId,
      visitDate: this._formatDate(this._fixDate(visitDate))
    };
    const request = new HttpRequest('POST', environment.adminServiceHost + requestURL, body);
    return this.http.request(request);
  }

  checkIfServiceCodeRestrictionIsEnabled(providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/config/${SERVICE_CODE_RESTRICTION_KEY}/payers/${payerId}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  checkIfPBMValidationIsEnabled(providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/config/${PBM_RESTRICTION_KEY}/payers/${payerId}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  checkIfNphiesPBMValidationIsEnabled(providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/config/${NPHIES_PBM_RESTRICTION_KEY}/payers/${payerId}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  checkIfNphiesApprovalPBMValidationIsEnabled(providerId: string, payerId: string) {
    const requestURL = `/providers/${providerId}/config/${NPHIES_PBM_APPROVAL_KEY}/payers/${payerId}`;
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


  _fixDate(date) {
    if (date != null && !(date instanceof Date)) {
      return new Date(date);
    }
    return date;
  }

  private _formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  getPractitionerList(providerId: string) {
    const requestURL = '/providers/' + providerId + '/practitioner';
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  getCodeDescriptionList(){
    const requestURL = '/diagnosis/search';
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }
}
