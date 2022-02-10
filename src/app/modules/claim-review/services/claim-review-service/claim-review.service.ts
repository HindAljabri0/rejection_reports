import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClaimReviewService {

    constructor(private http: HttpClient) { }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number) {
        const requestUrl = `/uploads?status=${status}&page=${pageNumber}&size=${pageSize}`;
        const request = new HttpRequest('GET', requestUrl);
        return this.http.request(request);
    }
}
