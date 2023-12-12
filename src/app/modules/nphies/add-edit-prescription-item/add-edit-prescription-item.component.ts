import { Component, EventEmitter, Output, OnInit, Inject,ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ReplaySubject, Subject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { X } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-add-edit-prescription-item',
  templateUrl: './add-edit-prescription-item.component.html',
  styleUrls: ['./add-edit-prescription-item.component.css'],
})
export class AddEditPrescriptionItemComponent implements OnInit {
    @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
    itemList: any = [];
    // tslint:disable-next-line:max-line-length
    filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredPescribedMedicationItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredSupportingInfo: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredCareTeam: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    IsItemLoading = false;

    onDestroy = new Subject<void>();

    @ViewChild(CdkVirtualScrollViewport, { static: true })
    cdkVirtualScrollViewPort: CdkVirtualScrollViewport;


    FormItem: FormGroup = this.formBuilder.group({
        type: ['', Validators.required],
        item: ['', Validators.required],
        itemFilter: [''],
        prescribedMedicationItemFilter: [''],
        itemCode: ['', Validators.required],
        itemDescription: ['', Validators.required],
        nonStandardCode: [''],
        display: [''],
        absenceScientificCode:[],
        strength:[],
        authoredOn:[],
        isPackage: [false],
        isDentalBodySite: [true],
        bodySite: [''],
        subSite: [''],
        quantity: ['', Validators.required],
        quantityCode: [''],    
        supportingInfoSequence: [''],
        supportingInfoFilter: [''],
        careTeamSequence: [''],
        careTeamFilter: [''],
        diagnosisSequence: [''],
        diagnosisFilter: [''],
        invoiceNo: [''],

        // IsTaxApplied: [false],
        searchQuery: [''],
        drugSelectionReason: [''],
        prescribedDrugCode: ['']
    });
    FormDetails: FormGroup = this.formBuilder.group({
        type: ['', Validators.required],
        item: ['', Validators.required],
        itemFilter: [''],
        prescribedMedicationItemFilter: [''],
        itemCode: ['', Validators.required],
        itemDescription: ['', Validators.required],
        nonStandardCode: [''],
        display: [''],
        absenceScientificCode:[],
        strength:[],
        quantity: ['', Validators.required],
        quantityCode: [''],    
        });

    FormDosage: FormGroup = this.formBuilder.group({
        note: [''],
        patientInstruction: [''],
        route: [''],
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
        period: [''],
            
        });
    granularUnit = null;
    isSubmitted = false;
    typeListSearchResult = [];
    SearchRequest;
    typeList = this.sharedDataService.itemTypeList;
    absenceReasonList = this.sharedDataService.itemAbsenceReasonList;
    prescribedMedicationList: any;
    bodySiteList = [];
    subSiteList = [];
    IscareTeamSequenceRequired = false;
    IsSupportingInfoSequenceRequired = false;
    supportingInfoError = '';
    prescribedCode: { value: string; name: string; }[];
    showQuantityCode = true;
    serviceDataError = '';

    today: Date;
    loadSearchItem = false;
   
 routes = this.sharedDataService.prescriberRoutes;
   
  filteredRoutes: string[] = [];
  isAddItemVisible: boolean = false;
  isAddItemDetailsVisible: boolean = false;
  isAddDosageTimingVisible: boolean = false;
  selectedOption: string = '';
  selectedDoseType: string = 'Dose_Quantity'; 
  selectedRateType: string = 'Rate Quantity';
  selectedAbsenceOption: string = ''; 
  onOptionChange: string = '';
  @Output() dataEvent = new EventEmitter<string>();
    filteredList: unknown;

