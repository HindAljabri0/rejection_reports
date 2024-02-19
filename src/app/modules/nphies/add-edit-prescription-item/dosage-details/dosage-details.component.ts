import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { ReplaySubject, Subject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { unescapeIdentifier } from '@angular/compiler';

@Component({
    selector: 'app-dosage-details',
    templateUrl: './dosage-details.component.html',
    styleUrls: [],
})
export class DosageDetailsComponent implements OnInit {

    @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
    itemList: any = [];
    // tslint:disable-next-line:max-line-length
    filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredPescribedMedicationItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    IsItemLoading = false;

    onDestroy = new Subject<void>();

    FormItem: FormGroup = this.formBuilder.group({
        note: [''],
        patientInstruction: [''],
        route: ['', Validators.required],
        dosageType: ['', Validators.required],
        doseType: [''],
        min: [''],
        max: [''],
        doseQuantity: [''],
        doseUnit: [''],
        rateType: [''],
        numerator: [''],
        denominator: [''],
        ratemin: [''],
        ratemax: [''],
        rateQuantity: [''],
        rateUnit: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        refill: [''],
        duration: ['', Validators.required],
        frequency: [''],
        frequencyUnit: [''],
        period: [''],
        periodUnit: [''],
        durationUnit: [''],
    });

    isSubmitted = false;
    showQuantityCode = true;
    typeListSearchResult = [];
    SearchRequest;
    typeList = this.sharedDataService.itemTypeList;
    absenceReasonList = this.sharedDataService.itemAbsenceReasonList;
    prescribedMedicationList: any;
    prescribedCode: { value: string; name: string; }[];
    today: Date;
    loadSearchItem = false;

    routes = this.sharedDataService.prescriberRoutes;

    filteredRoutes: string[] = [];
    selectedOption: string = '';
    selectedAbsenceOption: string = '';
    onOptionChange: string = '';

    constructor(
        private sharedDataService: SharedDataService,
        private dialogRef: MatDialogRef<DosageDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data,
        private formBuilder: FormBuilder) {
        this.today = new Date();
    }

    ngOnInit() {
        console.log(this.data, "on init data")
        if (this.data.item) {

            this.FormItem.patchValue({
                note: this.data.item.note,
                patientInstruction: this.data.item.patientInstruction,
                route: this.routes.filter(fn => fn.value === this.data.item.route)[0],
                dosageType: this.data.item.dosageCategory,
                doseType: this.data.item.doseType,
                min: this.data.item.doseQuantityOrRangeMin,
                max: this.data.item.doseRangeMax,
                doseQuantity: this.data.item.doseQuantityOrRangeMin,
                doseUnit: this.data.item.doseUnit,
                rateType: this.data.item.rateType,
                numerator: this.data.item.rateRatioNumeratorMin,
                denominator: this.data.item.rateRatioDenominatorMax,
                ratemin: this.data.item.rateRatioNumeratorMin,
                ratemax: this.data.item.rateRatioDenominatorMax,
                rateQuantity: this.data.item.rateRatioNumeratorMin,
                rateUnit: this.data.item.rateUnit,
                startDate: this.data.item.startDate,
                endDate: this.data.item.endDate,
                refill: this.data.item.refill,
                duration: this.data.item.duration,
                frequency: this.data.item.frequency,
                frequencyUnit: this.data.item.frequencyUnit,
                period: this.data.item.period,
                periodUnit: this.data.item.periodUnit,
                durationUnit: this.data.item.durationUnit,
            });
        }

    }




    selectItem(type) {
        if (type) {
            this.FormItem.patchValue({
                type: this.typeList.filter(x => x.value === type.itemType)[0],
                nonStandardCode: type.nonStandardCode,
                display: type.nonStandardDescription,
                unitPrice: type.unitPrice,
                discount: type.discount,
            });
        }
    }
    validateDosageDetails() {
        if (this.FormItem.controls.dosageType.value === 'DoseType' && (this.FormItem.controls.doseType.value === '' || this.FormItem.controls.doseType.value === null)) {
            this.FormItem.controls.doseType.setValidators([Validators.required]);
            this.FormItem.controls.doseType.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.doseType.clearValidators();
            this.FormItem.controls.doseType.updateValueAndValidity();
        }
        
        if (this.FormItem.controls.dosageType.value === 'DoseType' && (this.FormItem.controls.doseUnit.value === '' || this.FormItem.controls.doseUnit.value === null)) {
            this.FormItem.controls.doseUnit.setValidators([Validators.required]);
            this.FormItem.controls.doseUnit.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.doseUnit.clearValidators();
            this.FormItem.controls.doseUnit.updateValueAndValidity();
        }
        
        if (this.FormItem.controls.doseType.value === 'Dose_Quantity' && this.FormItem.controls.doseQuantity !== undefined &&(this.FormItem.controls.doseQuantity.value === null || this.FormItem.controls.doseQuantity.value <= 0)) {
            this.FormItem.controls.doseQuantity.setValidators([Validators.required]);
            this.FormItem.controls.doseQuantity.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.doseQuantity.clearValidators();
            this.FormItem.controls.doseQuantity.updateValueAndValidity();
        }
        
        if (this.FormItem.controls.doseType.value === 'Dose_Quantity_Range' && this.FormItem.controls.min !== undefined &&this.FormItem.controls.max !== undefined && (this.FormItem.controls.min.value === null || this.FormItem.controls.min.value <= 0 || this.FormItem.controls.max.value === null || this.FormItem.controls.max.value <= 0)) {
            this.FormItem.controls.min.setValidators([Validators.required]);
            this.FormItem.controls.min.updateValueAndValidity();

            this.FormItem.controls.max.setValidators([Validators.required]);
            this.FormItem.controls.max.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.min.clearValidators();
            this.FormItem.controls.min.updateValueAndValidity();

            this.FormItem.controls.max.clearValidators();
            this.FormItem.controls.max.updateValueAndValidity();
        }
        return true;
    }
    validateRateDetails() {
        if (this.FormItem.controls.dosageType.value === 'RateType' && (this.FormItem.controls.rateType.value === '' || this.FormItem.controls.rateType.value === null)) {
            this.FormItem.controls.rateType.setValidators([Validators.required]);
            this.FormItem.controls.rateType.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.rateType.clearValidators();
            this.FormItem.controls.rateType.updateValueAndValidity();
        }
        //console.log("validation 1 passed");
        
        if (this.FormItem.controls.dosageType.value === 'RateType' && (this.FormItem.controls.rateUnit.value === '' || this.FormItem.controls.rateUnit.value === null)) {
            this.FormItem.controls.rateUnit.setValidators([Validators.required]);
            this.FormItem.controls.rateUnit.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.rateUnit.clearValidators();
            this.FormItem.controls.rateUnit.updateValueAndValidity();
        }
        //console.log("validation 2 passed");
        if (this.FormItem.controls.rateType.value === 'Rate_Quantity' && this.FormItem.controls.rateQuantity !== undefined && (this.FormItem.controls.rateQuantity.value === null || this.FormItem.controls.rateQuantity.value <= 0)) {
            this.FormItem.controls.rateQuantity.setValidators([Validators.required]);
            this.FormItem.controls.rateQuantity.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.rateQuantity.clearValidators();
            this.FormItem.controls.rateQuantity.updateValueAndValidity();
        }
        //console.log("validation 3 passed");
        if (this.FormItem.controls.rateType.value === 'Rate_Range' && this.FormItem.controls.ratemin !== undefined && this.FormItem.controls.ratemax !== undefined && (this.FormItem.controls.ratemin.value === null || this.FormItem.controls.ratemin.value <= 0 || this.FormItem.controls.ratemax.value === null || this.FormItem.controls.ratemax.value <= 0)) {
            this.FormItem.controls.ratemin.setValidators([Validators.required]);
            this.FormItem.controls.ratemin.updateValueAndValidity();

            this.FormItem.controls.ratemax.setValidators([Validators.required]);
            this.FormItem.controls.ratemax.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.ratemin.clearValidators();
            this.FormItem.controls.ratemin.updateValueAndValidity();

            this.FormItem.controls.ratemax.clearValidators();
            this.FormItem.controls.ratemax.updateValueAndValidity();
        }
        //console.log("validation 4 passed");
        if (this.FormItem.controls.rateType.value === 'Rate_Ratio' && this.FormItem.controls.numerator !== undefined && this.FormItem.controls.denominator !== undefined && (this.FormItem.controls.numerator.value === null || this.FormItem.controls.numerator.value <= 0 || this.FormItem.controls.denominator.value === null || this.FormItem.controls.denominator.value <= 0)) {
            this.FormItem.controls.numerator.setValidators([Validators.required]);
            this.FormItem.controls.numerator.updateValueAndValidity();

            this.FormItem.controls.denominator.setValidators([Validators.required]);
            this.FormItem.controls.denominator.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.numerator.clearValidators();
            this.FormItem.controls.numerator.updateValueAndValidity();

            this.FormItem.controls.denominator.clearValidators();
            this.FormItem.controls.denominator.updateValueAndValidity();
        }
        console.log("All validation passed");
        return true;
    }
    onSubmit() {
        this.isSubmitted = true;
        if (!this.FormItem.valid) {
            return;
        }
        if (this.FormItem) {
            if (!this.validateDosageDetails()) {
                return;
            }
            if (!this.validateRateDetails()) {
                return;
            }
            const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;
            if (this.FormItem.controls.refill.value && !pattern.test(parseFloat(this.FormItem.controls.refill.value).toString())) {
                return;
            }

            const model: any = {};
            model.sequence = this.data.Sequence;
            model.note = this.FormItem.controls.note.value;
            model.patientInstruction = this.FormItem.controls.patientInstruction.value;
            model.route = this.FormItem.controls.route.value.value;
            model.dosageCategory = this.FormItem.controls.dosageType.value;
            model.doseType = this.FormItem.controls.doseType.value;
            model.doseQuantityOrRangeMin = this.FormItem.controls.min.value || this.FormItem.controls.doseQuantity.value;
            model.doseRangeMax = this.FormItem.controls.max.value;
            model.doseUnit = this.FormItem.controls.doseUnit.value;
            console.log("rate type ",this.FormItem.controls.rateType.value);
            model.rateType = this.FormItem.controls.rateType !== undefined  ? this.FormItem.controls.rateType.value : "";
            model.rateRatioNumeratorMin = this.FormItem.controls.numerator.value || this.FormItem.controls.ratemin.value || this.FormItem.controls.rateQuantity.value;
            model.rateRatioDenominatorMax = this.FormItem.controls.denominator.value || this.FormItem.controls.ratemax.value;
            model.rateUnit = this.FormItem.controls.rateUnit ? this.FormItem.controls.rateUnit.value : "";
            model.startDate = this.FormItem.controls.startDate.value;
            // model.startDateStr = this.datePipe.transform(this.FormItem.controls.startDate.value, 'dd-MM-yyyy hh:mm aa');

            model.endDate = this.FormItem.controls.endDate.value;
            // model.endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'dd-MM-yyyy hh:mm aa');
            model.refill = this.FormItem.controls.refill.value;
            model.duration = this.FormItem.controls.duration.value;
            model.frequency = this.FormItem.controls.frequency.value;
            model.frequencyUnit = this.FormItem.controls.frequencyUnit.value;
            model.period = this.FormItem.controls.period.value;
            model.durationUnit = this.FormItem.controls.durationUnit.value;
            model.periodUnit = this.FormItem.controls.periodUnit.value;

            //model.claimItemDosageModel = [];

            this.dialogRef.close(model);
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

}
