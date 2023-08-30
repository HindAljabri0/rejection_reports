import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { HttpResponse } from '@angular/common/http';
import { AlertPromise } from 'selenium-webdriver';
import { DatePipe } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';

@Component({
  selector: 'app-prescription-add-edit-supporting-info-modal',
  templateUrl: './prescription-add-edit-supporting-info-modal.component.html',
  styles: []
})
export class PrescriptionAddEditSupportingInfoModalComponent implements OnInit {

  icedOptions: ICDDiagnosis[] = [];
  diagnosisList: any = [];
  errors: FieldError[] = [];

  FormSupportingInfo: FormGroup = this.formBuilder.group({
    description: [''],
    category: ['', Validators.required],
    value: [''],
    code: [''],
    attachment: [''],
    attachmentName: [''],
    attachmentType: [''],
    attachmentDate: [''],
    timingDate: [''],
    timingPeriodFrom: [''],
    timingPeriodTo: [''],
    reason: [''],
  });

  categoryList = this.sharedDataService.categoryList;
  reasonList = this.sharedDataService.reasonList;

  codeList = [];

  isSubmitted = false;
  fileUploadFlag = false;
  currentFileUpload: File;
  currentFileUploadName: string;
  sizeInMB: string;
  uploadContainerClass = '';
  error = '';
  fileByteArray: any;

  constructor(
    private sharedDataService: SharedDataService, private providerNphiesSearchService: ProviderNphiesSearchService,
    private dialogRef: MatDialogRef<PrescriptionAddEditSupportingInfoModalComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe, private sharedServices: SharedServices,
    private formBuilder: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {

    if (this.data.item && this.data.item.category) {
      this.FormSupportingInfo.patchValue({
        category: this.categoryList.filter(x => x.value === this.data.item.category)[0]
      });

      this.getCodes();
      this.FormSupportingInfo.patchValue({
        // tslint:disable-next-line:max-line-length
        description: (this.data.item.category === 'onset' || this.data.item.category === 'chief-complaint') ? this.data.item.codeName : undefined,
        value: this.data.item.value,
        // tslint:disable-next-line:max-line-length
        code: (this.data.item.category === 'onset' || this.data.item.category === 'chief-complaint' || this.data.item.category === 'lab-test') ? this.data.item.code : this.codeList.filter(x => x.value === this.data.item.code)[0],
        attachment: this.data.item.attachment,
        timingDate: (!this.data.item.toDate) ? this.data.item.fromDate : undefined,
        timingPeriodFrom: (this.data.item.toDate) ? this.data.item.fromDate : undefined,
        timingPeriodTo: this.data.item.toDate,
        reason: this.reasonList.filter(x => x.value === this.data.item.reason)[0]
      });

      if (this.FormSupportingInfo.controls.attachment && this.FormSupportingInfo.controls.attachment.value) {
        this.fileUploadFlag = true;
        this.currentFileUploadName = this.FormSupportingInfo.controls.attachment.value;
      }
    }
  }

  selectFile(event) {
    this.fileUploadFlag = true;
    this.currentFileUpload = event.target.files[0];
    this.currentFileUploadName = this.currentFileUpload.name;
    this.FormSupportingInfo.controls.attachment.setValue(this.currentFileUploadName);
    this.FormSupportingInfo.controls.attachmentName.setValue(this.currentFileUpload.name);
    this.FormSupportingInfo.controls.attachmentType.setValue(this.currentFileUpload.type);
    this.FormSupportingInfo.controls.attachmentDate.setValue(new Date());

    this.sizeInMB = this.sharedServices.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.fileByteArray = data.substring(data.indexOf(',') + 1);
    };
  }


