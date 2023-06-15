import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CdmService {

  constructor(private http: HttpClient) { }

  getPatientList(providerId: string, body: any,page,size){
    const requestUrl = `/cdm/providers/${providerId}/search?page=${page}&size=${size}`;
    const request = new HttpRequest('POST', environment.chronicDiseaseManagement + requestUrl, body);
    return this.http.request(request);
  }
  getPatientApproval(providerId: string, _patientId: string){
    const requestUrl = `/cdm/providers/${providerId}/detail`;
    const request = new HttpRequest('POST', environment.chronicDiseaseManagement + requestUrl, {patientId : _patientId});
    return this.http.request(request);
  }
}
