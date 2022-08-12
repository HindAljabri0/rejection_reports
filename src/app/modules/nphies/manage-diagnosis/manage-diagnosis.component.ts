import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-diagnosis',
  templateUrl: './manage-diagnosis.component.html',
  styleUrls: ['./manage-diagnosis.component.css']
})
export class ManageDiagnosisComponent implements OnInit, OnChanges {

  @Input() isSubmitted = false;
  @Input() diagnosisList = [];
  @Input() IsDiagnosisRequired = false;
  @Input() claimType;
  @Input() pageMode = null;

  icedOptions: ICDDiagnosis[] = [];
  descriptionList: any = [];
  errors: FieldError[] = [];

  typeList = this.sharedDataService.diagnosisTypeList;
  onAdmissionList = this.sharedDataService.onAdmissionList;

  IsOnAdmissionRequired = false;

  constructor(
    private sharedDataService: SharedDataService,
    private sharedServices: SharedServices,
    private providerNphiesSearchService: ProviderNphiesSearchService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if ((changes && changes.claimType && changes.claimType.previousValue !== changes.claimType.currentValue) || (
        changes && changes.pageMode && changes.pageMode.previousValue !== changes.pageMode.currentValue
      )) {
        this.setOnAdmissionRequirement();
      }
    }
  }

  ngOnInit() {
    this.setOnAdmissionRequirement();
    if (this.pageMode === 'CREATE') {
      this.addDiagnosis();
    }
  }

  setOnAdmissionRequirement() {
    if (this.pageMode !== 'EDIT') {
      if (this.claimType && this.claimType === 'institutional') {
        this.IsOnAdmissionRequired = true;
        this.diagnosisList.map(x => {
          x.IsOnAdmissionRequired = true;
          if (!x.onAdmission) {
            x.onAdmission = '';
          }
        });

      } else {
        this.diagnosisList.map(x => {
          x.IsOnAdmissionRequired = false;
          if (!x.onAdmission) {
            x.onAdmission = '';
          }
        });
        this.IsOnAdmissionRequired = false;
      }
    } else {
      this.diagnosisList.map(x => x.IsOnAdmissionRequired = false);
      this.IsOnAdmissionRequired = true;
    }
  }

  searchICDCodes(code, i) {
    this.icedOptions = [];
    if (code) {
      this.providerNphiesSearchService.searchICDCode(code).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object) {
              Object.keys(event.body).forEach(key => {
                if (this.descriptionList.findIndex(diagnosis => diagnosis.diagnosisCode === event.body[key]['icddiagnosisCode']) === -1) {
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

  addICDDiagnosis(diag: ICDDiagnosis, i: number) {
    this.diagnosisList[i].diagnosisCode = diag.diagnosisCode;
    this.diagnosisList[i].diagnosisDescription = diag.diagnosisCode + ' - ' + diag.diagnosisDescription;
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

  changeDiagnosisType($event, i) {

    if ($event.value === 'principal' && this.diagnosisList.filter(x => x.type === $event.value).length > 1) {

      this.diagnosisList[i].typeError = 'There should be only one principal Type';
    }

    if ($event.value !== 'principal' && this.diagnosisList.filter(x => x.type === 'principal').length === 1) {

      this.diagnosisList.map(x => x.typeError = '');
    }
  }

  addDiagnosis() {
    const model: any = {};
    model.sequence = this.diagnosisList.length === 0 ? 1 : (this.diagnosisList[this.diagnosisList.length - 1].sequence + 1);
    model.diagnosisCode = '';
    model.diagnosisDescription = '';
    model.type = '';
    if (this.IsOnAdmissionRequired) {
      model.onAdmission = '';
      model.IsOnAdmissionRequired = true;
    }
    this.diagnosisList.push(model);
  }

  removeDiagnosis(i) {
    this.diagnosisList.splice(i, 1);
  }

}