  checkfile() {
    const validExts = ['.pdf','.jpg','.jpeg'];
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.showError('Invalid file selected, valid files are of ' +
        validExts.toString() + ' types.');
      return false;
    } else {
      this.uploadContainerClass = '';
      this.error = '';
      return true;
    }
  }

  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.sharedServices.loadingChanged.next(false);
  }


  deleteFile() {
    this.currentFileUpload = null;
    this.currentFileUploadName = null;
    this.error = '';
    this.FormSupportingInfo.controls.attachment.reset();
    this.fileUploadFlag = false;
  }

  getCodes() {
    this.isSubmitted = false;
    this.removeValidations();
    this.resetValues();
    this.FormSupportingInfo.controls.category.setValidators([Validators.required]);
    this.FormSupportingInfo.controls.category.updateValueAndValidity();

    switch (this.FormSupportingInfo.controls.category.value.value) {

      case 'info':

        this.FormSupportingInfo.controls.value.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.value.updateValueAndValidity();

        break;
      case 'onset':

        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.timingDate.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingDate.updateValueAndValidity();

        // codes  same as diagnosis

        break;
      case 'attachment':

        this.FormSupportingInfo.controls.attachment.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.attachment.updateValueAndValidity();

        break;
      case 'missingtooth':

        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.timingDate.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingDate.updateValueAndValidity();

        this.FormSupportingInfo.controls.reason.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.reason.updateValueAndValidity();

        this.FormSupportingInfo.controls.code.setValue('');

        this.codeList = [
          { value: 11, name: 'UPPER RIGHT; PERMANENT TEETH # 1' },
          { value: 12, name: 'UPPER RIGHT; PERMANENT TEETH # 2' },
          { value: 13, name: 'UPPER RIGHT; PERMANENT TEETH # 3' },
          { value: 14, name: 'UPPER RIGHT; PERMANENT TEETH # 4' },
          { value: 15, name: 'UPPER RIGHT; PERMANENT TEETH # 5' },
          { value: 16, name: 'UPPER RIGHT; PERMANENT TEETH # 6' },
          { value: 17, name: 'UPPER RIGHT; PERMANENT TEETH # 7' },
          { value: 18, name: 'UPPER RIGHT; PERMANENT TEETH # 8' },
          { value: 21, name: 'UPPER LEFT; PERMANENT TEETH # 1' },
          { value: 22, name: 'UPPER LEFT; PERMANENT TEETH # 2' },
          { value: 23, name: 'UPPER LEFT; PERMANENT TEETH # 3' },
          { value: 24, name: 'UPPER LEFT; PERMANENT TEETH # 4' },
          { value: 25, name: 'UPPER LEFT; PERMANENT TEETH # 5' },
          { value: 26, name: 'UPPER LEFT; PERMANENT TEETH # 6' },
          { value: 27, name: 'UPPER LEFT; PERMANENT TEETH # 7' },
          { value: 28, name: 'UPPER LEFT; PERMANENT TEETH # 8' },
          { value: 31, name: 'LOWER LEFT; PERMANENT TEETH # 1' },
          { value: 32, name: 'LOWER LEFT; PERMANENT TEETH # 2' },
          { value: 33, name: 'LOWER LEFT; PERMANENT TEETH # 3' },
          { value: 34, name: 'LOWER LEFT; PERMANENT TEETH # 4' },
          { value: 35, name: 'LOWER LEFT; PERMANENT TEETH # 5' },
          { value: 36, name: 'LOWER LEFT; PERMANENT TEETH # 6' },
          { value: 37, name: 'LOWER LEFT; PERMANENT TEETH # 7' },
          { value: 38, name: 'LOWER LEFT; PERMANENT TEETH # 8' },
          { value: 41, name: 'LOWER RIGHT; PERMANENT TEETH # 1' },
          { value: 42, name: 'LOWER RIGHT; PERMANENT TEETH # 2' },
          { value: 43, name: 'LOWER RIGHT; PERMANENT TEETH # 3' },
          { value: 44, name: 'LOWER RIGHT; PERMANENT TEETH # 4' },
          { value: 45, name: 'LOWER RIGHT; PERMANENT TEETH # 5' },
          { value: 46, name: 'LOWER RIGHT; PERMANENT TEETH # 6' },
          { value: 47, name: 'LOWER RIGHT; PERMANENT TEETH # 7' },
          { value: 48, name: 'LOWER RIGHT; PERMANENT TEETH # 8' },
          { value: 51, name: 'UPPER RIGHT; DECIDUOUS TEETH # 1' },
          { value: 52, name: 'UPPER RIGHT; DECIDUOUS TEETH # 2' },
          { value: 53, name: 'UPPER RIGHT; DECIDUOUS TEETH # 3' },
          { value: 54, name: 'UPPER RIGHT; DECIDUOUS TEETH # 4' },
          { value: 55, name: 'UPPER RIGHT; DECIDUOUS TEETH # 5' },
          { value: 61, name: 'UPPER LEFT; DECIDUOUS TEETH # 1' },
          { value: 62, name: 'UPPER LEFT; DECIDUOUS TEETH # 2' },
          { value: 63, name: 'UPPER LEFT; DECIDUOUS TEETH # 3' },
          { value: 64, name: 'UPPER LEFT; DECIDUOUS TEETH # 4' },
          { value: 65, name: 'UPPER LEFT; DECIDUOUS TEETH # 5' },
          { value: 71, name: 'LOWER LEFT; DECIDUOUS TEETH # 1' },
          { value: 72, name: 'LOWER LEFT; DECIDUOUS TEETH # 2' },
          { value: 73, name: 'LOWER LEFT; DECIDUOUS TEETH # 3' },
          { value: 74, name: 'LOWER LEFT; DECIDUOUS TEETH # 4' },
          { value: 75, name: 'LOWER LEFT; DECIDUOUS TEETH # 5' },
          { value: 81, name: 'LOWER RIGHT; DECIDUOUS TEETH # 1' },
          { value: 82, name: 'LOWER RIGHT; DECIDUOUS TEETH # 2' },
          { value: 83, name: 'LOWER RIGHT; DECIDUOUS TEETH # 3' },
          { value: 84, name: 'LOWER RIGHT; DECIDUOUS TEETH # 4' },
          { value: 85, name: 'LOWER RIGHT; DECIDUOUS TEETH # 5' },
        ];

        break;
      case 'hospitalized':

        this.FormSupportingInfo.controls.timingPeriodFrom.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingPeriodFrom.updateValueAndValidity();

        this.FormSupportingInfo.controls.timingPeriodTo.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingPeriodTo.updateValueAndValidity();

        break;
      case 'employmentImpacted':

        this.FormSupportingInfo.controls.timingPeriodFrom.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingPeriodFrom.updateValueAndValidity();

        this.FormSupportingInfo.controls.timingPeriodTo.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.timingPeriodTo.updateValueAndValidity();

        break;
      case 'lab-test':

        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.value.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.value.updateValueAndValidity();

        this.FormSupportingInfo.controls.code.setValue('');

        //code on hold
        break;
      case 'reason-for-visit':

        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.code.setValue('');

        this.codeList = [
          { name: 'New Visit', value: 'new-visit' },
          { name: 'Follow Up', value: 'follow-up' },
          { name: 'Refill', value: 'refill' },
          { name: 'Walk in', value: 'walk-in' },
          { name: 'Referral', value: 'referral' }
        ];

        break;
      case 'days-supply':
      case 'vital-sign-weight':
      case 'vital-sign-systolic':
      case 'vital-sign-diastolic':
      case 'icu-hours':
      case 'ventilation-hours':
      case 'vital-sign-height':
      case 'temperature':
      case 'pulse':
      case 'respiratory-rate':
      case 'oxygen-saturation':
      case 'birth-weight':
        this.FormSupportingInfo.controls.value.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.value.updateValueAndValidity();

        break;
      case 'chief-complaint':

        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.value.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.value.updateValueAndValidity();

        // codes  same as diagnosis
        break;

      default:
        break;
    }
  }

  chiefComplainBlurValidation() {
    if (this.FormSupportingInfo.controls.category.value && this.FormSupportingInfo.controls.category.value.value === 'chief-complaint') {
      if (this.FormSupportingInfo.controls.code.value || this.FormSupportingInfo.controls.value.value) {
        this.FormSupportingInfo.controls.code.clearValidators();
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.value.clearValidators();
        this.FormSupportingInfo.controls.value.updateValueAndValidity();
      } else {
        this.FormSupportingInfo.controls.code.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.code.updateValueAndValidity();

        this.FormSupportingInfo.controls.value.setValidators([Validators.required]);
        this.FormSupportingInfo.controls.value.updateValueAndValidity();
      }
    }
  }

  removeValidations() {

    this.FormSupportingInfo.controls.value.clearValidators();
    this.FormSupportingInfo.controls.value.updateValueAndValidity();

    this.FormSupportingInfo.controls.code.clearValidators();
    this.FormSupportingInfo.controls.code.updateValueAndValidity();

    this.FormSupportingInfo.controls.attachment.clearValidators();
    this.FormSupportingInfo.controls.attachment.updateValueAndValidity();

    this.FormSupportingInfo.controls.timingDate.clearValidators();
    this.FormSupportingInfo.controls.timingDate.updateValueAndValidity();

    this.FormSupportingInfo.controls.timingPeriodFrom.clearValidators();
    this.FormSupportingInfo.controls.timingPeriodFrom.updateValueAndValidity();

    this.FormSupportingInfo.controls.timingPeriodTo.clearValidators();
    this.FormSupportingInfo.controls.timingPeriodTo.updateValueAndValidity();

    this.FormSupportingInfo.controls.reason.clearValidators();
    this.FormSupportingInfo.controls.reason.updateValueAndValidity();
  }

  resetValues() {
    this.FormSupportingInfo.controls.value.reset();
    this.FormSupportingInfo.controls.code.reset();
    this.FormSupportingInfo.controls.attachment.reset();
    this.FormSupportingInfo.controls.timingDate.reset();
    this.FormSupportingInfo.controls.timingPeriodFrom.reset();
    this.FormSupportingInfo.controls.timingPeriodTo.reset();
    this.FormSupportingInfo.controls.reason.setValue('');
  }

  searchICDCodes() {
    this.icedOptions = [];
    if (this.FormSupportingInfo.controls.code.value !== '') {
      this.providerNphiesSearchService.searchICDCode(this.FormSupportingInfo.controls.code.value).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object) {
              Object.keys(event.body).forEach(key => {
                if (this.diagnosisList.findIndex(diagnosis => diagnosis.diagnosisCode === event.body[key]['icddiagnosisCode']) === -1) {
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
    } else {
      this.chiefComplainBlurValidation();
    }
  }

  addICDDiagnosis(diag: ICDDiagnosis) {
    this.FormSupportingInfo.controls.code.setValue(diag.diagnosisCode + ' - ' + diag.diagnosisDescription);
    this.FormSupportingInfo.controls.description.setValue(diag.diagnosisDescription);
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

    if (this.error) {
      return;
    }

    if (this.FormSupportingInfo.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;

      model.category = this.FormSupportingInfo.controls.category.value.value;
      model.categoryName = this.FormSupportingInfo.controls.category.value.name;

      if (this.FormSupportingInfo.controls.value.value) {
        model.value = this.FormSupportingInfo.controls.value.value;
      } else {
        model.value = null;
      }

      if (this.FormSupportingInfo.controls.code.value && this.FormSupportingInfo.controls.code.value.value) {
        model.code = this.FormSupportingInfo.controls.code.value.value;
      } else if (this.FormSupportingInfo.controls.code.value && !this.FormSupportingInfo.controls.code.value.value) {
        model.code = this.FormSupportingInfo.controls.code.value.replace(' - ' + this.FormSupportingInfo.controls.description.value, '');
      } else {
        model.code = null;
      }

      if (this.FormSupportingInfo.controls.attachment.value) {
        model.attachment = this.FormSupportingInfo.controls.attachment.value;
        model.byteArray = this.fileByteArray;
        model.attachmentName = this.FormSupportingInfo.controls.attachmentName.value;
        model.attachmentType = this.FormSupportingInfo.controls.attachmentType.value;
        model.attachmentDate = this.datePipe.transform(this.FormSupportingInfo.controls.attachmentDate.value, 'yyyy-MM-dd');
        model.attachmentDateStr = this.datePipe.transform(this.FormSupportingInfo.controls.attachmentDate.value, 'dd-MM-yyyy');
      } else {
        model.attachment = null;
        model.byteArray = null;
      }

      if (this.FormSupportingInfo.controls.timingDate.value) {
        model.fromDate = this.datePipe.transform(this.FormSupportingInfo.controls.timingDate.value, 'yyyy-MM-dd');
        model.fromDateStr = this.datePipe.transform(this.FormSupportingInfo.controls.timingDate.value, 'dd-MM-yyyy');
      } else if (this.FormSupportingInfo.controls.timingPeriodFrom.value && this.FormSupportingInfo.controls.timingPeriodTo.value) {
        model.fromDate = this.datePipe.transform(this.FormSupportingInfo.controls.timingPeriodFrom.value, 'yyyy-MM-dd');
        model.fromDateStr = this.datePipe.transform(this.FormSupportingInfo.controls.timingPeriodFrom.value, 'dd-MM-yyyy');

        model.toDate = this.datePipe.transform(this.FormSupportingInfo.controls.timingPeriodTo.value, 'yyyy-MM-dd');
        model.toDateStr = this.datePipe.transform(this.FormSupportingInfo.controls.timingPeriodTo.value, 'dd-MM-yyyy');
      } else {
        model.fromDate = null;
        model.toDate = null;
      }

      if (this.FormSupportingInfo.controls.reason.value && this.FormSupportingInfo.controls.reason.value.value) {
        model.reason = this.FormSupportingInfo.controls.reason.value.value;
        model.reasonName = this.FormSupportingInfo.controls.reason.value.name;
      } else {
        model.reason = null;
      }

      if (this.FormSupportingInfo.controls.description.value) {
        model.codeName = this.FormSupportingInfo.controls.description.value;
      } else if (this.FormSupportingInfo.controls.code.value && this.FormSupportingInfo.controls.code.value.name) {
        model.codeName = this.FormSupportingInfo.controls.code.value.name;
      } else {
        model.codeName = null;
      }

      switch (model.category) {
        case 'vital-sign-weight':
        case 'birth-weight':
          model.unit = 'kg';
          break;
        case 'vital-sign-systolic':
        case 'vital-sign-diastolic':
          model.unit = 'mm[Hg]';
          break;
        case 'icu-hours':
        case 'ventilation-hours':
          model.unit = 'h';
          break;
        case 'vital-sign-height':
          model.unit = 'cm';
          break;
        case 'days-supply':
          model.unit = 'd';
          break;
        case 'temperature':
          model.unit = 'Cel';
          break;
        case 'pulse':
        case 'respiratory-rate':
          model.unit = 'Min';
          break;
        case 'oxygen-saturation':
          model.unit = '%';
          break;
      }


      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
