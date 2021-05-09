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
    claim.caseInformation.caseType;
    if (claim.caseInformation.caseDescription.illnessDuration != null) {
      body = {
        ...body, caseInformation: {
          ...body.caseInformation,
          caseDescription: {
            ...body.caseInformation.caseDescription,
            illnessDuration: body.caseInformation.caseDescription.illnessDuration.toPeriodFormat()
          }
        }
      };
    }
    if (claim.caseInformation.patient.age != null) {
      body = {
        ...body, caseInformation: {
          ...body.caseInformation,
          patient: {
            ...body.caseInformation.patient,
            age: body.caseInformation.patient.age.toPeriodFormat()
          }
        }
      };
    }
    if (claim.admission != null && claim.admission.discharge != null && claim.admission.discharge.actualLengthOfStay != null) {
      body = {
        ...body, admission: {
          ...body.admission,
          discharge: {
            ...body.admission.discharge,
            actualLengthOfStay: body.admission.discharge.actualLengthOfStay.toPeriodFormat()
          }
        }
      };
    }
    const httpRequest = new HttpRequest('POST', environment.claimServiceHost + requestUrl, body);
    return this.httpClient.request(httpRequest);
  }

  saveChangesToExistingClaim(claim: Claim, providerId: string, claimId: string) {
    const requestUrl = `/providers/${providerId}/${claimId}`;
    let body: any = { ...claim };
    claim.caseInformation.caseType;
    if (claim.caseInformation.caseDescription.illnessDuration != null) {
      body = {
        ...body, caseInformation: {
          ...body.caseInformation,
          caseDescription: {
            ...body.caseInformation.caseDescription,
            illnessDuration: body.caseInformation.caseDescription.illnessDuration.toPeriodFormat()
          }
        }
      };
    }
    if (claim.caseInformation.patient.age != null) {
      body = {
        ...body, caseInformation: {
          ...body.caseInformation,
          patient: {
            ...body.caseInformation.patient,
            age: body.caseInformation.patient.age.toPeriodFormat()
          }
        }
      };
    }
    if (claim.admission != null && claim.admission.discharge != null && claim.admission.discharge.actualLengthOfStay != null) {
      body = {
        ...body, admission: {
          ...body.admission,
          estimatedLengthOfStay: body.admission.discharge.actualLengthOfStay.toPeriodFormat(),
          discharge: { ...body.admission.discharge, actualLengthOfStay: body.admission.discharge.actualLengthOfStay.toPeriodFormat() }
        }
      };
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
    const requestUrl = `/providers/${providerId}/attachById/${claimId}`;
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
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost + requestUrl, {}, { headers: headers });
    return this.httpClient.request(httpRequest);
  }

  deleteClaimByUploadid(providerId: string, payerId: string, batchId: string, uploadId: string, caseTypes: string[], claimRefNo: string, patientFileNo: string, invoiceNo: string, policyNo: string, statuses: string[], memberId: string, claimIDs: string[], fromDate: string, toDate: string) {

    let requestURL = `/providers/${providerId}/criteria?`;
    if (claimIDs != null && claimIDs.length > 0) {
      requestURL += `claimIDs=${claimIDs}&`
    } else {


      if (payerId != null && uploadId == null) {
        requestURL += `payerId=${payerId}&`
      } if (batchId != null) {
        requestURL += `batchId=${batchId}&`
      } if (uploadId != null) {
        requestURL += `uploadId=${uploadId}&`
      } if (caseTypes != null) {
        requestURL += `caseTypes=${caseTypes}&`
      } if (claimRefNo != null) {
        requestURL += `claimRefNo=${claimRefNo}&`
      } if (patientFileNo != null) {
        requestURL += `patientFileNo=${patientFileNo}&`
      } if (invoiceNo != null) {
        requestURL += `invoiceNo=${invoiceNo}&`
      } if (policyNo != null) {
        requestURL += `policyNo=${policyNo}&`
      } if (statuses != null) {
        requestURL += `statuses=${statuses}&`
      } if (memberId != null) {
        requestURL += `memberId=${memberId}&`
      } if (fromDate != null) {
        requestURL += `fromDate=${fromDate}&`
      } if (toDate != null) {
        requestURL += `toDate=${toDate}&`
      }
    }
    const httpRequest = new HttpRequest('DELETE', environment.claimServiceHost + requestURL);
    return this.httpClient.request(httpRequest);
  }

  PBMValidation(providerId: string, payerId: string, batchId: string, uploadId: string, caseTypes: string[], claimRefNo: string, patientFileNo: string, invoiceNo: string, policyNo: string, statuses: string[], memberId: string, claimIDs: string[], fromDate: string, toDate: string) {

    let requestURL = `/providers/${providerId}/criteria?`;
    if (claimIDs != null && claimIDs.length > 0) {
      requestURL += `claimIDs=${claimIDs}&`
    } else {


      if (payerId != null && uploadId == null) {
        requestURL += `payerId=${payerId}&`
      } if (batchId != null) {
        requestURL += `batchId=${batchId}&`
      } if (uploadId != null) {
        requestURL += `uploadId=${uploadId}&`
      } if (caseTypes != null) {
        requestURL += `caseTypes=${caseTypes}&`
      } if (claimRefNo != null) {
        requestURL += `claimRefNo=${claimRefNo}&`
      } if (patientFileNo != null) {
        requestURL += `patientFileNo=${patientFileNo}&`
      } if (invoiceNo != null) {
        requestURL += `invoiceNo=${invoiceNo}&`
      } if (policyNo != null) {
        requestURL += `policyNo=${policyNo}&`
      } if (statuses != null) {
        requestURL += `statuses=${statuses}&`
      } if (memberId != null) {
        requestURL += `memberId=${memberId}&`
      } if (fromDate != null) {
        requestURL += `fromDate=${fromDate}&`
      } if (toDate != null) {
        requestURL += `toDate=${toDate}&`
      }
    }
    const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json');
    const httpRequest = new HttpRequest('POST', environment.pbmValidationService + requestURL, {}, { headers: headers });
    return this.httpClient.request(httpRequest);
  }

  getClaimIdByPayerRefNo(providerId: string, payerClaimRefNo: string) {
    const requestUrl = `/providers/${providerId}/PayerClaimRefNumber/${payerClaimRefNo}`;
    const request = new HttpRequest('GET', environment.claimServiceHost + requestUrl);
    return this.httpClient.request(request);
  }
}
