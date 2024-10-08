import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { Store } from '@ngrx/store';
import { updateDiagnosisList, removeDiagonsisError } from '../store/claim.actions';
import { FieldError, getDiagnosisErrors, getClaim, ClaimPageMode, getPageMode } from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';

@Component({
  selector: 'claim-diagnosis',
  templateUrl: './claim-diagnosis.component.html',
  styles: []
})
export class ClaimDiagnosisComponent implements OnInit {

  isRetrievedClaim = false;

  diagnosisController: FormControl = new FormControl();
  diagnosisList: ICDDiagnosis[] = [];
  icedOptions: ICDDiagnosis[] = [];
  errors: FieldError[] = [];

  pageMode: ClaimPageMode;

  constructor(private adminService: AdminService, private store: Store) { }

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      this.pageMode = mode;
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim);
        this.toggleEdit(false, true);
      }
    });
    this.store.select(getDiagnosisErrors).subscribe(errors => this.errors = errors || []);
  }

  setData(claim: Claim) {
    if (claim.caseInformation.caseDescription.diagnosis != null) {
      this.diagnosisList = claim.caseInformation.caseDescription.diagnosis.map(dia =>
        new ICDDiagnosis(dia.diagnosisId, dia.diagnosisCode, dia.diagnosisDescription)
      );
    }
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    if (allowEdit) {
      this.diagnosisController.enable();
    } else {
      this.diagnosisController.disable();
    }
    if (enableForNulls && (this.diagnosisList == null || this.diagnosisList.length < 1)) {
      this.diagnosisController.enable();
    }
  }

  searchICDCodes() {
    this.icedOptions = [];
    if (this.diagnosisController.value != '') {
      this.adminService.searchICDCode(this.diagnosisController.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object) {
              Object.keys(event.body).forEach(key => {
                if (this.diagnosisList.findIndex(diagnosis => diagnosis.diagnosisCode == event.body[key]['icddiagnosisCode']) == -1) {
                  this.icedOptions.push(new ICDDiagnosis(null,
                    event.body[key]['icddiagnosisCode'],
                    event.body[key]['description']
                  ));
                }
              });
            }
          }
        }
      );
    }
  }

  addICDDiagnosis(diag: ICDDiagnosis) {

    this.diagnosisList.push(diag);
    this.store.dispatch(updateDiagnosisList({
      list: this.diagnosisList.map(diag =>
        ({ diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription })
      )
    }));
    this.icedOptions = [];


  }

  removeDiagnosis(diag: ICDDiagnosis) {
    const index = this.diagnosisList.findIndex(diagnosis => diag.diagnosisCode == diagnosis.diagnosisCode);
    if (index != -1) {
      this.diagnosisList.splice(index, 1);
      this.store.dispatch(updateDiagnosisList({
        list: this.diagnosisList.map(diag =>
          ({ diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription })
        )
      }));
    }
  }

  diagnosisHasError(diagnosisId) {
    const temp = this.errors.findIndex(error => error.code == `${diagnosisId}`) != -1;
    return temp;
  }

  getDiagnosisError(diagnosisId) {
    return this.errors.filter(error => error.code == `${diagnosisId}`).map(error => error.error).reduce((e1, e2) => `${e1}\n${e2}`);
  }

  diagnosisHasErrorForAllList() {
    const temp = this.errors.findIndex(error => error.fieldName == 'DIAGNOSIS_LIST') != -1;
    return temp;
  }

  getDiagnosisErrorForAllList() {

    const index = this.errors.findIndex(error => error.fieldName == 'DIAGNOSIS_LIST');
    if (index > -1) {
      return this.errors[index].error || '';
    }
    return '';

  }
}
