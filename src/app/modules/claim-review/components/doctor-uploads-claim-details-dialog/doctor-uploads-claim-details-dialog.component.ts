import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { Service } from 'src/app/claim-module-components/models/service.model';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { markAsDone, setClaimDetailsRemarks, setDiagnnosisRemarks } from '../../store/claimReview.actions';
import { FieldError, getClaimErrors, getSelectedIllnessCodes, getSingleClaim, getSingleClaimServices } from '../../store/claimReview.reducer';


@Component({
  selector: 'app-doctor-uploads-claim-details-dialog',
  templateUrl: './doctor-uploads-claim-details-dialog.component.html',
  styles: []
})
export class DoctorUploadsClaimDetailsDialogComponent implements OnInit {

  // data
  claim$: Observable<Claim>;
  services$: Observable<Service[]>;
  selectedIllnesses$: Observable<string[]>;
  selectedIllnesses: string[] = [];
  errors$: Observable<{ errors: FieldError[] }>;
  selectedTabIndex = 0
  isDoctor : boolean;
  isCoder : boolean;

  uploadId: string;
  provClaimNo
  doctorRemarks

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private sharedServices: SharedServices,
    private authService: AuthService) { 
      console.log(data);
    }



  ngOnInit() {
    this.claim$ = this.store.select(getSingleClaim);
    this.initVariables();
    this.services$ = this.store.select(getSingleClaimServices);
    this.selectedIllnesses$ = this.store.select(getSelectedIllnessCodes);
    this.selectedIllnesses$.subscribe(selectedIllnesses => {
      this.selectedIllnesses = selectedIllnesses
    });
    this.errors$ = this.store.select(getClaimErrors);
  }
  initVariables() {
    this.uploadId = this.data.uploadId
    console.log('this.uploadId', this.uploadId);
    this.provClaimNo = this.data.provClaimNo
    console.log('this.provClaimNo', this.provClaimNo);
    this.claim$.subscribe(claim => {
      this.doctorRemarks = claim.doctorRemarks
    });
    this.isCoder = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder
    this.isDoctor = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor
  }

  isSelected(illnessCode: string): boolean {
    const codeIndex = this.selectedIllnesses.findIndex(code => {
      return code.toUpperCase() === illnessCode.toUpperCase();
    });

    return codeIndex !== -1

  }

  closeDialog() {
    this.dialogRef.close();
  }


  diagRemarksfocusOut(diagnosis: Diagnosis, remarks: string, coder: boolean, doctor: boolean) {
    this.store.dispatch(setDiagnnosisRemarks({
      data: {
        remarks: remarks, coder: coder, doctor: doctor,
        diagnosisId: diagnosis.diagnosisId, provClaimNo: this.provClaimNo, uploadId: +this.uploadId
      }
    }));
  }

  claimDetailsRemarksfocusOut(remarks: string) {
    this.store.dispatch(setClaimDetailsRemarks({
      data: {
        remarks: remarks, coder: false, doctor: false,
        diagnosisId: null, provClaimNo: this.provClaimNo, uploadId: +this.uploadId
      }
    }));
    this.doctorRemarks = remarks;
  }

  markAsDone() {
    this.store.dispatch(markAsDone({
      data: {
        coder : this.isCoder,
        doctor : this.isDoctor,
        provClaimNo: this.provClaimNo, uploadId: +this.uploadId,
        userName: this.authService.getUserName()
      }
    }));
  }

  nextTab() {
    if (this.selectedTabIndex !== 7) {
      this.selectedTabIndex = this.selectedTabIndex + 1
    }

  }

  prevTab() {
    if (this.selectedTabIndex !== 0) {
      this.selectedTabIndex = this.selectedTabIndex - 1
    }
  }

  firstTab() {
    this.selectedTabIndex = 0
  }

  lastTab() {
    this.selectedTabIndex = 7
  }

  getTooltipForDoctor(diagnosis : Diagnosis){
    return diagnosis.doctorRemarks;
  }

  getTooltipForCoder(diagnosis : Diagnosis){
    return diagnosis.coderRemarks;
  }
}
