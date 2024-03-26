import { Component, OnInit, Input } from '@angular/core';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { ICDDiagnosis } from 'src/app/models/ICDDiagnosis';
import { HttpResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { forEach } from 'jszip';
import { info } from 'console';

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
    ucumCodes = [];
    currentIndex = 0;

    // supportingInfoList = [];
    missingToothCodeList = this.sharedDataService.missingToothCodeList;
    reasonForVisitCodeList = this.sharedDataService.reasonForVisitCodeList;

    constructor(
        private sharedDataService: SharedDataService,
        private sharedServices: SharedServices,
        private providerNphiesSearchService: ProviderNphiesSearchService) { }

    ngOnInit() {
        this.currentIndex = 0;
        console.log(" check code ->" + this.supportingInfoList[5].code);
        let i = 0;
        if (this.supportingInfoList.length > 0) {
            this.supportingInfoList.forEach(info => {
                if (info.category === 'lab-test') {
                    this.searchLOINK(info.code, i, true);
                    info.isUnitsRequired = info.unit;
                }
                i++;
            });
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
    /*getLOINK(code) {
        this.unitList =[];
        if (code) {
            this.providerNphiesSearchService.searchLOINK(this.sharedServices.providerId, code).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        if (event.body instanceof Array) {
                            console.log("->" + JSON.stringify(event.body));
                            this.unitList.push({ shortName: event.body[0].shortName,unitsRequired : event.body[0].unitsRequired,exampleUcumUnits :  event.body[0].exampleUcumUnits });
                            //console.log("unit list short name " + JSON.stringify(this.unitList));
                            return this.unitList;
                        }
                    }
                }
            );
        }
    }*/
    searchLOINK(code, i, isEdit = false) {
        this.icedOptions = [];
        if (code) {
            this.providerNphiesSearchService.searchLOINK(this.sharedServices.providerId, code).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        if (event.body instanceof Array) {
                            this.loinkList = event.body;
                            if (isEdit && this.loinkList.length > 0) {
                                this.ucumCodes = [];
                                this.fillUcumCodes(i, this.loinkList[0].exampleUcumUnits,isEdit);
                            }

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
        this.supportingInfoList[i].isUnitsRequired = data.unitsRequired === 'Y';
        if (this.supportingInfoList[i].isUnitsRequired) {
            this.ucumCodes = [];
            this.fillUcumCodes(i, data.exampleUcumUnits);
        }
    }
    fillUcumCodes(i: number, exampleUcumUnits: [], isEditMode = false) {
        if (exampleUcumUnits) {
            exampleUcumUnits.forEach(code => {
                this.ucumCodes.push({ "code": code, "name": code });
            });
            if (isEditMode) {
                let unit = this.ucumCodes.filter(f => f.code === this.supportingInfoList[i].unit)[0];
                console.log("unit = " + unit);
                if (!unit) {
                    this.supportingInfoList[i].otherUnit = this.supportingInfoList[i].unit;
                    this.supportingInfoList[i].unit = "others-specify";
                }
            }
            //console.log(JSON.stringify(this.ucumCodes));
        }
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

        if (event.target.files[0].size > 9437184) {
            this.supportingInfoList[i].fileError = 'File must be less than or equal to 10 MB';
            this.supportingInfoList[i].uploadContainerClass = 'has-error';
            this.supportingInfoList[i].attachment = null;
            return;
        }

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
        const validExts = ['.pdf', '.jpg', '.jpeg'];
        let fileExt = this.supportingInfoList[i].attachmentName;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
            this.supportingInfoList[i].fileError = 'Invalid file selected, valid files are of ' + validExts.toString() + ' types.';
            this.supportingInfoList[i].uploadContainerClass = 'has-error';
            this.supportingInfoList[i].attachment = null;
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
        model.unit = '';
        model.otherUnit = '';
        model.isUnitsRequired = false;
        model.fileError = '';
        model.uploadContainerClass = '';

        if (category.value === 'info') {
            model.IsValueRequired = true;
            model.value = '';
        }

        if (category.value === 'onset') {
            model.IsCodeRequired = true;
            model.IsFromDateRequired = true;
            model.code = '';
            model.fromDate = '';
        }

        if (category.value === 'attachment') {
            model.IsAttachmentRequired = true;
            model.attachment = null;
        }

        if (category.value === 'missingtooth') {
            model.IsCodeRequired = true;
            model.IsFromDateRequired = true;
            model.IsReasonRequired = true;

            model.code = '';
            model.fromDate = '';
            model.reason = '';
        }

        if (category.value === 'hospitalized' || category.value === 'employmentImpacted') {
            model.IsFromDateRequired = true;
            model.IsToDateRequired = true;
            model.fromDate = '';
            model.toDate = '';
        }

        if (category.value === 'lab-test') {
            model.IsCodeRequired = true;
            model.IsValueRequired = true;
            model.code = '';
            model.value = '';
        }

        if (category.value === 'reason-for-visit') {
            model.IsCodeRequired = true;
            model.code = '';
        }

        if (category.value === 'days-supply' ||
            category.value === 'vital-sign-weight' ||
            category.value === 'vital-sign-systolic' ||
            category.value === 'vital-sign-diastolic' ||
            category.value === 'icu-hours' ||
            category.value === 'ventilation-hours' ||
            category.value === 'vital-sign-height' ||
            category.value === 'temperature' ||
            category.value === 'pulse' ||
            category.value === 'respiratory-rate' ||
            category.value === 'oxygen-saturation' ||
            category.value === 'birth-weight') {
            model.IsValueRequired = true;
            model.value = '';
        }

        if (category.value === 'chief-complaint') {
            model.IsCodeRequired = true;
            model.IsValueRequired = true;
            model.code = '';
            model.value = '';
        }

        if (category.value === 'last-menstrual-period') {
            model.IsFromDateRequired = true;
            model.fromDate = '';
        }

        if (category.value === 'lab-test' ||
            category.value === 'vital-sign-weight' ||
            category.value === 'vital-sign-systolic' ||
            category.value === 'vital-sign-diastolic' ||
            category.value === 'icu-hours' ||
            category.value === 'ventilation-hours' ||
            category.value === 'vital-sign-height' ||
            category.value === 'temperature' ||
            category.value === 'pulse' ||
            category.value === 'oxygen-saturation' ||
            category.value === 'respiratory-rate') {
            model.fromDate = '';
            model.toDate = '';
        }

        // switch (category.value) {

        //   case 'info':

        //     model.IsValueRequired = true;
        //     model.value = '';

        //     break;
        //   case 'onset':

        //     model.IsCodeRequired = true;
        //     model.IsFromDateRequired = true;
        //     model.code = '';
        //     model.fromDate = '';

        //     break;
        //   case 'attachment':

        //     model.IsAttachmentRequired = true;
        //     model.attachment = null;

        //     break;
        //   case 'missingtooth':

        //     model.IsCodeRequired = true;
        //     model.IsFromDateRequired = true;
        //     model.IsReasonRequired = true;

        //     model.code = '';
        //     model.fromDate = '';
        //     model.reason = '';

        //     break;
        //   case 'hospitalized':
        //   case 'employmentImpacted':

        //     model.IsFromDateRequired = true;
        //     model.IsToDateRequired = true;
        //     model.fromDate = '';
        //     model.toDate = '';

        //     break;

        //   case 'lab-test':

        //     model.IsCodeRequired = true;
        //     model.IsValueRequired = true;
        //     model.code = '';
        //     model.value = '';

        //     break;
        //   case 'reason-for-visit':

        //     model.IsCodeRequired = true;
        //     model.code = '';

        //     break;
        //   case 'days-supply':
        //   case 'vital-sign-weight':
        //   case 'vital-sign-systolic':
        //   case 'vital-sign-diastolic':
        //   case 'icu-hours':
        //   case 'ventilation-hours':
        //   case 'vital-sign-height':
        //   case 'temperature':
        //   case 'pulse':
        //   case 'respiratory-rate':
        //   case 'oxygen-saturation':
        //   case 'birth-weight':

        //     model.IsValueRequired = true;
        //     model.value = '';

        //     break;
        //   case 'chief-complaint':

        //     model.IsCodeRequired = true;
        //     model.IsValueRequired = true;
        //     model.code = '';
        //     model.value = '';
        //     break;

        //   case 'last-menstrual-period':
        //     model.IsFromDateRequired = true;
        //     model.fromDate = '';

        //     break;

        //   default:
        //     break;
        // }

        this.supportingInfoList.push(model);
    }

    removeSupportingInfo(i) {
        this.supportingInfoList.splice(i, 1);
    }

    SetCurrent(i) {

        this.currentIndex = i;
    }

    selectTooth(number) {
        this.supportingInfoList[this.currentIndex].code = number;
        //this.controllers[this.expandedInvoice].services[this.expandedService].toothNumber.setValue(number);
    }

}
