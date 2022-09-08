import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbMappingService {

  constructor(private http: HttpClient) { }

  setDatabaseConfig(providerId: string, body) {
    const requestURL = `/providers/${providerId}/db-config`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getDatabaseConfig(providerId: string) {
    const requestURL = `/providers/${providerId}/db-config`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  getDatabaseConfigList(providerId: string) {
    const requestURL = `/providers/${providerId}/db-config/list`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  deleteDatabaseConfig(providerId: string) {
    const requestURL = `/providers/${providerId}/db-config`;
    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  savePayerMapping(providerId: string, body) {
    const requestURL = `/providers/${providerId}/payer-mapping`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getPayerMapping(providerId: string) {
    const requestURL = `/providers/${providerId}/payer-mapping`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  deletePayerMapping(providerId: string, body) {
    const requestURL = `/providers/${providerId}/payer-mapping`;

    const request = new HttpRequest('PUT', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  setProviderMapping(body, providerId) {
    const requestURL: string = `/providers/` + providerId + `/provider-mapping`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getProviderMapping(providedId) {
    const requestURL: string = `/providers/` + providedId + `/provider-mapping`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  deleteProviderMapping(providedId) {
    const requestURL: string = `/providers/` + providedId + `/provider-mapping`;
    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  getNetAmountAccuracy(providedId) {
    const requestURL: string = `/providers/` + providedId + `/config/amount`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  setNetAmountAccuracy(providedId, body) {
    const requestURL = `/providers/${providedId}/config/amount`;
    const formdata: FormData = new FormData();
    formdata.append('netValue', body);
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, formdata, {
      responseType: 'text'
    });
    return this.http.request(request);
  }

  getNphiesPayerMapping(providerId: string) {
    const requestURL = `/providers/${providerId}/nphies/payer-mapping`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
  saveNphiesPayerMapping(providerId: string, body) {
    const requestURL = `/providers/${providerId}/nphies/payer-mapping`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  deleteNphiesPayerMapping(providerId: string, body) {
    const requestURL = `/providers/${providerId}/nphies/payer-mapping`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestURL, body, { headers });
    return this.http.request(request);
  }
  savePollConfiguration(body, providerId) {
    const requestURL: string = `/providers/` + providerId + `/poll-configuration`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getPollConfiguration(providerId) {
    const requestURL: string = `/providers/` + providerId + `/poll-configuration`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
}
