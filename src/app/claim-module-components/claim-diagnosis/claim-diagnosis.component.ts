import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { Store } from '@ngrx/store';
import { updateDiagnosisList } from '../store/claim.actions';
import { FieldError, getDiagnosisErrors, getIsRetrievedClaim, getClaim } from '../store/claim.reducer';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'claim-diagnosis',
  templateUrl: './claim-diagnosis.component.html',
  styleUrls: ['./claim-diagnosis.component.css']
})
export class ClaimDiagnosisComponent implements OnInit {

  isRetrievedClaim: boolean = false;

  diagnosisController: FormControl = new FormControl();
  diagnosisList: ICDDiagnosis[] = [];
  icedOptions: ICDDiagnosis[] = [];
  errors: FieldError[] = [];

  constructor(private adminService: AdminService, private store: Store) { }

  ngOnInit() {
    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim))
    ).subscribe((values) => {
      this.isRetrievedClaim = values[0];
      if (this.isRetrievedClaim) {
        if (values[1].caseInformation.caseDescription.diagnosis != null){
          this.diagnosisList = values[1].caseInformation.caseDescription.diagnosis.map(dia => new ICDDiagnosis(null, dia.diagnosisCode, dia.diagnosisDescription));
          this.diagnosisController.disable({onlySelf:true});
        }
      } else {

      }

    }).unsubscribe();
    this.store.select(getDiagnosisErrors).subscribe(errors => this.errors = errors);
  }

  searchICDCodes() {
    this.icedOptions = [];
    if (this.diagnosisController.value != "")
      this.adminService.searchICDCode(this.diagnosisController.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object)
              Object.keys(event.body).forEach(key => {
                if (this.diagnosisList.findIndex(diagnosis => diagnosis.diagnosisCode == event.body[key]["icddiagnosisCode"]) == -1)
                  this.icedOptions.push(new ICDDiagnosis(null,
                    event.body[key]["icddiagnosisCode"],
                    event.body[key]["description"]
                  ));
              });
          }
        }
      );
  }

  addICDDiagnosis(diag: ICDDiagnosis) {
    if (this.diagnosisList.length < 14) {
      this.diagnosisList.push(diag);
      this.store.dispatch(updateDiagnosisList({ list: this.diagnosisList.map(diag => ({ diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription })) }));
      this.icedOptions = [];
    }
  }

  removeDiagnosis(diag: ICDDiagnosis) {
    const index = this.diagnosisList.findIndex(diagnosis => diag.diagnosisCode == diagnosis.diagnosisCode);
    if (index != -1) {
      this.diagnosisList.splice(index, 1);
      this.store.dispatch(updateDiagnosisList({ list: this.diagnosisList.map(diag => ({ diagnosisCode: diag.diagnosisCode, diagnosisDescription: diag.diagnosisDescription })) }));
    }
  }

  fieldHasError(fieldName) {
    const temp = this.errors.findIndex(error => error.fieldName == fieldName) != -1;
    return temp;
  }
}
