import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AttachmentRequest } from 'src/app/claim-module-components/models/attachmentRequest.model';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { Investigation } from 'src/app/claim-module-components/models/investigation.model';
import { Observation } from 'src/app/claim-module-components/models/observation.model';
import { Period } from 'src/app/claim-module-components/models/period.type';
import { Service } from 'src/app/claim-module-components/models/service.model';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
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
  diagnosis: Diagnosis[] = [];
  globalDoctorRemarks: string = '';

  selectedIllnesses$: Observable<string[]>;
  selectedIllnesses: string[] = [];
  errors$: Observable<{ errors: FieldError[] }>;
  selectedTabIndex = 0
  isDoctor: boolean;
  isCoder: boolean;

  uploadId: string = '0';
  provClaimNo: string = '0';

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private sharedServices: SharedServices,
    private authService: AuthService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.initVariables();
    this.initLabResults();
  }


  initLabResults() {
    this.claim$.subscribe(claim => {
      let investigations: Investigation[] = claim.caseInformation.caseDescription.investigation;
      if (investigations) {
        this.investigations = ClaimViewInvestigation.map(investigations);
        if (this.investigations && this.investigations.length > 0) {
          this.investigations[0].isOpen = true;
          this.expandedInvestigation = 0
        }
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
      this.diagnosis = claim.caseInformation.caseDescription.diagnosis
      this.globalDoctorRemarks = claim.doctorRemarks
    });
    this.isCoder = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.scrubbing.isCoder
    this.isDoctor = this.sharedServices.userPrivileges.WaseelPrivileges.RCM.scrubbing.isDoctor
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

    let isDataChanged = false
    isDataChanged = doctor ? diagnosis.doctorRemarks !== remarks : diagnosis.coderRemarks !== remarks
    if (isDataChanged) {
      this.store.dispatch(setDiagnnosisRemarks({
        data: {
          remarks: remarks, coder: coder, doctor: doctor,
          diagnosisId: diagnosis.diagnosisId, provClaimNo: this.provClaimNo, uploadId: +this.uploadId
        }
      }));
    }
  }

  claimDetailsRemarksfocusOut(remarks: string) {
  
    if (remarks && this.globalDoctorRemarks !== remarks) {
      this.store.dispatch(setClaimDetailsRemarks({
        data: {
          remarks: remarks, coder: false, doctor: false,
          diagnosisId: null, provClaimNo: this.provClaimNo, uploadId: +this.uploadId
        }
      }));
    }
  }

  markAsDone() {
    this.store.dispatch(markAsDone({
      data: {
        coder: this.isCoder,
        doctor: this.isDoctor,
        provClaimNo: this.provClaimNo, uploadId: +this.uploadId,
        userName: this.authService.getAuthUsername()
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

  viewAttachment(attachment: AttachmentRequest) {
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: { filename: attachment.fileName, attachment: attachment.attachmentFile },
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }


  getFileBlob(attachment: AttachmentRequest) {
    if (this.isPdf(attachment)) {
      const objectURL = `data:application/pdf;base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      const fileExt = attachment.fileName.split('.').pop();
      const objectURL = `data:image/${fileExt};base64,` + attachment.attachmentFile;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  isPdf(attachment: AttachmentRequest) {
    const fileExt = attachment.fileName.split('.').pop();
    return fileExt.toLowerCase() == 'pdf';
  }
}
