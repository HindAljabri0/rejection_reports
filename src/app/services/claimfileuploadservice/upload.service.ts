// import { ClaimSubmissionData } from 'src/app/claimpage/claimfileuploadservice/upload.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
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
    this.summary = new UploadSummary();
    this.summaryChange.subscribe((value)=> {
      this.summary = value;
    });
  }
  pushFileToStorage(providerID:string, file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.uploaderHost+`/${providerID}/uploads`,  formdata, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  getUploadedSummary(summaryId:number,){
    const requestUrl = `/uploads/summary/${summaryId}?`;
    const request = new HttpRequest('GET', environment.uploaderHost+requestUrl);
    return this.http.request(request);
  }

  getUploadedClaimsDetails(summaryId:number, status?:string, page?:number, pageSize?:number){
    const requestUrl = `/uploads/details/${summaryId}?` + (status != null? `status=${status}&`:'')
    + (page != null? `page=${page}&`:'') + (pageSize != null? `size=${pageSize}`:'');
    const request = new HttpRequest('GET', environment.uploaderHost+requestUrl);
    return this.http.request(request);
  }

  handleUploadResponse(request:Observable<HttpEvent<{}>>){
    console.log('start from upload service');
    request.subscribe(event => {
      if(event instanceof HttpResponse){
        const summary:UploadSummary = JSON.parse(JSON.stringify(event.body));
        this.summaryChange.next(summary);
        console.log('done from upload service');
      }
    });
  }
}
