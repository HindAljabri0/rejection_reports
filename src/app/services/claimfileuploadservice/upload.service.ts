// import { ClaimSubmissionData } from 'src/app/claimpage/claimfileuploadservice/upload.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { ClaimInfo } from 'src/app/models/claimInfo';
import { ClaimError } from 'src/app/models/claimError';
import { ClaimStatus } from 'src/app/models/claimStatus';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  summary:UploadSummary;
  summaryChange:Subject<UploadSummary> = new Subject<UploadSummary>();

  constructor(private http: HttpClient) {
    this.http = http;
    this.summary = new UploadSummary(null);
    if(!environment.production){
      // this.test();
    }
    //TODO: get last summary from database.
    this.summaryChange.subscribe((value)=> {
      this.summary = value;
    });
  }
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', environment.uploaderHost+'/104/102/uploads',  formdata, {
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

  test(){
    this.summary.noOfUploadedClaims = 5;
    this.summary.noOfAcceptedClaims = 3;
    this.summary.noOfNotAcceptedClaims = 2;
    this.summary.noOfNotUploadedClaims = 5;
    this.summary.netAmountOfAcceptedClaims = 10000;
    this.summary.netVATAmountOfUploadedClaims = 50;
    this.summary.uploadDate = new Date();
    let errors:ClaimError[] = new Array();
    let error = new ClaimError(null);
    error.errorCode = "000";
    error.errorDescription = "There was something wrong!";
    error.fieldName = "id";
    errors.push(error);
    let uploadedInfo:Array<ClaimInfo> = new Array();
    let claimInfo = new ClaimInfo(null);
    claimInfo.uploadStatus = ClaimStatus.Accepted;
    claimInfo.fileRowNumber = 5;
    claimInfo.providerClaimNumber = '564654';
    claimInfo.claimErrors = new Array();
    let claimInfo1 = new ClaimInfo(null);
    claimInfo1.uploadStatus = ClaimStatus.Not_Accepted;
    claimInfo1.fileRowNumber = 5;
    claimInfo1.providerClaimNumber = '564654';
    claimInfo1.claimErrors = errors;
    let claimInfo2 = new ClaimInfo(null);
    claimInfo2.uploadStatus = ClaimStatus.Not_Saved;
    claimInfo2.fileRowNumber = 1;
    claimInfo2.providerClaimNumber = 'dsafads';
    claimInfo2.claimErrors = errors;
    uploadedInfo.push(claimInfo);
    uploadedInfo.push(claimInfo);
    uploadedInfo.push(claimInfo);
    uploadedInfo.push(claimInfo1);
    uploadedInfo.push(claimInfo1);
    uploadedInfo.push(claimInfo2);
    uploadedInfo.push(claimInfo2);
    uploadedInfo.push(claimInfo2);
    uploadedInfo.push(claimInfo2);
    uploadedInfo.push(claimInfo2);

    

    this.summary.uploadedClaims = uploadedInfo;
  }
}
