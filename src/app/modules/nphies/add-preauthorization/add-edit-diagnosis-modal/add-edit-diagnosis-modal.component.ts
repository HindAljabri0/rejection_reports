import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { X } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-edit-diagnosis-modal',
  templateUrl: './add-edit-diagnosis-modal.component.html',
  styleUrls: ['./add-edit-diagnosis-modal.component.css']
})
export class AddEditDiagnosisModalComponent implements OnInit {

  providerId;

  icedOptions: ICDDiagnosis[] = [];
  descriptionList: any = [];
  errors: FieldError[] = [];

  FormDiagnosis: FormGroup = this.formBuilder.group({
    code: [''],
    description: ['', Validators.required],
    descriptionFilter: [''],
    type: ['', Validators.required],
    onAdmission: ['', Validators.required],
    onAdmissionName: ['']
  });

  isSubmitted = false;

  typeList = [
    { value: 'admitting', name: 'Admitting Diagnosis' },
    { value: 'clinical', name: 'Clinical Diagnosis' },
    { value: 'differential', name: 'Differential Diagnosis' },
    { value: 'discharge', name: 'Discharge Diagnosis' },
    { value: 'laboratory', name: 'Laboratory Diagnosis' },
    { value: 'nursing', name: 'Nursing Diagnosis' },
    { value: 'prenatal', name: 'Prenatal Diagnosis' },
    { value: 'principal', name: 'Principal Diagnosis' },
    { value: 'radiology', name: 'Radiology Diagnosis' },
    { value: 'remote', name: 'Remote Diagnosis' },
    { value: 'retrospective', name: 'Retrospective Diagnosis' },
    { value: 'self', name: 'Self Diagnosis' },
  ];

  onAdmissionList = [
    { value: 'y', name: 'Yes' },
    { value: 'n', name: 'No' },
    { value: 'u', name: 'Unknown' },
  ]

  constructor(
    private dialogRef: MatDialogRef<AddEditDiagnosisModalComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private sharedServices: SharedServices, private formBuilder: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    if (this.data.item && this.data.item.diagnosisCode) {
      this.FormDiagnosis.patchValue({
        code: this.data.item.diagnosisCode,
        description: this.data.item.diagnosisDescription,
        type: this.typeList.filter(x => x.value === this.data.item.type)[0],
        onAdmission: this.onAdmissionList.filter(x => x.value === this.data.item.onAdmission)[0],
      });
    }
  }

  searchICDCodes() {
    this.icedOptions = [];
    if (this.FormDiagnosis.controls.description.value !== '') {
      this.adminService.searchICDCode(this.FormDiagnosis.controls.description.value).subscribe(
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

  addICDDiagnosis(diag: ICDDiagnosis) {
    this.FormDiagnosis.controls.code.setValue(diag.diagnosisCode);
    this.FormDiagnosis.controls.description.setValue(diag.diagnosisDescription);
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



  onSubmit() {
    this.isSubmitted = true;
    if (this.FormDiagnosis.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.diagnosisCode = this.FormDiagnosis.controls.code.value;
      model.diagnosisDescription = this.FormDiagnosis.controls.description.value;
      model.type = this.FormDiagnosis.controls.type.value.value;
      model.onAdmission = this.FormDiagnosis.controls.onAdmission.value.value;

      model.typeName = this.FormDiagnosis.controls.type.value.name;
      model.onAdmissionName = this.FormDiagnosis.controls.onAdmission.value.name;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
