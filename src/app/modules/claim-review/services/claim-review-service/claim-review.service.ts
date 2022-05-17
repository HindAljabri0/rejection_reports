import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { environment } from 'src/environments/environment';
import { FieldError } from '../../store/claimReview.reducer';


@Injectable({
    providedIn: 'root'
})
export class ClaimReviewService {

    constructor(private http: HttpClient) { }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number, providerId: string) {
        const requestUrl = `/scrubbing/upload`;
        return this.http.post(environment.claimReviewService + requestUrl, {
            "status": status, "page": pageNumber, "pageSize": pageSize, "userName": providerId, "doctor": localStorage.getItem('101101').includes('|24.41') || localStorage.getItem('101101').startsWith('24.41'),
            "coder": localStorage.getItem('101101').includes('|24.42') || localStorage.getItem('101101').startsWith('24.42')
        });
    }

    selectDetailView(uploadId: number, pageNumber: number, pageSize: number, isDoctor: boolean, isCoder: boolean) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim`;
        return this.http.post(environment.claimReviewService + requestUrl, { "page": pageNumber, "pageSize": pageSize, "doctor": isDoctor, "coder": isCoder });
    }
    
    selectSingleClaim(uploadId: number, provClaimNo: string) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim/` + provClaimNo;
        return this.http.get<Claim>(environment.claimReviewService + requestUrl);
    }

    selectSingleClaimErrors(uploadId: number, provClaimNo: string) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim/` + provClaimNo + `/errors`;
        return this.http.get<FieldError[]>(environment.claimReviewService + requestUrl);
    }
}
