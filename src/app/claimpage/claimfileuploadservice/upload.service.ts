// import { ClaimSubmissionData } from 'src/app/claimpage/claimfileuploadservice/upload.service';
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
    this.summary = new Summary(null);
    if(!environment.production)
      this.test();
    //TODO: get last summary from database.
    this.summaryChange.subscribe((value)=> {
      console.log('Changed');
      this.summary = value;
    });
  }
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', environment.host+'/55/44/uploads',  formdata, {
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
    this.summary.totalNumberOfUploadedClaims = 5;
    this.summary.numOfAcceptedClaims = 3;
    this.summary.numOfNotAcceptedClaims = 2;
    this.summary.numOfNotUploadedClaims = 5;
    this.summary.totalNetAmountOfUploadedClaims = 10000;
    this.summary.totalNetVatAmount = 50;
    this.summary.uploadDate = new Date();
    let errors:ClaimError[] = new Array();
    let error = new ClaimError(null);
    error.errorCode = "000";
    error.errorDescription = "There was something wrong!";
    error.fieldName = "id";
    errors.push(error);
    let uploadedInfo:Array<UploadedClaim> = new Array();
    let claimInfo = new UploadedClaim(null);
    claimInfo.uploadStatus = ClaimStatus.Saved;
    claimInfo.fileRowNumber = 5;
    claimInfo.providerClaimNumber = '564654';
    claimInfo.claimErrors = errors;
    let claimInfo1 = new UploadedClaim(null);
    claimInfo1.uploadStatus = ClaimStatus.Saved_With_Errors;
    claimInfo1.fileRowNumber = 5;
    claimInfo1.providerClaimNumber = '564654';
    claimInfo1.claimErrors = errors;
    let claimInfo2 = new UploadedClaim(null);
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


export class Summary {
  uploadSummaryID: string;
  uploadName: string;
  uploadDate: Date;
  totalNumberOfUploadedClaims: number;
  totalNetAmountOfUploadedClaims: number;
  totalNetVatAmount: number;
  uploadedClaims: Array<UploadedClaim>;

  numOfAcceptedClaims:number = 0;
  numOfNotAcceptedClaims:number = 0;
  numOfNotUploadedClaims:number = 0;

  constructor(body: {}) {
    if (body === null) {
      this.totalNetAmountOfUploadedClaims = 0;
      this.totalNetVatAmount = 0;
      this.totalNumberOfUploadedClaims = 0;
    } else {
      this.uploadSummaryID = body['uploadSummaryID'];
      this.uploadName = body['uploadName'];
      this.uploadDate = body['uploadDate'];
      this.totalNumberOfUploadedClaims = body['totalNumberOfUploadedClaims'];
      this.totalNetAmountOfUploadedClaims = body['totalNetAmountOfUploadedClaims'];
      this.totalNetVatAmount = body['totalNetVatAmount'];
      this.uploadedClaims = new Array();
      for(let uploadedclaim of body['uploadedClaims']){
        let claimInfo:UploadedClaim = new UploadedClaim(uploadedclaim);
        this.uploadedClaims.push(claimInfo);
        switch(claimInfo.uploadStatus){
          case ClaimStatus.Saved:
            this.numOfAcceptedClaims++;
            break;
          case ClaimStatus.Saved_With_Errors:
            this.numOfNotAcceptedClaims++;
          default:
            this.numOfNotUploadedClaims++;
        }
      }
    }
  }
}

export class UploadedClaim {
  fileRowNumber: number;
  providerClaimNumber: string;
  uploadStatus: string;
  uploadSubStatus: string;
  claimErrors: Array <ClaimError>;
  constructor(body: {}) {
    if(body != null){
      this.fileRowNumber = body['fileRowNumber'];
      this.providerClaimNumber = body['providerClaimNumber'];
      this.uploadStatus = body['uploadStatus'];
      this.uploadSubStatus = body ['uploadSubStatus'];
      this.claimErrors = new Array();
      for (let error of body ['claimErrors']) {
        this.claimErrors.push(new ClaimError(error));
      }
    }
  }
}


export class ClaimError {
  errorCode: string;
  errorDescription: string;
  fieldName: string;
  constructor(body: {}) {
    if(body != null){
      this.errorCode = body['errorCode'];
      this.errorDescription = body['errorDescription'];
      this.fieldName = body ['fieldName'];
    }
  }
}

export enum ClaimStatus{
  Saved = "saved",
  Saved_With_Errors = "saved with errors",
  Not_Saved = "not saved" ,
  Duplicated = "duplicated"
}
