import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
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

    constructor(private http: HttpClient,private sharedService : SharedServices) { }

    fetchUnderReviewUploadsOfStatus(status: string, pageNumber: number, pageSize: number, userName: string,doctorId: string, coderId: string, providerId: string) {
        var requestURL = "";
        if(this.sharedService.userPrivileges.WaseelPrivileges.RCM.isAdmin)
        {
            requestURL = '/uploads';
        }else{
            requestURL = `/scrubbing/upload`;
        }
        return this.http.post(environment.claimReviewService + requestURL, {
            "status": status, "page": pageNumber, "pageSize": pageSize, "userName": userName, "doctor": this.sharedService.userPrivileges.WaseelPrivileges.RCM.isDoctor,
            "coder": this.sharedService.userPrivileges.WaseelPrivileges.RCM.isCoder, "doctorName": doctorId, "coderName": coderId, "providerId" : providerId
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
        return this.http.post<{claimDetails: ClaimDetails, nextAvailableClaimRow: number}>(environment.claimReviewService + requestUrl, body);
    }

    markClaimAsDoneAll(body: MarkAsDone) {
        const requestUrl = `/scrubbing/upload/claim/mark-as-done/all`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    markClaimAsDoneSelected(body: MarkAsDone) {
        const requestUrl = `/scrubbing/upload/claim/mark-as-done/selected`;
        return this.http.post(environment.claimReviewService + requestUrl, body);
    }

    deleteUpload(upload : Upload){
        const requestUrl = `/scrubbing/delete/` + upload.id;
        return this.http.delete<any>(environment.claimReviewService + requestUrl);
    }

    getCoderList(){
        const requestUrl = '/users/coder/list';
        return this.http.get<SwitchUser[]>(environment.adminServiceHost + requestUrl);
    }

    getDoctorList(){
        const requestUrl = '/users/doctor/list';
        return this.http.get<SwitchUser[]>(environment.adminServiceHost + requestUrl);
    }

    getAvailableProviderIds(){
        const requestUrl = '/scrubbing/provider/ids';
        return this.http.get<string[]>(environment.claimReviewService + requestUrl);
    }

    getAvailableProviderList(list : string[]){
        const requestUrl = '/providers/list/ids';
        return this.http.get<any[]>(environment.adminServiceHost + requestUrl + "/" + list + "");
    }

    updateAssignment( uploadId : number, userName : string, doctor: boolean, coder: boolean ){
        const requestUrl = '/scrubbing/update/assignment'
        return this.http.post(environment.claimReviewService + requestUrl, {"uploadId": uploadId,"userName": userName,"doctor": doctor, "coder": coder})
    }

    downloadExcel( uploadId : number){
        const requestUrl = '/scrubbing/download/' + uploadId;
        const request = new HttpRequest('GET', environment.claimReviewService + requestUrl, '', { responseType: 'text', reportProgress: true });
        return this.http.request(request);
        // return this.http.get(environment.claimReviewService + requestUrl);
    }
}
