import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CdmService {

  constructor(private http: HttpClient) { }

  getPatientList(providerId: string, body: any, page, size) {
    const requestUrl = `/cdm/providers/${providerId}/search?page=${page}&size=${size}`;
    const request = new HttpRequest('POST', environment.chronicDiseaseManagement + requestUrl, body);
    return this.http.request(request);
  }
  getPatientApproval(providerId: string, _patientId: string) {
    const requestUrl = `/cdm/providers/${providerId}/detail`;
    const request = new HttpRequest('POST', environment.chronicDiseaseManagement + requestUrl, { patientId: _patientId });
    return this.http.request(request);
  }
  downloadExcelsheet(providerId: string, model: any) {
    let requestURL = `/cdm/providers/${providerId}/download?`;

    if (model.city != null) {
      requestURL += `&city=${model.city}`;
    }
    if (model.policyNumber != null) {
      requestURL += `&policyNumber=${model.policyNumber}`;
    }
    if (model.diagnosis != null) {
      requestURL += `&diagnosis=${model.diagnosis}`;
    }
    const request = new HttpRequest('GET', environment.chronicDiseaseManagement + requestURL, '', { responseType: 'text', reportProgress: true });
    return this.http.request(request);
  }

}
