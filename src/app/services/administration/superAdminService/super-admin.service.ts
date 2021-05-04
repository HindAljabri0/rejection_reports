import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, { username: username, password: password });
    return this.http.request(request);
  }

}

export const SERVICE_CODE_RESTRICTION_KEY = 'serviceCodeRestriction';
export const VALIDATE_RESTRICT_PRICE_UNIT = 'validateOrRestrictUnitPrice';
export const ICD10_RESTRICTION_KEY = 'ICD10Validation';
export const SFDA_RESTRICTION_KEY = 'sfdaRestriction';
export const PBM_RESTRICTION_KEY = 'pbmValidation';
