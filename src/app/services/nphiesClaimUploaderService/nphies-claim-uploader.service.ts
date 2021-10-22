import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NphiesClaimUploaderService {

  constructor(private http: HttpClient) { }

  createNphisClaim(providerId: string, body: any) {
    const requestUrl = `/providers/${providerId}/claim/upload`;
    const request = new HttpRequest('POST', environment.nphiesClaimUploader + requestUrl, body);
    return this.http.request(request);
  }


  getUploadSummaries(providerId: string, page?: number, size?: number) {
    if (page == null) {
      page = 0;
    }
    if (size == null) {
      size = 10;
    }
    const requestUrl = `/providers/${providerId}/uploads?page=${page}&size=${size}`;
    const request = new HttpRequest('GET', environment.nphiesClaimUploader + requestUrl);
    return this.http.request(request);
  }
}
