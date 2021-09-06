import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderNphiesApprovalService {

  constructor(private http: HttpClient) { }

  sendApprovalRequest(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/approval/request`;
    const request = new HttpRequest('POST', environment.providerNphiesApproval + requestUrl, body);
    return this.http.request(request);
  }
}
