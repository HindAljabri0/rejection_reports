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
    let uploadedInfo:Array<UploadedClaim> = new Array();
    let claimInfo = new UploadedClaim(null);
    claimInfo.uploadStatus = ClaimStatus.Saved;
    claimInfo.fileRowNumber = 5;
    claimInfo.providerClaimNumber = '564654';
    claimInfo.claimErrors = new Array();
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

  noOfUploadedClaims: number = 0;
  netAmountOfUploadedClaims: number = 0;
  netVATAmountOfUploadedClaims: number = 0;

  uploadedClaims: Array<UploadedClaim>;

  noOfAcceptedClaims:number = 0;
  netAmountOfAcceptedClaims: number = 0;
  netVATAmountOfAcceptedClaims: number = 0;

  noOfNotAcceptedClaims:number = 0;
  netAmountOfNotAcceptedClaims: number = 0;
  netVATAmountOfNotAcceptedClaims: number = 0;

  noOfNotUploadedClaims:number = 0;

  constructor(body: {}) {
    if (body != null) {
      this.uploadSummaryID = body['uploadSummaryID'];
      this.uploadName = body['uploadName'];
      this.uploadDate = body['uploadDate'];

      this.noOfUploadedClaims = body['noOfUploadedClaims'];
      this.netAmountOfUploadedClaims = body['netAmountOfUploadedClaims'];
      this.netVATAmountOfUploadedClaims = body['netVATAmountOfUploadedClaims'];

      this.noOfAcceptedClaims = body['noOfAcceptedClaims'];
      this.netAmountOfAcceptedClaims = body['netAmountOfAcceptedClaims'];
      this.netVATAmountOfAcceptedClaims = body['netVATAmountOfAcceptedClaims'];

      this.noOfNotAcceptedClaims = body['noOfNotAcceptedClaims'];
      this.netAmountOfNotAcceptedClaims = body['netAmountOfNotAcceptedClaims'];
      this.netVATAmountOfNotAcceptedClaims = body['netVATAmountOfNotAcceptedClaims'];

      this.noOfNotUploadedClaims = body['noOfNotUploadedClaims'];

      this.uploadedClaims = new Array();
      for(let uploadedclaim of body['uploadedClaims']){
        let claimInfo:UploadedClaim = new UploadedClaim(uploadedclaim);
        this.uploadedClaims.push(claimInfo);
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
  Saved = "Saved",
  Saved_With_Errors = "NotAccepted",
  Not_Saved = "NotSaved" ,
  Duplicated = "Duplicate"
}
