import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentLinkService {

  constructor(private http: HttpClient) { }

  getFoldersName(providerID: string) {
    const requestUrl = `/provider/${providerID}/claims/attachment/folder/details`;
    const request = new HttpRequest('GET', environment.nphiesClaimLinkAttachment + requestUrl);
    return this.http.request(request);
  }
  uploadAttachSummary(providerID: string, page?: number, pageSize?: number) {
    const requestUrl = `/provider/${providerID}/claims/attachment/upload/details?page=${page}&pageSize=${pageSize}`;
    const request = new HttpRequest('GET', environment.nphiesClaimLinkAttachment + requestUrl);
    return this.http.request(request);
  }
  uploadAttachFilesDetails(providerID: string,summaryId:number,status:string, page?: number, pageSize?: number) {
    let requestUrl = `/provider/${providerID}/claims/attachment/files/details?page=${page}&size=${pageSize}`;
    if (summaryId != null) {
      requestUrl += `&summaryId=${summaryId}`;
    }
    if (status != null) {
      requestUrl += `&status=${status}`;
    }
    const request = new HttpRequest('GET', environment.nphiesClaimLinkAttachment + requestUrl);
    return this.http.request(request);
  }
}
