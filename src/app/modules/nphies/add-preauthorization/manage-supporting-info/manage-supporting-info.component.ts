import { Component, OnInit, Input } from '@angular/core';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-manage-supporting-info',
  templateUrl: './manage-supporting-info.component.html',
  styleUrls: ['./manage-supporting-info.component.css']
})
export class ManageSupportingInfoComponent implements OnInit {

  @Input() isSubmitted = false;
  @Input() supportingInfoList = [];

  icedOptions: ICDDiagnosis[] = [];
  diagnosisList: any = [];
  errors: FieldError[] = [];

  categoryList = this.sharedDataService.categoryList;
  reasonList = this.sharedDataService.reasonList;
  loinkList = [];

  // supportingInfoList = [];
  missingToothCodeList = this.sharedDataService.missingToothCodeList;
  reasonForVisitCodeList = this.sharedDataService.reasonForVisitCodeList;

  constructor(
    private sharedDataService: SharedDataService,
    private sharedServices: SharedServices,
    private providerNphiesSearchService: ProviderNphiesSearchService) { }

  ngOnInit() {
  }

  searchICDCodes(code, i) {
    this.icedOptions = [];
    if (code) {
      this.providerNphiesSearchService.searchICDCode(code).subscribe(
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
      this.chiefComplainBlurValidation(i);
    }
  }

  searchLOINK(code, i) {
    this.icedOptions = [];
    if (code) {
      this.providerNphiesSearchService.searchLOINK(this.sharedServices.providerId, code).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Array) {
              this.loinkList = event.body;
            }
          }
        }
      );
    } else {
      this.removeLoink(i);
    }
  }

  removeLoink(i) {
    this.supportingInfoList[i].description = '';
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

  addLoink(data: any, i: number) {
    this.supportingInfoList[i].code = data.loincNum;
    this.supportingInfoList[i].description = data.loincNum + ' - ' + data.shortName;
  }

  addICDDiagnosis(diag: ICDDiagnosis, i: number) {
    this.supportingInfoList[i].code = diag.diagnosisCode;
    this.supportingInfoList[i].description = diag.diagnosisCode + ' - ' + diag.diagnosisDescription;
  }

  selectFile(event, i) {
    let sizeInMB = '';
    this.supportingInfoList[i].attachmentName = event.target.files[0].name;
    this.supportingInfoList[i].attachmentType = event.target.files[0].type;
    this.supportingInfoList[i].attachmentDate = new Date();

    sizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);
    if (!this.checkfile(i)) {
      this.supportingInfoList[i].attachment = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.supportingInfoList[i].attachment = data.substring(data.indexOf(',') + 1);
    };
  }


  checkfile(i) {
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    let fileExt = this.supportingInfoList[i].attachmentName;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.supportingInfoList[i].fileError = 'Invalid file selected, valid files are of ' + validExts.toString() + ' types.';
      this.supportingInfoList[i].uploadContainerClass = 'has-error';
      this.supportingInfoList[i].attachment = null;
      this.sharedServices.loadingChanged.next(false);
      return false;
    } else {
      this.supportingInfoList[i].uploadContainerClass = '';
      this.supportingInfoList[i].fileError = '';
      return true;
    }
  }

  deleteFile(i) {
    this.supportingInfoList[i].currentFileUpload = null;
    this.supportingInfoList[i].attachmentName = null;
    this.supportingInfoList[i].fileError = '';
    this.supportingInfoList[i].attachment = null;
  }

  chiefComplainBlurValidation(i) {
    if (this.supportingInfoList[i].category && this.supportingInfoList[i].category === 'chief-complaint') {
      if (this.supportingInfoList[i].code || this.supportingInfoList[i].value) {

        this.supportingInfoList[i].IsValueRequired = false;
        this.supportingInfoList[i].IsCodeRequired = false;

      } else {
        this.supportingInfoList[i].description = '';
        this.supportingInfoList[i].IsValueRequired = true;
        this.supportingInfoList[i].IsCodeRequired = true;
      }
    }
  }

  addSupportingInfo(category) {

    const model: any = {};
    model.sequence = this.supportingInfoList.length === 0 ? 1 : (this.supportingInfoList[this.supportingInfoList.length - 1].sequence + 1);
    model.category = category.value;
    model.categoryName = category.name;
    model.code = '';
    model.fromDate = '';
    model.toDate = '';
    model.value = '';
    model.reason = '';
    model.attachment = '';
    model.attachmentName = '';
    model.attachmentType = '';
    model.attachmentDate = '';
    model.fileError = '';
    model.uploadContainerClass = '';


    switch (category.value) {

      case 'info':

        model.IsValueRequired = true;
        model.value = '';

        break;
      case 'onset':

        model.IsCodeRequired = true;
        model.IsFromDateRequired = true;
        model.code = '';
        model.fromDate = '';

        break;
      case 'attachment':

        model.IsAttachmentRequired = true;
        model.attachment = null;

        break;
      case 'missingtooth':

        model.IsCodeRequired = true;
        model.IsFromDateRequired = true;
        model.IsReasonRequired = true;

        model.code = '';
        model.fromDate = '';
        model.reason = '';

        break;
      case 'hospitalized':
      case 'employmentImpacted':

        model.IsFromDateRequired = true;
        model.IsToDateRequired = true;
        model.fromDate = '';
        model.toDate = '';

        break;

      case 'lab-test':

        model.IsCodeRequired = true;
        model.IsValueRequired = true;
        model.code = '';
        model.value = '';

        break;
      case 'reason-for-visit':

        model.IsCodeRequired = true;
        model.code = '';

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

        model.IsValueRequired = true;
        model.value = '';

        break;
      case 'chief-complaint':

        model.IsCodeRequired = true;
        model.IsValueRequired = true;
        model.code = '';
        model.value = '';
        break;

      default:
        break;
    }

    this.supportingInfoList.push(model);
  }

  removeSupportingInfo(i) {
    this.supportingInfoList.splice(i, 1);
  }


}