  constructor(
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<AddEditPrescriptionItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,  private sharedServices: SharedServices, private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService
  ) {
    this.today = new Date();
    this.today.setSeconds(0, 0);
  }
  ngOnInit(): void {
    this.prescribedCode = [{ value: 'scientific-codes', name: 'Scientific Code' },
    { value: 'medication-codes', name: 'GTIN Code' }];
  
    this.showPopupBasedOnType();
    if (this.data.type) {
        this.bodySiteList = this.sharedDataService.getBodySite(this.data.type);
        this.subSiteList = this.sharedDataService.getSubSite(this.data.type);          
        }
      if (this.data.item) {
            this.FormItem.patchValue({
                type: this.typeList.filter(x => x.value === this.data.item.type)[0],
                itemDescription: this.itemList.filter(x => x.code === this.data.item.itemDescription)[0],
                itemCode: this.itemList.filter(x => x.code === this.data.item.itemCode)[0],
                nonStandardCode: this.data.item.nonStandardCode,
                display: this.data.item.display,
                isPackage: this.data.item.isPackage,
                isDentalBodySite: this.data.item.isDentalBodySite,
                bodySite: ((this.data.item.bodySite && !this.data.item.isDentalBodySite) || (this.data.item.bodySite && (this.data.type === 'oral' || (this.data.type === 'institutional' && this.data.item.type === 'oral-health-ip' ))))? this.data.item.bodySite : (this.data.item.bodySite != null ? this.bodySiteList.filter(x => x.value === this.data.item.bodySite)[0] : ""),
                subSite: this.data.item.subSite != null ? this.subSiteList.filter(x => x.value === this.data.item.subSite)[0] : "",
                quantity: this.data.item.quantity,
                quantityCode: this.data.item.quantityCode != null ? this.data.item.quantityCode : "",
                unitPrice: this.data.item.unitPrice,
                discount: this.data.item.discount,
                discountPercent: this.data.item.discountPercent,
                // (this.data.item.discount * 100) / (this.data.item.quantity * this.data.item.unitPrice)
                // dp = d * 100 / (qty * up)
                factor: this.data.item.factor ? this.data.item.factor : 1,
                taxPercent: this.data.item.taxPercent,
                patientSharePercent: this.data.item.patientSharePercent,
                tax: this.data.item.tax,
                net: this.data.item.net,
                patientShare: this.data.item.patientShare,
                payerShare: this.data.item.payerShare,
                startDate: this.data.item.startDate ? new Date(this.data.item.startDate) : null,
                endDate: this.data.item.endDate ? new Date(this.data.item.endDate) : null,
                invoiceNo: this.data.item.invoiceNo,
                absenceScientificCode: this.absenceReasonList.filter(x => x.value === this.data.item.drugSelectionReason)[0] ? this.absenceReasonList.filter(x => x.value === this.data.item.drugSelectionReason)[0] : ''

            });
            if (this.data.careTeams) {
                this.FormItem.patchValue({
                    // tslint:disable-next-line:max-line-length
                    careTeamSequence: this.data.item.careTeamSequence ? this.data.careTeams.filter(x => this.data.item.careTeamSequence.find(y => y === x.sequence) !== undefined) : []
                });
            }

            if (this.data.diagnosises) {
                this.FormItem.patchValue({
                    // tslint:disable-next-line:max-line-length
                    diagnosisSequence: this.data.item.diagnosisSequence ? this.data.diagnosises.filter(x => this.data.item.diagnosisSequence.find(y => y === x.sequence) !== undefined) : []
                });
            }

            if (this.data.supportingInfos) {
                this.FormItem.patchValue({
                    // tslint:disable-next-line:max-line-length
                    supportingInfoSequence: this.data.item.supportingInfoSequence ? this.data.supportingInfos.filter(x => this.data.item.supportingInfoSequence.find(y => y === x.sequence) !== undefined) : []
                });
            }

            this.getItemList();

            if (this.data.beneficiaryPatientShare) {
                this.FormItem.controls.patientSharePercent.setValue(this.data.beneficiaryPatientShare);
            }
            if (this.data.subType === 'op') {
                  this.FormItem.controls.quantityCode.disable();
            }  this.FormItem.controls.factor.setValue(1);
        }
        if (this.data.supportingInfos) {
            this.filteredSupportingInfo.next(this.data.supportingInfos.slice());
            this.FormItem.controls.supportingInfoFilter.valueChanges
                .pipe(takeUntil(this.onDestroy))
                .subscribe(() => {
                    this.filterSupportingInfo();
                });
        }

        if (this.data.careTeams) {
            this.filteredCareTeam.next(this.data.careTeams.slice());
            this.FormItem.controls.careTeamFilter.valueChanges
                .pipe(takeUntil(this.onDestroy))
                .subscribe(() => {
                    this.filterCareTeam();
                });
        }

        if (this.data.diagnosises) {
            this.filteredDiagnosis.next(this.data.diagnosises.slice());
            this.FormItem.controls.diagnosisFilter.valueChanges
                .pipe(takeUntil(this.onDestroy))
                .subscribe(() => {
                    this.filterDiagnosis();
                });
        }
  }

  SetSingleRecord(type = null) {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
        this.FormItem.controls.quantityCode.setValidators([Validators.required]);
        this.FormItem.controls.quantityCode.updateValueAndValidity();
    } else {
        this.FormItem.controls.quantityCode.clearValidators();
        this.FormItem.controls.quantityCode.updateValueAndValidity();
    }
    this.FormItem.controls.item.setValue('');
    // this.itemList = [{ "code": type.code, "description": type.display }];

