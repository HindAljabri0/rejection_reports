import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NphiesClaimUploaderService {

  summary: UploadSummary;
  summaryChange: Subject<UploadSummary> = new Subject<UploadSummary>();
  uploading = false;
  progress: { percentage: number } = { percentage: 0 };
  progressChange: Subject<{ percentage: number }> = new Subject();
  uploadingObs: Subject<boolean> = new Subject<boolean>();
  error: string;
  errorChange: Subject<string> = new Subject();
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

  pushFileToStorage(providerID: string, file: File) {
    if (this.uploading) { return; }
    this.uploading = true;
    this.uploadingObs.next(true);
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.nphiesClaimUploader + `/providers/${providerID}/file`, formdata, {
      reportProgress: true,
    });

    this.http.request(req).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progressChange.next({ percentage: Math.round(100 * event.loaded / event.total) });
      } else if (event instanceof HttpResponse) {
        this.uploading = false;
        this.uploadingObs.next(false);
        const summary: UploadSummary = JSON.parse(JSON.stringify(event.body));
        this.summaryChange.next(summary);
        this.progressChange.next({ percentage: 101 });
      }
    }, errorEvent => {
      this.uploading = false;
      this.uploadingObs.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status >= 500) {
          this.errorChange.next('Server could not handle your request at the moment. Please try again later.');
        } else if (errorEvent.status >= 400) {
          this.errorChange.next(errorEvent.error['message']);
        } else { this.errorChange.next('Server could not be reached at the moment. Please try again later.'); }
      }
    });
  }
}
