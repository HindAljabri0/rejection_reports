import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { ModifyingCodeValueRequest } from 'src/app/pages/configurationsPage/store/configurations.reducer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getAllDiagnosisList() {
    const requestUrl = `/chronic-desease/fetch`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  getProviderMappingsWithCategories(providerId: string) {
    const requestUrl = `/providers/${providerId}/map-values?withCat=true`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  sendChangingProviderMappingsRequest(providerId: string, values: ModifyingCodeValueRequest[], type: 'SAVE' | 'DELETE') {
    if (type == 'SAVE') {
      return this.saveNewProviderMappings(providerId, values);
    } else {
      return this.deleteProviderMappings(providerId, values);
    }
  }

  saveNewProviderMappings(providerId: string, newValues: ModifyingCodeValueRequest[]) {
    const requestUrl = `/providers/${providerId}/map-values`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestUrl, newValues);
    return this.httpClient.request(request);
  }

  deleteProviderMappings(providerId: string, toDeleteValues: ModifyingCodeValueRequest[]) {
    const requestUrl = `/providers/${providerId}/map-values`;
    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestUrl);
    const requestWithBody = request.clone({ body: toDeleteValues });
    return this.httpClient.request(requestWithBody);
  }

  // getSaveCertificateFileToProvider(providerId: any, file: File, item:CertificateConfigurationProvider) {
  getSaveCertificateFileToProvider(providerId: any, file: File, password: string, expiryDate) {
    const formdata: FormData = new FormData();
    formdata.append('uploadFile', file, file.name);
    const requestURL = `/providers/${providerId}/addFile?password=${password}&expiryDate=${expiryDate}`;
    const req = new HttpRequest('POST', environment.settingsServiceHost + requestURL, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.httpClient.request(req);

  }
  getDetails(providerId: any) {
    const requestURL = `/providers/${providerId}/details`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.httpClient.request(request);
  }

  getNphiesProviderMappingsWithCategories(providerId: string) {
    const requestUrl = `/providers/${providerId}/nphies-map-values?withCat=true`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  sendNphiesChangingProviderMappingsRequest(providerId: string, values: ModifyingCodeValueRequest[], type: 'SAVE' | 'DELETE') {
    if (type == 'SAVE') {
      return this.saveNphiesNewProviderMappings(providerId, values);
    } else {
      return this.deleteNphiesProviderMappings(providerId, values);
    }
  }

  saveNphiesNewProviderMappings(providerId: string, newValues: ModifyingCodeValueRequest[]) {
    const requestUrl = `/providers/${providerId}/nphies-map-values`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestUrl, newValues);
    return this.httpClient.request(request);
  }

  deleteNphiesProviderMappings(providerId: string, toDeleteValues: ModifyingCodeValueRequest[]) {
    const requestUrl = `/providers/${providerId}/nphies-map-values`;
    const request = new HttpRequest('DELETE', environment.settingsServiceHost + requestUrl);
    const requestWithBody = request.clone({ body: toDeleteValues });
    return this.httpClient.request(requestWithBody);
  }

  saveNphiesAttachmentConfigData(providerId: string, newValues: FormData) {
    const requestUrl = `/providers/${providerId}/nphies/attachment-config`;
    const request = new HttpRequest('POST', environment.settingsServiceHost + requestUrl, newValues);
    return this.httpClient.request(request);
  }

  getNphiesAttachmentConfigDetails(providerId: any) {
    const requestURL = `/providers/${providerId}/nphies/attachment-config`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.httpClient.request(request);
  }

  checkCertificateExpiry(providerId: any) {
    const requestURL = `/providers/${providerId}/check/certificate-expiry`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.httpClient.request(request);
  }

  getAlert() {
    const requestURL = `/providers/alert`;
    const request = new HttpRequest('GET', environment.settingsServiceHost + requestURL);
    return this.httpClient.request(request);
  }
}
