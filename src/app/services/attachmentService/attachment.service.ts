import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  progressChange: Subject<{ percentage: number }> = new Subject();

  constructor(private http: HttpClient) { }

  uploadAttachament(providerID: string, claimID: string, file: File) {
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.claimServiceHost + `/providers/${providerID}/attach/${claimID}`, formdata, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  deleteAttachment(providerID: string, attachmentID: string) {
    const requestUrl = `/providers/${providerID}/attach/${attachmentID}`;
    const request = new HttpRequest('DELETE', environment.claimServiceHost + requestUrl);
    return this.http.request(request);
  }

  getMaxAttachmentAllowed(providerID: string) {
    const requestUrl = `/providers/${providerID}/attach/allowedNumber`;
    const request = new HttpRequest('GET', environment.claimServiceHost + requestUrl);
    return this.http.request(request);
  }
}

