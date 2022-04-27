import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClaimReviewService {

    constructor(private http: HttpClient) { }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number) {
        const requestUrl = `/scrubbing?status=${status}&page=${pageNumber}&pageSize=${pageSize}`;
        const request = new HttpRequest('GET', environment.claimReviewService + requestUrl);
        return this.http.request(request);
    }
}
