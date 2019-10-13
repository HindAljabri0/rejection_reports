import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const url = 'http://localhost:8000/claimfileupload';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
constructor(private http: HttpClient) {
  this.http = http;
}
  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

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
