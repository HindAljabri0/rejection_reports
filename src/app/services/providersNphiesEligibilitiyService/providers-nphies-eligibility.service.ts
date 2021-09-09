import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EligibilityRequestModel } from 'src/app/models/nphies/eligibilityRequestModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersNphiesEligibilityService {

  constructor(private http: HttpClient) { }

  sendEligibilityRequest(providerId: string, eligibilityRequest: EligibilityRequestModel) {
    const requestUrl = `/providers/${providerId}/request`;
    const request = new HttpRequest('POST', environment.providerNphiesEligibility + requestUrl, eligibilityRequest);
    return this.http.request(request);
  }

  getEligibilityTransactions(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/nphis/eligibility/fetch/criteria`;
    const request = new HttpRequest('POST', environment.providerNphiesEligibility + requestUrl, body);
    return this.http.request(request);
  }

  getEligibilityTransactionDetails(providerId: string, responseId: number) {
    const requestUrl = `/providers/${providerId}/nphies/eligibility?responseId=${responseId}`;
    const request = new HttpRequest('GET', environment.providerNphiesEligibility + requestUrl);
    return this.http.request(request);
  }
}
