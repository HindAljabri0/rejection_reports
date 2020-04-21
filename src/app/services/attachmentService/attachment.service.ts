import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType, HttpErrorResponse, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  progressChange:Subject<{ percentage: number }> = new Subject();

  constructor(private http:HttpClient){}

    uploadAttachament(providerID:string, claimID: string, file: File) {
    const formdata: FormData = new FormData();

    formdata.append('file', file, file.name);
    const req = new HttpRequest('POST', environment.claimServiceHost+`/providers/${providerID}/attach/${claimID}`,  formdata, {
      reportProgress: true,
    });

   return this.http.request(req);
  }
}

