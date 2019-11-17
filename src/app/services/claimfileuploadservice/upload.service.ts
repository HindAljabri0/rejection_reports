// import { ClaimSubmissionData } from 'src/app/claimpage/claimfileuploadservice/upload.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadSummary } from 'src/app/models/uploadSummary';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  summary:UploadSummary;
  summaryChange:Subject<UploadSummary> = new Subject<UploadSummary>();

  constructor(private http: HttpClient) {
    this.http = http;
    this.summary = new UploadSummary(null);
    this.summaryChange.subscribe((value)=> {
      this.summary = value;
    });
  }
  pushFileToStorage(providerID:string, payerID:string, file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', environment.uploaderHost+`/${providerID}/${payerID}/uploads`,  formdata, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
