import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { Period } from 'src/app/claim-module-components/models/period.type';
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
  isDoctor: boolean;
  isCoder: boolean;

  uploadId: string = '0';
  provClaimNo: string = '0';
  doctorRemarks

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private sharedServices: SharedServices,
    private authService: AuthService) {
  }
  
  ngOnInit() {
    this.initVariables();
    console.log('dialog data: ', this.data);
  }

  initVariables() {
    this.claim$ = this.store.select(getSingleClaim);
    this.selectedIllnesses$ = this.store.select(getSelectedIllnessCodes);
    this.selectedIllnesses$.subscribe(selectedIllnesses => {
      this.selectedIllnesses = selectedIllnesses
    });
    this.services$ = this.store.select(getSingleClaimServices);
    this.errors$ = this.store.select(getClaimErrors);
    this.claim$.subscribe(claim => {
      this.doctorRemarks = claim.doctorRemarks
    });
    this.isCoder = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder
    this.isDoctor = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor
    this.uploadId = this.data.uploadId
    this.provClaimNo = this.data.provClaimNo
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
        coder: this.isCoder,
        doctor: this.isDoctor,
        provClaimNo: this.provClaimNo, uploadId: +this.uploadId,
        userName: this.authService.getUserName()
      }
    }));
  }

  nextClaim() {
    this.dialogRef.close('next');
  }

  prevClaim() {
    this.dialogRef.close('prev');

  }

  firstClaim() {
    this.dialogRef.close('first');

  }

  lastClaim() {
    this.dialogRef.close('last');
  }

  getTooltipForDoctor(diagnosis: Diagnosis) {
    return diagnosis.doctorRemarks;
  }

  getTooltipForCoder(diagnosis: Diagnosis) {
    return diagnosis.coderRemarks;
  }

  getPeriod(duration: string): Period {
    if(duration)
    {
      if (duration.startsWith('P')) {
        if (duration.indexOf('Y', 1) != -1) {
            const value = Number.parseInt(duration.replace('P', '').replace('Y', ''), 10);
            if (Number.isInteger(value)) {
                return new Period(value, 'years');
            }
        } else if (duration.indexOf('M', 1) != -1) {
            const value = Number.parseInt(duration.replace('P', '').replace('M', ''), 10);
            if (Number.isInteger(value)) {
                return new Period(value, 'months');
            }
        } else if (duration.indexOf('D', 1) != -1) {
            const value = Number.parseInt(duration.replace('P', '').replace('D', ''), 10);
            if (Number.isInteger(value)) {
                return new Period(value, 'days');
            }
        }
      }
    }
    return new Period(null,null);
}
}