    this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, type.itemType).subscribe(event => {
        if (event instanceof HttpResponse) {
            this.itemList = event.body;
            if (type) {
                this.FormItem.patchValue({
                    item: this.itemList.filter(x => x.code === type.code)[0]
                });
            }
            this.filteredItem.next(this.itemList.slice());
            this.FormItem.controls.itemFilter.valueChanges
                .pipe(takeUntil(this.onDestroy))
                .subscribe(() => {
                    this.filterItem();
                });
        }
    }, error => {
        if (error instanceof HttpErrorResponse) {
            console.log(error);
        }
    });
}
typeChange(type = null) {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'scientific-codes') {
        this.sharedServices.loadingChanged.next(true);
        this.providerNphiesSearchService.getPrescribedMedicationList(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body) {
                    this.prescribedMedicationList = body;
                    this.filteredPescribedMedicationItem.next(body);
                    if (this.data.item) {
                        const res = this.prescribedMedicationList.filter(x => x.descriptionCode === this.data.item.prescribedDrugCode)[0] ? this.prescribedMedicationList.filter(x => x.descriptionCode === this.data.item.prescribedDrugCode)[0] : '';
                        if (res) {
                            this.FormItem.patchValue({
                                prescribedDrugCode: res
                            });
                          }
                        this.filteredPescribedMedicationItem.next(this.prescribedMedicationList.slice());
                        this.filterPrescribedMedicationItem();
                    }
                }
            }
           }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
        this.sharedServices.loadingChanged.next(false);
        this.FormItem.controls.quantityCode.setValidators([Validators.required]);
        this.FormItem.controls.quantityCode.updateValueAndValidity();
   
         } 
         if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes'){
            
            this.getItemList(type);
    }
    this.FormItem.controls.item.setValue('');
 
}
getItemList(type = null) {

    if (this.FormItem.controls.type.value) {
        this.sharedServices.loadingChanged.next(true);
        this.IsItemLoading = true;
        this.FormItem.controls.item.disable();
        this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormItem.controls.type.value.value).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.itemList = event.body;
                if (this.data.item && this.data.item.itemCode) {
                    this.FormItem.patchValue({
                        item: this.itemList.filter(x => x.code === this.data.item.itemCode)[0]
                    });
                } else {
                    if (type) {
                        this.FormItem.patchValue({
                            item: this.itemList.filter(x => x.code === type.code)[0]
                        });
                    }
                }
                this.filteredItem.next(this.itemList.slice());
                this.IsItemLoading = false;
                this.FormItem.controls.item.enable();
                this.FormItem.controls.itemFilter.valueChanges
                    .pipe(takeUntil(this.onDestroy))
                    .subscribe(() => {
                        this.filterItem();
                    });
                this.sharedServices.loadingChanged.next(false);
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                console.log(error);
            }
        });
    }
}
filterItem() {
    if (!this.itemList) {
        return;
    }
    // get the search keyword
    let search = this.FormItem.controls.itemFilter.value;
    if (!search) {
        this.filteredItem.next(this.itemList.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the nations
    this.filteredItem.next(
        this.itemList.filter(item => item.description.toLowerCase().indexOf(search) > -1 || item.code.toString().toLowerCase().indexOf(search) > -1)
    );
}

filterPrescribedMedicationItem() {
    if (!this.prescribedMedicationList) {
        return;
    }
    let search = this.FormItem.controls.prescribedMedicationItemFilter.value;
    if (!search) {
        this.filteredPescribedMedicationItem.next(this.prescribedMedicationList.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    this.filteredPescribedMedicationItem.next(
        this.prescribedMedicationList.filter(item => (item.descriptionCode && item.descriptionCode.toLowerCase().indexOf(search) > -1) || (item.tradeName && item.tradeName.toString().toLowerCase().indexOf(search) > -1) || (item.gtinNumber && item.gtinNumber.toString().toLowerCase().indexOf(search) > -1))
    );
}


filterSupportingInfo() {
    if (!this.data.supportingInfos) {
        return;
    }
    // get the search keyword
    let search = this.FormItem.controls.careTeamFilter.value;
    if (!search) {
        this.filteredSupportingInfo.next(this.data.supportingInfos.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the nations
    this.filteredSupportingInfo.next(
        this.data.supportingInfos.filter(item => item.categoryName.toLowerCase().indexOf(search) > -1)
    );

}

filterCareTeam() {
    if (!this.data.careTeams) {
        return;
    }
    // get the search keyword
    let search = this.FormItem.controls.careTeamFilter.value;
    if (!search) {
        this.filteredCareTeam.next(this.data.careTeams.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the nations
    this.filteredCareTeam.next(
        this.data.careTeams.filter(item => item.practitionerName.toLowerCase().indexOf(search) > -1)
    );
}

filterDiagnosis() {
    if (!this.data.careTeams) {
        return;
    }
    // get the search keyword
    let search = this.FormItem.controls.diagnosisFilter.value;
    if (!search) {
        this.filteredDiagnosis.next(this.data.diagnosises.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the nations
    this.filteredDiagnosis.next(
        this.data.diagnosises.filter(item => item.diagnosisDescription.toLowerCase().indexOf(search) > -1)
    );
}
checkItemsCodeForSupportingInfo() {
    let SeqIsThere = null;
    // tslint:disable-next-line:max-line-length
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {

        if (this.data.supportingInfos.filter(x => x.category === 'days-supply').length === 0) {
            // tslint:disable-next-line:max-line-length
            // this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any medication-code is used', 'alert', true, 'OK');

            this.FormItem.controls.supportingInfoSequence.setValidators([Validators.required]);
            this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();

            this.IsSupportingInfoSequenceRequired = true;
            this.supportingInfoError = 'Days-Supply is required in Supporting Info if any medication-code is used';

            return false;
        } else {


            if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {

                //let intersecting=this.getArraysIntersection(seqList, this.Items.filter(x => x.type === 'medication-codes').map(t=>t.supportingInfoSequence));
                // tslint:disable-next-line:max-line-length
                if (this.FormItem.controls.supportingInfoSequence.value) {
                    let SupportingList = this.data.supportingInfos.filter(x => x.category === 'days-supply').map(t => t.sequence);
                    let ItemSeqList = this.FormItem.controls.supportingInfoSequence.value.map(t => t.sequence);
                    SeqIsThere = ItemSeqList.filter(x => SupportingList.includes(x));
                }
                console.log("SeqIsThere = " + SeqIsThere);

                if (!this.FormItem.controls.supportingInfoSequence.value || (this.FormItem.controls.supportingInfoSequence.value && (SeqIsThere == null || SeqIsThere == ''))) {
                    // tslint:disable-next-line:max-line-length
                    // this.dialogService.showMessage('Error', 'Supporting Info with Days-Supply must be linked with Item of type medication-code', 'alert', true, 'OK');
                    this.FormItem.controls.supportingInfoSequence.setValidators([Validators.required]);
                    this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();

                    this.IsSupportingInfoSequenceRequired = true;
                    this.supportingInfoError = 'Supporting Info with Days-Supply must be linked with Item of type medication-code';
                    return false;

                } else {
                    this.IsSupportingInfoSequenceRequired = false;
                    this.supportingInfoError = '';
                    this.FormItem.controls.supportingInfoSequence.clearValidators();
                    this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
                    return true;
                }
            } else {
                this.IsSupportingInfoSequenceRequired = false;
                this.supportingInfoError = '';
                this.FormItem.controls.supportingInfoSequence.clearValidators();
                this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
                return true;
            }
        }

    } else {
        this.IsSupportingInfoSequenceRequired = false;
        this.supportingInfoError = '';
        this.FormItem.controls.supportingInfoSequence.clearValidators();
        this.FormItem.controls.supportingInfoSequence.updateValueAndValidity();
        return true;
    }
}

get IsQuantityCodeRequired() {
    if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
        return true;
    } else {
        return false;
    }
}
get IsInvalidQuantity() {
    const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;
    pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString());
    return !pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString());
}

daysDiff(d1, d2) {
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
  
onSubmit() {
    this.isSubmitted = true;
    // if (!this.checkItemsCodeForSupportingInfo()) {
    //     return;
    // }
    console.log(this.FormItem,"ssksjsi")

    if (this.FormItem) {

        const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

        const model: any = {};
        model.sequence = this.data.Sequence;
        model.type = this.FormItem.controls.type.value.value;
        model.typeName = this.FormItem.controls.type.value.name;
        model.itemCode = this.FormItem.controls.item.value.code;
        model.itemDescription = this.FormItem.controls.item.value.description;
        model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
        model.display = this.FormItem.controls.display.value;
        model.isPackage = this.FormItem.controls.isPackage.value;
        model.bodySite = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.value : '';
        model.bodySiteName = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.name : '';
        model.subSite = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.value : '';
        model.subSiteName = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.name : '';
        model.quantity = parseFloat(this.FormItem.controls.quantity.value);
        model.quantityCode = this.FormItem.controls.quantityCode.value;
        if (this.FormItem.controls.supportingInfoSequence.value && this.FormItem.controls.supportingInfoSequence.value.length > 0) {
            model.supportingInfoSequence = this.FormItem.controls.supportingInfoSequence.value.map((x) => { return x.sequence });
        }

        if (this.FormItem.controls.careTeamSequence.value && this.FormItem.controls.careTeamSequence.value.length > 0) {
            model.careTeamSequence = this.FormItem.controls.careTeamSequence.value.map((x) => { return x.sequence });
        }

        if (this.FormItem.controls.diagnosisSequence.value && this.FormItem.controls.diagnosisSequence.value.length > 0) {
            model.diagnosisSequence = this.FormItem.controls.diagnosisSequence.value.map((x) => { return x.sequence });
        }
        model.itemDetails = [];
        console.log(model,"model")
        this.dialogRef.close(model);
    }
}

onDetailSubmit() {
    this.isSubmitted = true;
   if (this.FormDetails) {

        const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

        const model: any = {};
     
        model.itemDetails = {
            sequence: this.data.Sequence,
            type: this.FormDetails.controls.type.value.value,
            typeName: this.FormDetails.controls.type.value.name,
            itemCode: this.FormDetails.controls.item.value.code,
            itemDescription: this.FormDetails.controls.item.value.description,
            nonStandardCode: this.FormDetails.controls.nonStandardCode.value,
            display: this.FormDetails.controls.display.value,
            strength: this.FormDetails.controls.strength.value,
            quantity: parseFloat(this.FormDetails.controls.quantity.value),
            quantityCode: this.FormDetails.controls.quantityCode.value
        };
        this.dialogRef.close(model);
    }
}

onDosageDetailSubmit() {
    this.isSubmitted = true;
   if (this.FormDosage) {

        const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

        const model: any = {};
 
        model.sequence = this.data.Sequence;
        model.note = this.FormDosage.controls.note.value.value;
        model.patientInstruction = this.FormDosage.controls.patientInstruction.value.name;
        model.route = this.FormDosage.controls.route.value.code;
        model.doseType = this.FormDosage.controls.doseType.value;
        model.doseUnitOrRangeMin = this.FormDosage.controls.min.value || this.FormDosage.controls.doseUnit.value.name;
        model.doseRangeMax = this.FormDosage.controls.max.value || this.FormDosage.controls.doseQuantity.value;
        model.rateType = this.FormDosage.controls.rateType.value.code;
        model.rateRatioNumeratorMin = this.FormDosage.controls.numerator.value.description || this.FormDosage.controls.ratemin.value ||this.FormDosage.controls.rateQuantity.value;
        model.rateRatioDenominatorMax = this.FormDosage.controls.denominator.value ||  this.FormDosage.controls.ratemax.value;
        model.rateUnit = this.FormDosage.controls.rateUnit.value;
        model.startDate = this.FormItem.controls.startDate.value; 
        model.startDateStr = this.datePipe.transform(this.FormItem.controls.startDate.value, 'dd-MM-yyyy hh:mm aa');

        model.endDate = this.FormItem.controls.endDate.value; 
        model.endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'dd-MM-yyyy hh:mm aa');
        model.refill = this.FormDosage.controls.refill.value;
        model.duration = this.FormDosage.controls.duration.value;
        model.frequency = this.FormDosage.controls.frequency.value;
        model.period = this.FormDosage.controls.period.value;
        model.durationUnit = this.FormDosage.controls.durationUnit.value;
        model.periodUnit = this.FormDosage.controls.periodUnit.value;
        model.itemDosageData = [];
        this.dialogRef.close(model);
    }
}
 
  showItem() {
    const dataToSend = 'Data from child component';
    this.dataEvent.emit(dataToSend);
  }

  private showPopupBasedOnType() {
    switch (this.data.popupType) {
      case 'addItem':
        this.showAddItemPopup();
        break;
      case 'addDetails':
        this.showAddItemDetailsPopup();
        break;
      case 'addDosageTiming':
        this.showAddDosageTimingPopup();
        break;
      default:
        // Default behavior or error handling
        break;
    }
  }

  showAddItemPopup() {
    this.isAddItemVisible = true;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = false;
  }

  showAddItemDetailsPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = true;
    this.isAddDosageTimingVisible = false;
  }

  showAddDosageTimingPopup() {
    this.isAddItemVisible = false;
    this.isAddItemDetailsVisible = false;
    this.isAddDosageTimingVisible = true;
  }

  

  closeDialog() {
    this.dialogRef.close();
  }
}
