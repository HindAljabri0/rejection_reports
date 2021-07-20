import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private httpClint: HttpClient) { }

  reValidateClaims(
    providerID: string, payerId: string, batchId: string, uploadId: string, caseTypes: string[], claimRefNo: string,
    patientFileNo: string, invoiceNo: string, policyNo: string, statuses: string[], memberId: string, claimIDs: string[],
    fromDate: string, toDate: string, drname?: string, nationalId?: string, claimDate?: string) {

    let requestURL = `/providers/${providerID}/re-validate/criteria?`;
    if (claimIDs != null && claimIDs.length > 0) {
      requestURL += `claimIDs=${claimIDs}&`;
    } else {


      if (payerId != null) {
        requestURL += `payerId=${payerId}&`;
      }
      if (batchId != null) {
        requestURL += `batchId=${batchId}&`;
      }
      if (uploadId != null) {
        requestURL += `uploadId=${uploadId}&`;
      }
      if (caseTypes != null) {
        requestURL += `caseTypes=${caseTypes}&`;
      }
      if (invoiceNo != null) {
        requestURL += `invoiceNo=${invoiceNo}&`;
      }
      if (policyNo != null) {
        requestURL += `policyNo=${policyNo}&`;
      }
      if (statuses != null) {
        requestURL += `statuses=${statuses}&`;
      }
      if (fromDate != null) {
        requestURL += `fromDate=${fromDate}&`;
      }
      if (toDate != null) {
        requestURL += `toDate=${toDate}&`;
      }
      if (claimRefNo != null && claimRefNo !== undefined && claimRefNo !== '') {
        requestURL += `claimRefNo=${claimRefNo}&`;
      }
      if (memberId != null && memberId !== undefined && memberId !== '') {
        requestURL += `memberId=${memberId}&`;
      }

      if (patientFileNo != null && patientFileNo !== undefined && patientFileNo !== '') {
        requestURL += `patientFileNo=${patientFileNo}&`;
      }
      if (drname != null && drname !== '' && drname !== undefined) {
        requestURL += `drname=${drname}&`;
      }
      if (nationalId != null && nationalId !== '' && nationalId !== undefined) {
        requestURL += `nationalId=${nationalId}&`;
      }
      if (claimDate != null && claimDate !== '' && claimDate !== undefined) {
        requestURL += `claimDate=${claimDate}`;
      }
    }

    const httpRequest = new HttpRequest('PATCH', environment.claimServiceHost + requestURL, null);

    return this.httpClint.request(httpRequest);
  }
}



