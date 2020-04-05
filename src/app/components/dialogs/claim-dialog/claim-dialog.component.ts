import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { ClaimFields } from 'src/app/models/claimFields';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SearchService } from 'src/app/services/serchService/search.service';

@Component({
  selector: 'app-claim-dialog',
  templateUrl: './claim-dialog.component.html',
  styleUrls: ['./claim-dialog.component.css']
})
export class ClaimDialogComponent implements OnInit, AfterContentInit {

  constructor(public commen: CommenServicesService,
    public dialogRef: MatDialogRef<ClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {claim: ViewedClaim, edit: boolean},
    public claimUpdateService: ClaimService,
    public adminService: AdminService,
    private searchService:SearchService) {
  }

  ngOnInit() {
    if (this.data.claim.errors.length > 0) {
      this.setErrors();
    }
  }

  ngAfterContentInit(){
    if(this.data.edit){
      this.toggleEditMode()
    }
  }

  loading: boolean = false;
  loadingResponse: string;

  commentBoxText: string;
  commentBoxClasses: string;


  memberidClasses: string;
  genderClasses: string;
  approvalClasses: string;
  eligibilityClasses: string;

  isEditMode: boolean = false;
  editButtonLabel: string = "Edit";

  memberid = new FormControl(this.data.claim.memberid);
  gender = new FormControl(this.data.claim.gender);
  approvalnumber = new FormControl(this.data.claim.approvalnumber);
  eligibilitynumber = new FormControl(this.data.claim.eligibilitynumber);
  policynumber = new FormControl(this.data.claim.policynumber);
  chiefComplaintSymptoms = new FormControl(this.data.claim.chiefcomplaintsymptoms);
  nationalId = new FormControl(this.data.claim.nationalId);


  searchDiag = new FormControl("");

  options: ICDDiagnosis[] = [];

  diagnosisList: ICDDiagnosis[] = [];

  setErrors() {
    this.commentBoxClasses = 'error';
    this.commentBoxText = "";
    for (let error of this.data.claim.errors) {
      this.commentBoxText += `${error.description}\n`;
      if (error.fieldName == ClaimFields.APPNO) {
        this.approvalClasses = 'error';
      }
      if (error.fieldName == ClaimFields.MEMID) {
        this.memberidClasses = 'error';
      }
      if (error.fieldName == ClaimFields.GENDER) {
        this.genderClasses = 'error';
      }
      if (error.fieldName == ClaimFields.ELGNO) {
        this.eligibilityClasses = 'error';
      }
    }
  }

  resetErrors() {
    this.commentBoxClasses = null;
    this.commentBoxText = null;
    this.approvalClasses = null;
    this.memberidClasses = null;
  }

