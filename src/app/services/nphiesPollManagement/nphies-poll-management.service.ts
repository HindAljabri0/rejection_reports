import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NphiesPollManagementService {

  constructor(private http: HttpClient) { }

  sendCommunication(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/communication`;
    const request = new HttpRequest('POST', environment.nphiesPollManagement + requestUrl, body);
    return this.http.request(request);
  }
}
