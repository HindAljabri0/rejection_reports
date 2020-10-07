import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Claim } from 'src/app/claim-module-components/models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private httpClient: HttpClient) { }

  getUploadIdForManuallyCreatedClaims(providerId: string) {
    const requestUrl = `/upload-details/create/${providerId}`;
    const httpRequest = new HttpRequest('GET', environment.claimServiceHost + requestUrl);
    return this.httpClient.request(httpRequest);
  }

  saveManuallyCreatedClaim(claim: Claim, providerId: string) {
    const requestUrl = `/providers/${providerId}`;
    let body: any = { ...claim };
    claim.caseInformation.caseType
    if (claim.caseInformation.caseDescription.illnessDuration != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, caseDescription: { ...body.caseInformation.caseDescription, illnessDuration: body.caseInformation.caseDescription.illnessDuration.toPeriodFormat() } } };
    }
    if (claim.caseInformation.patient.age != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, patient: { ...body.caseInformation.patient, age: body.caseInformation.patient.age.toPeriodFormat() } } };
    }
    const httpRequest = new HttpRequest('POST', environment.claimServiceHost + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  saveChangesToExistingClaim(claim: Claim, providerId: string, claimId: string){
    const requestUrl = `/providers/${providerId}/${claimId}`;
    let body: any = { ...claim };
    claim.caseInformation.caseType
    if (claim.caseInformation.caseDescription.illnessDuration != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, caseDescription: { ...body.caseInformation.caseDescription, illnessDuration: body.caseInformation.caseDescription.illnessDuration.toPeriodFormat() } } };
    }
    if (claim.caseInformation.patient.age != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, patient: { ...body.caseInformation.patient, age: body.caseInformation.patient.age.toPeriodFormat() } } };
    }
    const httpRequest = new HttpRequest('PUT', environment.claimServiceHost + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  viewClaim(providerId: string, claimId: string){
    const requestUrl = `/providers/${providerId}/${claimId}`;
    const request = new HttpRequest('GET', environment.claimServiceHost + requestUrl);
    return this.httpClient.request(request);
  }

  updateClaim(providerId: string, payerId: string, claimId: number, data: {}) {
    const requestUrl = `/providers/${providerId}/${claimId}`;
    const httpRequest = new HttpRequest('PUT', environment.claimServiceHost + requestUrl, data);
    return this.httpClient.request(httpRequest);
  }

  deleteClaim(providerId: string, claimId) {
    const requestUrl = `/providers/${providerId}/${claimId}`;
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json')
    const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost + requestUrl, {}, { headers: headers });
    return this.httpClient.request(httpRequest);
  }

  /* deleteClaimByUploadid(providerId: string, uploadId){
     const requestUrl = `/providers/${providerId}/uploads/${uploadId}`;
     const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json')
     const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost+requestUrl, {}, {headers: headers});
     return this.httpClient.request(httpRequest);
   }*/
}
