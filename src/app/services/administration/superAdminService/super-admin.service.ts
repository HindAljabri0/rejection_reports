import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  constructor(private http: HttpClient) { }

  getProviders() {
    const requestURL = '/providers';
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  getAssociatedPayers(providerId: string) {
    const requestURL = `/providers/${providerId}/payers`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }

  getProviderPayerSettings(providerId: string, key: string) {
    const requestURL = `/providers/${providerId}/config/${key}`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  saveProviderPayerSettings(providerId: string, settings: { payerId: string, key: string, value: string }[]) {
    const requestURL = `/providers/${providerId}/config`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, settings);
    return this.http.request(request);
  }

  getPortalUserSettings(providerId: string) {
    const requestURL = `/providers/${providerId}/portal-user/username`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }

  savePortalUserSettings(providerId: string, username: string, password: string) {
    const requestURL = `/providers/${providerId}/portal-user/save`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, { username, password });
    return this.http.request(request);
  }
  getPriceListValidationSettings(providerId: string) {
    const requestURL = `/price-list/providers/${providerId}/config`;
    const request = new HttpRequest('GET', environment.adminServiceHost + requestURL);
    return this.http.request(request);
  }
  updatePriceListSettings(providerId: string, settings: { payerId: string, isServiceCodeEnable: string, isPriceListEnable: string }[]) {
    const requestURL = `/price-list/providers/${providerId}/config`;
    const request = new HttpRequest('POST', environment.adminServiceHost + requestURL, settings);
    return this.http.request(request);
  }

  getPayerPaymentContractDetailsData(providerId: string): Observable<any> {
    const requestURL = `/providers/${providerId}`;

    // let searchparams = new HttpParams();
    // if (data) {
    //   for (const key in data) {
    //     if (data.hasOwnProperty(key) && data[key] !== undefined) { searchparams = searchparams.set(key, data[key]); }
    //   }
    // }
    const request = new HttpRequest('GET', environment.payerPaymentContractService + requestURL, { responseType: 'text' });
    return this.http.request(request);
  }
  addPayerPaymentContractDetailsData(providerId: any, file: File, data: any) {
    const formdata: FormData = new FormData();
    formdata.append('agreementCopy', file, file.name);
    formdata.append('effectiveDate', data.effectiveDate);
    formdata.append('expiryDate', data.expiryDate);
    formdata.append('payerid', data.payerid);
    formdata.append('modePayment', data.modePayment);
    formdata.append('numberOfDays', data.numberOfDays);
    formdata.append('isActive', data.isActive);

    const requestURL = `/providers/${providerId}`;

    const req = new HttpRequest('POST', environment.payerPaymentContractService + requestURL, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
  updatePayerPaymentContractDetailsData(providerId: any, file: File, data: any, editId) {
    const formdata: FormData = new FormData();
    formdata.append('agreementCopy', file, file.name);
    formdata.append('effectiveDate', data.effectiveDate);
    formdata.append('expiryDate', data.expiryDate);
    formdata.append('payerid', data.payerid);
    formdata.append('modePayment', data.modePayment);
    formdata.append('numberOfDays', data.numberOfDays);
    formdata.append('isActive', data.isActive);

    const requestURL = `/providers/${providerId}/contractId/${editId}`;
    const req = new HttpRequest('PUT', environment.payerPaymentContractService + requestURL, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  searchByCriteriaForAgingReport(providerId: string, formDate: any, toDate: any) {

    const requestURL = `/providers/${providerId}/aging/search?toDate=${toDate}`;
    const req = new HttpRequest('GET', environment.payerPaymentContractService + requestURL);
    return this.http.request(req);
  }
}

export const SERVICE_CODE_RESTRICTION_KEY = 'serviceCodeRestriction';
export const VALIDATE_RESTRICT_PRICE_UNIT = 'validateOrRestrictUnitPrice';
export const ICD10_RESTRICTION_KEY = 'ICD10Validation';
export const SFDA_RESTRICTION_KEY = 'sfdaRestriction';
export const PBM_RESTRICTION_KEY = 'pbmValidation';
export const NET_AMOUNT_RESTRICTION_KEY = 'netAmountValidation';
