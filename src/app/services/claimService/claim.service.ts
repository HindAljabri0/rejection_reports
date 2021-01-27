import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { AssignedAttachment } from 'src/app/pages/searchClaimsPage/store/search.reducer';

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
    if (claim.admission != null && claim.admission.discharge != null && claim.admission.discharge.actualLengthOfStay != null) {
      body = { ...body, admission: { ...body.admission, discharge: { ...body.admission.discharge, actualLengthOfStay: body.admission.discharge.actualLengthOfStay.toPeriodFormat() } } };
    }
    const httpRequest = new HttpRequest('POST', environment.claimServiceHost + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  saveChangesToExistingClaim(claim: Claim, providerId: string, claimId: string) {
    const requestUrl = `/providers/${providerId}/${claimId}`;
    let body: any = { ...claim };
    claim.caseInformation.caseType
    if (claim.caseInformation.caseDescription.illnessDuration != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, caseDescription: { ...body.caseInformation.caseDescription, illnessDuration: body.caseInformation.caseDescription.illnessDuration.toPeriodFormat() } } };
    }
    if (claim.caseInformation.patient.age != null) {
      body = { ...body, caseInformation: { ...body.caseInformation, patient: { ...body.caseInformation.patient, age: body.caseInformation.patient.age.toPeriodFormat() } } };
    }
    if (claim.admission != null && claim.admission.discharge != null && claim.admission.discharge.actualLengthOfStay != null) {
      body = { ...body, admission: { ...body.admission, discharge: { ...body.admission.discharge, actualLengthOfStay: body.admission.discharge.actualLengthOfStay.toPeriodFormat() } } };
    }
    const httpRequest = new HttpRequest('PUT', environment.claimServiceHost + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  getAttachmentsOfClaim(providerId: string, claimId: string) {
    const requestUrl = `/providers/${providerId}/attach/${claimId}`;
    const request = new HttpRequest('GET', environment.claimServiceHost + requestUrl);
    return this.httpClient.request<Array<{ attachmentfile, filename: string, filetype: string }>>(request);
  }

  putAttachmentsOfClaim(providerId: string, claimId: string, attachments: AssignedAttachment[]) {
    const requestUrl = `/providers/${providerId}/attach/${claimId}`;
    const request = new HttpRequest('PUT', environment.claimServiceHost + requestUrl, attachments.map(att =>
    ({
      attachmentid: att.attachmentId,
      providerid: providerId,
      filename: att.name,
      attachmentfile: att.file,
      filetype: att.type,
      usercomment: null
    }))
    );
    return this.httpClient.request(request);
  }

  viewClaim(providerId: string, claimId: string) {
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

  deleteClaimByUploadid(providerId: string, uploadId) {
    const requestUrl = `/providers/${providerId}/uploads/${uploadId}`;
    const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost + requestUrl);
    return this.httpClient.request(httpRequest);
  }
}
