import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
const url = 'http://localhost:8000/claimfileupload';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  summary:Summary;
  summaryChange:Subject<Summary> = new Subject<Summary>();

  constructor(private http: HttpClient) {
    this.http = http;
    this.summary = new Summary();
    //TODO: get last summary from database.
    this.summaryChange.subscribe((value)=> {
      console.log('Changed');
      this.summary = value;
    });
  }
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    const req = new HttpRequest('POST', 'http://localhost:8080/uploads',  formdata);

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
  uploadName:string = "Unknown";
  uploadedDate:Date = new Date(0,0,0,0,0,0,0);
  totalNumberOfClaims: number = 0;
  numberOfUploadedClaims: number = 0;
  numberOfNotUploadedClaims:number = 0;
  totalNetAmount: number = 0;
  totalAcceptedNetAmount:number = 0;
  totalNotAcceptedNetAmount:number = 0;
  totalNetVatAmount:number = 0;
  totalAcceptedNetVatAmount:number = 0;
  totalNotAcceptedNetVatAmount:number = 0;
  claimMetaData: string = "Unknown";
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
