import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { Investigation } from 'src/app/claim-module-components/models/investigation.model';
import { Observation } from 'src/app/claim-module-components/models/observation.model';
import { Period } from 'src/app/claim-module-components/models/period.type';
import { Service } from 'src/app/claim-module-components/models/service.model';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ClaimViewObservation } from '../../models/ClaimViewObservation.model';
import { ClaimViewInvestigation } from '../../models/Investigation.model';
import { markAsDone, setClaimDetailsRemarks, setDiagnnosisRemarks } from '../../store/claimReview.actions';
import { FieldError, getClaimErrors, getSelectedIllnessCodes, getSingleClaim, getSingleClaimServices } from '../../store/claimReview.reducer';


@Component({
  selector: 'app-doctor-uploads-claim-details-dialog',
  templateUrl: './doctor-uploads-claim-details-dialog.component.html',
  styles: []
})
export class DoctorUploadsClaimDetailsDialogComponent implements OnInit {

  expandedInvestigation = -1;
  expandedObservation = -1;
  labsPaginationControl: { page: number, size: number } = { page: 0, size: 10 };

  investigations: ClaimViewInvestigation[] 

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
    private authService: AuthService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.initVariables();
    this.claim$.subscribe(claim => {
      let investigations: Investigation[] = claim.caseInformation.caseDescription.investigation;
      if(investigations){
        this.investigations = ClaimViewInvestigation.map(investigations)//this.map(investigations)
      }
    })
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
    this.dialogRef.close('mark-as-done');
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
    if (duration) {
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
    return new Period(null, null);
  }

  toggleResult(index) {
    if (this.expandedInvestigation == index) {
      this.expandedInvestigation = -1;
    } else {
      this.expandedInvestigation = index;
    }
  }

  toggleObservationExpansion(event, investigationIndex, observationIndex) {
    event.stopPropagation();
    if (this.investigations[investigationIndex].observations[observationIndex].isOpen) {
      this.expandedObservation = -1;
      this.investigations[investigationIndex].observations[observationIndex].isOpen = false;
    } else {
      this.investigations[investigationIndex].observations.forEach(element => {
        element.isOpen = false;
      });
      this.investigations[investigationIndex].observations[observationIndex].isOpen = true;
      this.expandedObservation = observationIndex;
    }
  }




  // setData(claim: Claim) {
  //   // this.resultsControls = [];
  //   if (claim.caseInformation.caseDescription.investigation != null) {
  //     claim.caseInformation.caseDescription.investigation.forEach(
  //       investigation => {
  //         const controls = this.createEmptyResultControls();
  //         if (investigation.investigationDate != null) {
  //           controls.testDate.setValue(this.datePipe.transform(investigation.investigationDate, 'yyyy-MM-dd'));
  //         } else {
  //           controls.testDate.setValue('');
  //         }
  //         controls.results = investigation;
  //         controls.testCode.setValue(investigation.investigationCode);
  //         controls.testSerial.setValue(investigation.investigationType);
  //         controls.resultDescription.setValue(investigation.investigationDescription);

  //         investigation.observation.forEach(observation => {
  //           const componentControls = this.createEmptyComponentControls();
  //           componentControls.components = observation;
  //           componentControls.componentCode.setValue(observation.observationCode);

  //           componentControls.componentDescription.setValue(observation.observationDescription);

  //           componentControls.componentLabResult.setValue(observation.observationValue);

  //           componentControls.componentResultUnit.setValue(observation.observationUnit);

  //           componentControls.componentResultComment.setValue(observation.observationComment);

  //           controls.componentsControls.push(componentControls);
  //         });
  //         this.resultsControls.push(controls);
  //       }
  //     );
  //     if (this.resultsControls.length > 0 && this.expandedResult == -1) {
  //       this.toggleResult(0);
  //     }
  //   }
  // }


  createEmptyResultControls() {
    return {
      results: new Investigation(),
      testDate: new FormControl(),
      testCode: new FormControl(),
      testSerial: new FormControl(),
      resultDescription: new FormControl(),
      componentsControls: []
    };
  }


  createEmptyComponentControls() {
    return {
      components: new Observation(),
      componentCode: new FormControl(),
      componentSerial: new FormControl(),
      componentDescription: new FormControl(),
      componentLabResult: new FormControl(),
      componentResultUnit: new FormControl(),
      componentResultComment: new FormControl(),
      isOpen: false
    };
  }

  get totalLabsPages() {
    return Math.ceil(this.investigations.length / this.labsPaginationControl.size);
  }

  showFirstLabsPage() {
    this.labsPaginationControl.page = 0;
  }

  showNextLabsPage() {
    if ((this.labsPaginationControl.page + 1) < this.totalLabsPages) {
      this.labsPaginationControl.page++;
    }
  }

  showPreviousLabsPage() {
    if (this.labsPaginationControl.page > 0) {
      this.labsPaginationControl.page--;
    }
  }

  get currentLabsPage() {
    return this.labsPaginationControl.page;
  }

  get currentLabsSize() {
    return this.labsPaginationControl.size;
  }

  showLastLabsPage() {
    this.labsPaginationControl.page = this.totalLabsPages;
  }
}
