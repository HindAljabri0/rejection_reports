import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersBeneficiariesService {
  constructor(private httpClient: HttpClient) { }

  getBeneficiaryById(providerId: string, beneficiaryId: string, simplified: boolean = false) {
    const requestUrl = `/providers/${providerId}/beneficiaryId/${beneficiaryId}?simplified=${simplified}`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  saveBeneficiaries(beneficiaryModel: BeneficiaryModel, providerId: string) {
    const requestUrl = `/providers/${providerId}`;
    let body: any = { ...beneficiaryModel };
    const httpRequest = new HttpRequest('POST', environment.providersBeneficiariesService + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  getPayers() {
    const requestUrl = `/lov/payers`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  beneficiaryFullTextSearch(providerId: string, query: string) {
    const requestUrl = `/providers/${providerId}/search?query=${query}`;
    const request = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(request);
  }


  editBeneficiaries(providerId: string, beneficiaryId: string , beneficiaryModel: BeneficiaryModel){
    const requestUrl = `/providers/${providerId}/beneficiaryId/${beneficiaryId}`;
    let body: any = { ...beneficiaryModel };
    const httpRequest = new HttpRequest('PUT', environment.providersBeneficiariesService + requestUrl, body);
    return this.httpClient.request(httpRequest);

  }

  getPayees() {
    const requestUrl = `/lov/providers`;
    const httpRequest = new HttpRequest('GET', environment.providersBeneficiariesService + requestUrl);
    return this.httpClient.request(httpRequest);
  }

}
