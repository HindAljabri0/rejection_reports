import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  summary:Summary;
  summaryChange:Subject<Summary> = new Subject<Summary>();

  constructor(private http: HttpClient) {
    this.http = http;
    this.summary = new Summary(null);
    //TODO: get last summary from database.
    this.summaryChange.subscribe((value)=> {
      console.log('Changed');
      this.summary = value;
    });
  }
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', environment.host+'/uploads',  formdata, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get('/getallfiles');
  }
  uploadFile(formData: FormData): Observable <any> {
    return this.http.post('http://localhost:8080/uploads', formData);
  }
}

export class Summary {
  uploadUniqueId:string;
  uploadName:string;
  uploadedDate:Date;
  totalNumberOfUploadedClaims:number;
  totalNumberOfNotUploadedClaims:number;
  totalNetAmountOfUploadedClaims:number;
  totalNetVatAmountOfUploadedClaims:number;
  claimMetaData: Array<ClaimSubmissionData>;
  constructor(body:{}){
    if(body === null){
      this.totalNetAmountOfUploadedClaims = 0;
      this.totalNetVatAmountOfUploadedClaims = 0;
      this.totalNumberOfNotUploadedClaims = 0;
      this.totalNumberOfUploadedClaims = 0;
    } else {
      this.uploadUniqueId = body['uploadUniqueId'];
      this.uploadName = body['uploadName'];
      this.uploadedDate = body['uploadedDate'];
      this.totalNumberOfUploadedClaims = body['totalNumberOfUploadedClaims'];
      this.totalNumberOfNotUploadedClaims = body['totalNumberOfNotUploadedClaims'];
      this.totalNetAmountOfUploadedClaims = body['totalNetAmountOfUploadedClaims'];
      this.totalNetVatAmountOfUploadedClaims = body['totalNetVatAmountOfUploadedClaims'];
      this.claimMetaData = body['claimMetaData'];
    }
  }
}

export class ClaimSubmissionData {
  rowNumber:number;
  providerClaimNumber:string;
  claimUploadStatus:string;
  errorCode:string;
  fieldName:string;
  errorDescription:string;
}

export enum ClaimUploadStatus {
  UPLOADED, NOTUPLOADED, DUPLICATED
}
/*export class UploadService {
  constructor(private http: HttpClient) { }

  postFile(fileToUpload: File) {
    const endpoint = 'http://localhost:8080/uploads';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData);
  }
}*/
