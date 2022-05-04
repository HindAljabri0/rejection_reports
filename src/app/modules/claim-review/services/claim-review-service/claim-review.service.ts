import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Upload } from '../../models/upload.model';

@Injectable({
    providedIn: 'root'
})
export class ClaimReviewService {

    constructor(private http: HttpClient) { }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number, providerId : string) {
        const requestUrl = `/scrubbing`;
        return this.http.post(environment.claimReviewService + requestUrl,{"status" : status,"page" : pageNumber, "pageSize": pageSize,"userName" : providerId,"doctor" : localStorage.getItem('101101').includes('|24.41') || localStorage.getItem('101101').startsWith('24.41'), 
        "coder" : localStorage.getItem('101101').includes('|24.42') || localStorage.getItem('101101').startsWith('24.42')});
    }

    selectDetailView(id: number, pageNumber: number, pageSize: number){
        const requestUrl = `/scrubbing/details`;
        return this.http.post(environment.claimReviewService + requestUrl,{"uploadId" : id,"page" : pageNumber, "pageSize" : pageSize});
      }
}