  isEditable() {
    switch (this.data.claim.status) {
      case ClaimStatus.Accepted:
      case ClaimStatus.INVALID:
      case ClaimStatus.NotAccepted:
        return true;
      default:
        return false;
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    this.editButtonLabel = this.isEditMode ? "Cancel" : "Edit";
    if (!this.isEditMode) {
      this.diagnosisList = [];
      this.removeAddedDiagFromClaimList();
    }
  }

  removeAddedDiagFromClaimList() {

    this.data.claim.diagnosis = this.data.claim.diagnosis.filter((x => x.diagnosisId != null));
  }

  deleteDiagnosis(diagnosis) {
    if (diagnosis.diagnosisId != null) {
      this.diagnosisList.push(diagnosis);
    } else {
      delete this.diagnosisList[this.diagnosisList.indexOf(diagnosis)];
      delete this.data.claim.diagnosis[this.data.claim.diagnosis.indexOf(diagnosis)];
    }
  }

  searchICDCodes() {
    this.options = [];
    if (this.searchDiag.value != "")
      this.adminService.searchICDCode(this.searchDiag.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object)
              Object.keys(event.body).forEach(key => {
                this.options.push(new ICDDiagnosis(null,
                  event.body[key]["icddiagnosisCode"],
                  event.body[key]["description"]
                )
                )
              });
          }
        }
      );
  }

  addICDDignosis(diag) {
    if (this.data.claim.diagnosis.length < 14 && !(this.elementIsInList(diag))) {
      this.diagnosisList.push(diag);
      this.data.claim.diagnosis.push(diag);
    } else {
      if (this.data.claim.diagnosis.length >= 14)
        alert("Only 14 Dignosis are Allowed");
      else {
        alert("Diagnosis Already in List");
      }
    }

  }

  elementIsInList(diag: any): boolean {
    let list = this.data.claim.diagnosis.filter((x => x.diagnosisCode == diag.diagnosisCode));
    return list.length > 0;
  }


  save() {
    let updateRequestBody: { [k: string]: any } = {};
    let flag = false;
    if (this.memberid.value != this.data.claim.memberid) {
      updateRequestBody.memberid = this.memberid.value;
      flag = true;
    }
    if (this.nationalId.value != this.data.claim.nationalId) {
      updateRequestBody.nationalId = this.nationalId.value;
      flag = true;
    }
    if (this.gender.value != this.data.claim.gender) {
      updateRequestBody.gender = this.gender.value;
      flag = true;
    }
    if (this.approvalnumber.value != this.data.claim.approvalnumber) {
      updateRequestBody.approvalnumber = this.approvalnumber.value;
      flag = true;
    }
    if (this.eligibilitynumber.value != this.data.claim.eligibilitynumber) {
      updateRequestBody.eligibilitynumber = this.eligibilitynumber.value;
      flag = true;
    }
    if (this.policynumber.value != this.data.claim.policynumber) {
      updateRequestBody.policynumber = this.policynumber.value;
      flag = true;
    }

    if (this.diagnosisList.length > 0) {
      updateRequestBody.diagnosis = this.diagnosisList;
      flag = true;
    }
    if (this.chiefComplaintSymptoms.value != this.data.claim.chiefcomplaintsymptoms) {
      updateRequestBody.chiefcomplaintsymptoms = this.chiefComplaintSymptoms.value;
      flag = true;
    }
    


    if (flag) {
      this.loading = true;
      this.claimUpdateService.updateClaim(this.data.claim.providerId, this.data.claim.payerid, this.data.claim.claimid, updateRequestBody).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status == 201) {
            this.loadingResponse = 'Your claim is now: ' + this.commen.statusToName(event.body['status']);
          }
        }
      }, eventError => {
        if (eventError instanceof HttpErrorResponse) {
          console.log(event);
        }
      });
    }
  }
  isAccepted() {
    return this.loadingResponse != null && this.loadingResponse.includes(this.commen.statusToName(ClaimStatus.Accepted));
  }
  onDoneSaving() {
    this.loading = false;
    if (this.isAccepted()) {
      this.dialogRef.close(true);
    } else {
      this.reloadeClaim();
    }
  }

  reloadeClaim() {
    this.searchService.getClaim(this.data.claim.providerId, `${this.data.claim.claimid}`).subscribe(event => {
      if (event instanceof HttpResponse) {
        const providerId = this.data.claim.providerId;
        const payerId = this.data.claim.payerid;
        const status = this.data.claim.status;
        this.data.claim = JSON.parse(JSON.stringify(event.body));
        this.data.claim.providerId = providerId;
        this.data.claim.payerid = payerId;
        this.data.claim.status = status;
        this.resetErrors();
        if (this.data.claim.errors.length > 0) {
          this.setErrors();
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogRef.close(true);
      }
    });
  }

  genderToText(g:string){
    if(g == 'M') return 'Male';
    if(g == 'F') return 'Female';
    else return '';
  }

  getPatientFullName(){
      return `${this.data.claim.firstname!=null? this.data.claim.firstname:""} ${this.data.claim.middlename!=null? this.data.claim.middlename:""}  ${this.data.claim.lastname!=null? this.data.claim.lastname:""}  `;
    //return `${this.data.claim.firstname} ${this.data.claim.middlename} ${this.data.claim.lastname}`;
  }

  getPatientName(){
    let name = this.getPatientFullName();
    if(name.length > 30)
      return name.substring(0, 27) + '...';
    else return name;
  }
}
