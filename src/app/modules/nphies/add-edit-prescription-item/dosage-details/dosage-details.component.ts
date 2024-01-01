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
    route: [''],
    dosageType: [''],
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
    startDate: [''],
    endDate: [''],
    refill: [''],
    duration: [''],
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
    private dialogRef: MatDialogRef<DosageDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
    private sharedServices: SharedServices, private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.today = new Date();
  }

  ngOnInit() {
    console.log(this.data,"klssks")
    if (this.data.item) {
     
      this.FormItem.patchValue({
        note: this.data.item.note,
        patientInstruction: this.data.item.patientInstruction,
        route: this.data.item.route,
        dosageType: this.data.item.dosageType,
        doseType: this.data.item.doseType,
        min: this.data.item.min,
        max: this.data.item.max,
        doseQuantity: this.data.item.doseQuantity,
        doseUnit: this.data.item.doseUnit,
        rateType: this.data.item.rateType,
        numerator: this.data.item.numerator,
        denominator: this.data.item.denominator,
        ratemin: this.data.item.ratemin,
        ratemax: this.data.item.ratemax,
        rateQuantity: this.data.item.rateQuantity,
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

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.FormItem,"this.FormItem")
    if (this.FormItem) {

      const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

    //   if (!pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString())) {
    //     return;
    //   }

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
      model.rateType = this.FormItem.controls.rateType.value.value;
      model.rateRatioNumeratorMin = this.FormItem.controls.numerator.value || this.FormItem.controls.ratemin.value ||this.FormItem.controls.rateQuantity.value;
      model.rateRatioDenominatorMax = this.FormItem.controls.denominator.value ||  this.FormItem.controls.ratemax.value;
      model.rateUnit = this.FormItem.controls.rateUnit.value;
      model.startDate = this.FormItem.controls.startDate.value; 
     // model.startDateStr = this.datePipe.transform(this.FormItem.controls.startDate.value, 'dd-MM-yyyy hh:mm aa');

      model.endDate = this.FormItem.controls.endDate.value; 
     // model.endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'dd-MM-yyyy hh:mm aa');
      model.refill = this.FormItem.controls.refill.value;
      model.duration = this.FormItem.controls.duration.value;
      model.frequency = this.FormItem.controls.frequency.value;
      model.period = this.FormItem.controls.period.value;
      model.durationUnit = this.FormItem.controls.durationUnit.value;
      model.periodUnit = this.FormItem.controls.periodUnit.value;

      model.claimItemDosageModel = [];
console.log(model,"model")
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
