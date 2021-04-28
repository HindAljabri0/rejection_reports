import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
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

    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestURL);
    const requestWithBody = request.clone({ body: body });
    return this.http.request(requestWithBody);
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
  setPBMMapping(body, providerId) {
    const requestURL: string = `/providers/${providerId}/pbm-config`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestURL, body);
    return this.http.request(request);
  }
  getPBMMapping(providerId) {
    const requestURL: string = `/providers/${providerId}/pbm-config`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.http.request(request);
  }
}
