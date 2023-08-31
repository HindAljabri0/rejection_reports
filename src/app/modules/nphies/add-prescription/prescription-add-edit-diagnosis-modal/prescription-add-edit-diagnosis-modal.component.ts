import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { HttpResponse } from '@angular/common/http';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';

@Component({
    selector: 'app-prescription-add-edit-diagnosis-modal',
    templateUrl: './prescription-add-edit-diagnosis-modal.component.html',
    styles: []
})
export class PrescriptionAddEditDiagnosisModalComponent implements OnInit {

    providerId;

    icedOptions: ICDDiagnosis[] = [];
    descriptionList: any = [];
    errors: FieldError[] = [];

    FormDiagnosis: FormGroup = this.formBuilder.group({
        code: [''],
        description: ['', Validators.required],
        descriptionFilter: [''],
        type: ['', Validators.required],
        onAdmission: [''],
        onAdmissionName: ['']
    });

    isSubmitted = false;

    typeList = this.sharedDataService.diagnosisTypeList;

    selectedDiagnosis:ICDDiagnosis = null;
    // [
    //   { value: 'admitting', name: 'Admitting Diagnosis' },
    //   // { value: 'clinical', name: 'Clinical Diagnosis' },
    //   { value: 'differential', name: 'Differential Diagnosis' },
    //   { value: 'secondary', name: 'Secondary Diagnosis' },
    //   { value: 'discharge', name: 'Discharge Diagnosis' },
    //   // { value: 'laboratory', name: 'Laboratory Diagnosis' },
    //   // { value: 'nursing', name: 'Nursing Diagnosis' },
    //   // { value: 'prenatal', name: 'Prenatal Diagnosis' },
    //   { value: 'principal', name: 'Principal Diagnosis' },
    //   // { value: 'radiology', name: 'Radiology Diagnosis' },
    //   // { value: 'remote', name: 'Remote Diagnosis' },
    //   // { value: 'retrospective', name: 'Retrospective Diagnosis' },
    //   // { value: 'self', name: 'Self Diagnosis' },
    // ];

    onAdmissionList = this.sharedDataService.onAdmissionList;
    // [
    //   { value: 'y', name: 'Yes' },
    //   { value: 'n', name: 'No' },
    //   { value: 'u', name: 'Unknown' },
    // ];

    primaryValidationMsg = '';
    IsOnAdmissionRequired = false;
    pageMode = '';

    constructor(
        private sharedDataService: SharedDataService, private providerNphiesSearchService: ProviderNphiesSearchService,
        private dialogRef: MatDialogRef<PrescriptionAddEditDiagnosisModalComponent>, @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder, private adminService: AdminService) { }

    ngOnInit() {
        if (this.data && this.data.pageMode) {
            this.pageMode = this.data.pageMode;
        }
        if (this.data.item && this.data.item.diagnosisCode) {
            this.FormDiagnosis.patchValue({
                code: this.data.item.diagnosisCode,
                description: this.data.item.diagnosisCode + ' - ' + this.data.item.diagnosisDescription,
                type: this.typeList.filter(x => x.value === this.data.item.type)[0],
                onAdmission: this.onAdmissionList.filter(x => x.value === this.data.item.onAdmission)[0],
            });
        }

        if (this.pageMode !== 'EDIT') {
            if (this.data.type && this.data.type === 'institutional') {
                this.FormDiagnosis.controls.onAdmission.setValidators([Validators.required]);
                this.FormDiagnosis.controls.onAdmission.updateValueAndValidity();
                this.IsOnAdmissionRequired = true;
            } else {
                this.FormDiagnosis.controls.onAdmission.clearValidators();
                this.FormDiagnosis.controls.onAdmission.updateValueAndValidity();
                this.IsOnAdmissionRequired = false;
            }
        } else {
            this.IsOnAdmissionRequired = true;
        }

    }

    searchICDCodes() {
        this.icedOptions = [];

        if (this.FormDiagnosis.controls.description.value !== '') {

            this.providerNphiesSearchService.searchICDCode(this.FormDiagnosis.controls.description.value).subscribe(
                event => {
                    //console.log("Response = " + JSON.stringify(event));
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
        this.selectedDiagnosis = diag;
        this.FormDiagnosis.controls.code.setValue(diag.diagnosisCode);
        this.FormDiagnosis.controls.description.setValue(diag.diagnosisCode + ' - ' + diag.diagnosisDescription);
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
        // tslint:disable-next-line:max-line-length
        if(this.selectedDiagnosis == null){
            this.primaryValidationMsg = 'Please select a diagnosis from the list by clicking on it.';
            return;
        } else if (!this.data.item && this.FormDiagnosis.controls.type.value && this.FormDiagnosis.controls.type.value.value === 'principal' && this.data.itemTypes.find(x => x === this.FormDiagnosis.controls.type.value.value)) {
            this.primaryValidationMsg = 'There can be only one principal Type';
            return;
        } else {
            this.primaryValidationMsg = '';
        }
        if (this.FormDiagnosis.valid) {
            const model: any = {};
            model.sequence = this.data.Sequence;
            model.diagnosisCode = this.selectedDiagnosis.diagnosisCode;
            model.diagnosisDescription = this.selectedDiagnosis.diagnosisDescription;
            model.type = this.FormDiagnosis.controls.type.value ? this.FormDiagnosis.controls.type.value.value : '';
            if (this.IsOnAdmissionRequired) {
                model.onAdmission = this.FormDiagnosis.controls.onAdmission.value ? this.FormDiagnosis.controls.onAdmission.value.value : '';
            }

            model.typeName = this.FormDiagnosis.controls.type.value ? this.FormDiagnosis.controls.type.value.name : '';
            model.onAdmissionName = this.FormDiagnosis.controls.onAdmission.value ? this.FormDiagnosis.controls.onAdmission.value.name : '';
            this.dialogRef.close(model);
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }
}
