import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { UploadSummary } from 'src/app/models/uploadSummary';
import { SharedServices } from 'src/app/services/shared.services';
import { environment } from 'src/environments/environment';
import { ClaimDetails } from '../../models/ClaimDetails.model';
import { claimScrubbing } from '../../models/ClaimScrubbing.model';
import { SwitchUser } from '../../models/SwitchUser.model';
import { Upload } from '../../models/upload.model';
import { DiagnosisRemarksUpdateRequest, FieldError, MarkAsDone, UploadClaimsList } from '../../store/claimReview.reducer';


@Injectable({
    providedIn: 'root'
})
export class ClaimReviewService {

    summary: UploadSummary;
    summaryChange: Subject<UploadSummary> = new Subject<UploadSummary>();
    uploading = false;
    progress: { percentage: number } = { percentage: 0 };
    progressChange: Subject<{ percentage: number }> = new Subject();
    uploadingObs: Subject<boolean> = new Subject<boolean>();
    error: string;
    errorChange: Subject<string> = new Subject();


    constructor(private http: HttpClient, private sharedService: SharedServices) {
        this.summary = new UploadSummary();
        this.summaryChange.subscribe((value) => {
            this.summary = value;
        });
        this.progressChange.subscribe(value => {
            this.progress = value;
        });
        this.errorChange.subscribe(value => this.error = value);
    }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number, userName: string, doctorId: string, coderId: string, providerId: string) {
        var requestURL = "";
        if (this.sharedService.userPrivileges.WaseelPrivileges.RCM.isAdmin) {
            requestURL = '/uploads';
        } else {
            requestURL = `/scrubbing/upload`;
        }
        return this.http.post(environment.claimReviewService + requestURL, {
            "status": status, "page": pageNumber, "pageSize": pageSize, "userName": userName, "doctor": this.sharedService.userPrivileges.WaseelPrivileges.RCM.isDoctor,
            "coder": this.sharedService.userPrivileges.WaseelPrivileges.RCM.isCoder, "doctorName": doctorId, "coderName": coderId, "providerId": providerId
        });
    }

    selectDetailView(uploadId: number, body: UploadClaimsList) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    selectSingleClaim(uploadId: number, provClaimNo: string) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim/` + provClaimNo;
        return this.http.get<Claim>(environment.claimReviewService + requestUrl);
    }

    selectSingleClaimErrors(uploadId: number, provClaimNo: string) {
        const requestUrl = `/scrubbing/upload/` + uploadId + `/claim/` + provClaimNo + `/errors`;
        return this.http.get<FieldError[]>(environment.claimReviewService + requestUrl);
    }

    updateDiagnosisRemarks(body: DiagnosisRemarksUpdateRequest) {
        const requestUrl = `/scrubbing/upload/claim/diagnosis`;
        return this.http.post<Diagnosis>(environment.claimReviewService + requestUrl, body);
    }

    updateClaimDetailsRemarks(body: DiagnosisRemarksUpdateRequest) {
        console.log(body);

        const requestUrl = `/scrubbing/upload/claim/details/remarks`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    markClaimAsDone(body: MarkAsDone) {
        const requestUrl = `/scrubbing/upload/claim/mark-as-done`;
        return this.http.post<{ claimDetails: ClaimDetails, nextAvailableClaimRow: number }>(environment.claimReviewService + requestUrl, body);
    }

    markClaimAsDoneAll(body: MarkAsDone) {
        const requestUrl = `/scrubbing/upload/claim/mark-as-done/all`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    markClaimAsDoneSelected(body: MarkAsDone) {
        const requestUrl = `/scrubbing/upload/claim/mark-as-done/selected`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    deleteUpload(upload: Upload) {
        const requestUrl = `/scrubbing/delete/` + upload.id;
        return this.http.delete<any>(environment.claimReviewService + requestUrl);
    }

    getCoderList() {
        const requestUrl = '/users/coder/list';
        return this.http.get<SwitchUser[]>(environment.adminServiceHost + requestUrl);
    }

    getDoctorList() {
        const requestUrl = '/users/doctor/list';
        return this.http.get<SwitchUser[]>(environment.adminServiceHost + requestUrl);
    }

    getAvailableProviderIds() {
        const requestUrl = '/scrubbing/provider/ids';
        return this.http.get<string[]>(environment.claimReviewService + requestUrl);
    }

    getAvailableProviderList(list: string[]) {
        const requestUrl = '/providers/list/ids';
        return this.http.get<any[]>(environment.adminServiceHost + requestUrl + "/" + list + "");
    }

    updateAssignment(uploadId: number, userName: string, doctor: boolean, coder: boolean) {
        const requestUrl = '/scrubbing/update/assignment'
        return this.http.post(environment.claimReviewService + requestUrl, { "uploadId": uploadId, "userName": userName, "doctor": doctor, "coder": coder })
    }

    downloadExcel(uploadId: number) {
        const requestUrl = '/scrubbing/download/' + uploadId;
        const request = new HttpRequest('GET', environment.claimReviewService + requestUrl, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
        // return this.http.get(environment.claimReviewService + requestUrl);
    }

    pushFileToStorage(providerID: string, file: File) {
        if (this.uploading) { return; }
        this.uploading = true;
        this.uploadingObs.next(true);
        const formdata: FormData = new FormData();

        formdata.append('file', file, file.name);
        const req = new HttpRequest('POST', environment.claimReviewService + `/uploads/${providerID}/file`, formdata, {
            reportProgress: true,
        });

        this.http.request(req).subscribe(event => {
            // if (event.type === HttpEventType.UploadProgress) {
            //     this.progressChange.next({ percentage: Math.round(100 * event.loaded / event.total) });
            // } else 
            if (event instanceof HttpResponse) {
                this.uploading = false;
                this.uploadingObs.next(false);
                const summary: UploadSummary = JSON.parse(JSON.stringify(event.body));
                this.summaryChange.next(summary);
                this.progressChange.next({ percentage: 100 });
                
            }
        }, errorEvent => {
            this.uploading = false;
            this.uploadingObs.next(false);
            if (errorEvent instanceof HttpErrorResponse) {
                if (errorEvent.status >= 500) {
                    this.errorChange.next('Server could not handle your request at the moment. Please try again later..');
                } else if (errorEvent.status >= 400) {
                    this.errorChange.next(errorEvent.error['message']);
                } else { 
                    this.errorChange.next('Server could not be reached at the moment. Please try again later.'); 
                }
            }
        });
    }
}
