// import { ClaimSubmissionData } from 'src/app/claimpage/claimfileuploadservice/upload.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadSummary } from 'src/app/models/uploadSummary';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  summary: UploadSummary;
  summaryChange: Subject<UploadSummary> = new Subject<UploadSummary>();
  uploading = false;
  progress: { percentage: number } = { percentage: 0 };
  progressChange: Subject<{ percentage: number }> = new Subject();
  uploadingObs: Subject<boolean> = new Subject<boolean>();
  error: string;
  errorChange: Subject<string> = new Subject();
  constructor(private http: HttpClient) {
    this.http = http;
    this.summary = new UploadSummary();
    this.summaryChange.subscribe((value) => {
      this.summary = value;
    });
    this.progressChange.subscribe(value => {
      this.progress = value;
    });
    this.errorChange.subscribe(value => this.error = value);
  }
  pushFileToStorage(providerID: string, file: File) {
    if (this.uploading) { return; }
    this.uploading = true;
    this.uploadingObs.next(true);
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.uploaderHost + `/providers/${providerID}/file`, formdata, {
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

  getUploadSummaries(providerId: string, page?: number, size?: number) {
    if (page == null) {
      page = 0;
    }
    if (size == null) {
      size = 10;
    }
    const requestUrl = `/providers/${providerId}/history?page=${page}&size=${size}`;
    const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
    return this.http.request(request);
  }

  searchUploadSummaries(providerId: string, query?: string, fromDate?: string, toDate?: string, page?: number, size?: number) {
    if (page == null) { page = 0; }
    if (size == null) { size = 10; }
    let requestUrl = `/providers/${providerId}/history/search?`;

    if (query != null) {
      requestUrl += `query=${query}`;
    } else if (fromDate != null && toDate != null) {
      requestUrl += `fromDate=${fromDate}&toDate=${toDate}`;
    }
    requestUrl += `&page=${page}&size=${size}`;

    const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
    return this.http.request(request);
  }

  getUploadedSummary(providerId: string, uploadId: number) {
    const requestUrl = `/providers/${providerId}/history/${uploadId}?`;
    const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
    return this.http.request(request);
  }

  getUploadedClaimsDetails(providerId: string, uploadId: number, status?: string, page?: number, pageSize?: number) {
    const requestUrl = `/providers/${providerId}/history/${uploadId}/details?` + (status != null ? `status=${status}&` : '')
      + (page != null ? `page=${page}&` : '') + (pageSize != null ? `size=${pageSize}` : '');
    const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
    return this.http.request(request);
  }

  handleUploadResponse(request: Observable<HttpEvent<{}>>) {
    request.subscribe(event => {
      if (event instanceof HttpResponse) {
        const summary: UploadSummary = JSON.parse(JSON.stringify(event.body));
        this.summaryChange.next(summary);
      }
    });
  }

  // deleteClaimByUploadid(providerId: string, uploadId){
  //   const requestUrl = `/providers/${providerId}/history/uploads/${uploadId}`;
  //   const headers: HttpHeaders = new HttpHeaders('Content-Type: application/json')
  //   const httpRequest = new HttpRequest('DELETE', environment.uploaderHost+requestUrl, {}, {headers: headers});
  //   return this.http.request(httpRequest);
  // }

  getClaimsErrorByFieldName(providerId: string, uploadId: number, status?: string, page?: number, pageSize?: number) {
    const requestUrl = `/providers/${providerId}/history/${uploadId}/details/` + status
      + (page != null ? `?page=${page}&` : '') + (pageSize != null ? `size=${pageSize}` : '');
    const request = new HttpRequest('GET', environment.uploaderHost + requestUrl);
    return this.http.request(request);
  }

}
