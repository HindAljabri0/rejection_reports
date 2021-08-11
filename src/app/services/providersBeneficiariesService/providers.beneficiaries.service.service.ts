import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvidersBeneficiariesService {
  constructor(private httpClient: HttpClient) { }

  saveManuallyCreatedClaim(BeneficiaryModel: BeneficiaryModel, providerId: string) {
    const requestUrl = `/providers/${providerId}`;
    let body: any = { ...BeneficiaryModel };
    const httpRequest = new HttpRequest('POST', environment.providersBeneficiariesService + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

 

}
