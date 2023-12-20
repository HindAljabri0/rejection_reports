import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-add-edit-prescriptions-item',
    styleUrls: ['./add-edit-prescriptions-item.component.css'],
    templateUrl: './add-edit-prescriptions-item.component.html',
})
export class AddEditPrescriptionsItemComponent implements OnInit {

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
        // itemCode: ['', Validators.required],
        // itemDescription: ['', Validators.required],
        nonStandardCode: [''],
        display: [''],
        isPackage: [false],
        bodySite: [''],
        subSite: [''],
        quantity: ['', Validators.required],
        strength: [''],
        quantityCode: [''],
        supportingInfoSequence: [''],
        supportingInfoFilter: [''],
        careTeamSequence: [''],
        careTeamFilter: [''],
        diagnosisSequence: [''],
        diagnosisFilter: [''],
        absenceScientificCode: [''],
        endDate: [''],
        prescribedDrugCode: ['']
    });
    originalPrice = 0;
    granularUnit = null;
    isSubmitted = false;
    typeListSearchResult = [];
    SearchRequest;
    prescribedMedicationList: any;
    bodySiteList = [];
    subSiteList = [];
    IscareTeamSequenceRequired = false;

    IsSupportingInfoSequenceRequired = false;
    supportingInfoError = '';

    showQuantityCode = true;
    serviceDataError = '';

    today: Date;
    loadSearchItem = false;
    absenceReasonList = this.sharedDataService.itemAbsenceReasonList;
    prescribedCode: { value: string; name: string; }[];

    constructor(
        private sharedDataService: SharedDataService,
        private dialogRef: MatDialogRef<AddEditPrescriptionsItemComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
        private sharedServices: SharedServices, private formBuilder: FormBuilder,
        private providerNphiesSearchService: ProviderNphiesSearchService) {
        this.today = new Date();
        this.today.setSeconds(0, 0);
    }


    ngOnInit() {
        this.prescribedCode = [{ value: 'scientific-codes', name: 'Scientific Code' },
        { value: 'medication-codes', name: 'GTIN Code' }];
          if (this.data.type) {
              
               this.bodySiteList = this.sharedDataService.getBodySite(this.data.type);
               this.subSiteList = this.sharedDataService.getSubSite(this.data.type);          
               }
      
        if (this.data.item) {        
            this.FormItem.patchValue({
                type: this.data.source ===  this.prescribedCode.filter(x => x.value === this.data.item.type)[0],
                itemDescription: this.itemList.filter(x => x.code === this.data.item.itemDescription)[0],
                itemCode: this.itemList.filter(x => x.code === this.data.item.itemCode)[0],
                nonStandardCode: this.data.item.nonStandardCode,
                display: this.data.item.display,
                isPackage: this.data.item.isPackage,
                bodySite: ((this.data.item.bodySite && !this.data.item.isDentalBodySite) || (this.data.item.bodySite && (this.data.type === 'oral' || (this.data.type === 'institutional' && this.data.item.type === 'oral-health-ip' ))))? this.data.item.bodySite : (this.data.item.bodySite != null ? this.bodySiteList.filter(x => x.value === this.data.item.bodySite)[0] : ""),
                subSite: this.data.item.subSite != null ? this.subSiteList.filter(x => x.value === this.data.item.subSite)[0] : "",
                quantity: this.data.item.quantity,
                quantityCode: this.data.item.quantityCode != null ? this.data.item.quantityCode : "",
                strength: this.data.item.strength,
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
        } else {

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
         
          if (this.data.subType === 'op') {
                this.FormItem.controls.quantityCode.setValue('{package}');
                this.FormItem.controls.quantityCode.disable();
            }
            this.FormItem.controls.factor.setValue(1);
        }

  

        if (this.data.providerType === 'vision' && this.data.source === 'APPROVAL') {
            this.FormItem.controls.factor.setValue(1);
            this.FormItem.controls.factor.disable();
        }
    }

    selectItem(type) {
        if (type) {
            if (type.itemType && type.itemType === 'medication-codes') {
                this.FormItem.controls.quantityCode.setValidators([Validators.required]);
                this.FormItem.controls.quantityCode.updateValueAndValidity();
                this.FormItem.controls.quantityCode.setValue('{package}');
            } else {
                this.FormItem.controls.quantityCode.clearValidators();
                this.FormItem.controls.quantityCode.updateValueAndValidity();
                this.FormItem.controls.quantityCode.setValue('');
                this.FormItem.controls.quantityCode.disable();
                this.showQuantityCode = false;
            }

            this.FormItem.patchValue({
                type:  this.prescribedCode.filter(x => x.value === type.itemType)[0],
                nonStandardCode: type.nonStandardCode,
                display: type.nonStandardDescription,
           
                });
        
            this.SetSingleRecord(type);
             if (this.data.type === "pharmacy") {
                this.FormItem.patchValue({
                    prescribedDrugCode: ""
                });
                this.setPrescribedMedication(type.code);
            }
        }
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
    setPrescribedMedication(gtinNumber: any) {
        const filteredData = this.itemList.filter((item) => item.code === gtinNumber);
        this.FormItem.patchValue({
            unitPrice: filteredData[0].unitPrice,
        });

        this.originalPrice = filteredData[0].unitPrice;

        this.granularUnit = filteredData[0].granularUnit;
            if (this.data.type === "pharmacy") {
            this.itemList.filter(x => x.code === this.data.item.itemCode)[0]
            this.filteredPescribedMedicationItem.next(this.prescribedMedicationList);
            const res = this.prescribedMedicationList.filter(x => x.gtinNumber === gtinNumber)[0];
            if (res != undefined) {
                this.FormItem.patchValue({
                    prescribedDrugCode: res
                });
            } else {
                this.FormItem.patchValue({
                    prescribedDrugCode: ""
                });
            }
            this.filteredPescribedMedicationItem.next(this.prescribedMedicationList.slice());
            this.filterPrescribedMedicationItem();
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
 
    onRadioChange(event: any) {
        if (!this.FormItem.controls.isDentalBodySite.value) {
            this.subSiteList = this.sharedDataService.getSubSite('oral');
        } else {
            this.subSiteList = this.sharedDataService.getSubSite(this.data.type);
        }
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

    updateFactor() {

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.discount.value !== null && this.FormItem.controls.discount.value !== undefined) {
            const gross = parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value);
            let discount = parseFloat(this.FormItem.controls.discount.value);
            if (discount > gross || discount < 0) {
                this.FormItem.controls.discount.setValue(0);
                discount = 0;
            }
            // const factorValue = (100 - ((discount / gross) * 100)) / 100;
            const factorValue = 1 - (discount / gross);
            this.FormItem.controls.factor.setValue(parseFloat(factorValue.toFixed(2)));
        } else {
            if (!this.FormItem.controls.factor.value) {
                this.FormItem.controls.factor.setValue(1);
            }
        }

    }

      roundTo(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
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

    validateNewBornValues() {
        // if (this.data.IsNewBorn && this.data.beneficiaryDob && (this.data.type === 'institutional' || this.data.type === 'professional')) {
        if (this.data.IsNewBorn && this.data.beneficiaryDob) {
            const serviceDate = new Date(this.FormItem.controls.endDate.value);
            const dob = new Date(this.data.beneficiaryDob);
            if (serviceDate < dob) {
                // tslint:disable-next-line:max-line-length
                this.serviceDataError = 'End Date cannot be less than New Born Date of Birth (dob: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ' )';
                return false;
            } else {
                const diff = this.daysDiff(dob, serviceDate);
                if (diff > 90) {
                    // tslint:disable-next-line:max-line-length
                    this.serviceDataError = 'Difference between End Date and New Born Date of Birth cannot be greater than 90 days (Newborn DOB: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ' )';
                    return false;
                } else {
                    this.serviceDataError = '';
                    return true;
                }
            }

        } else {
            return true;
        }
    }

    daysDiff(d1, d2) {
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    CalculateUnitPrice(event) {
        if (event == "{unit}") {
            this.FormItem.patchValue({
                unitPrice: this.granularUnit != null ? (this.originalPrice / this.granularUnit).toFixed(2): this.originalPrice,
            });
        }
        else if (event == "{package}") {
            this.FormItem.patchValue({
                unitPrice: this.originalPrice,
            });

        }
    }
    onSubmit() {
        this.isSubmitted = true;
        if (!this.checkItemsCodeForSupportingInfo()) {
            return;
        }

        if (this.FormItem.valid) {
           

            const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

            if (!pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString())) {
                return;
            }

            if (!this.validateNewBornValues()) {
                return;
            }

            const model: any = {};
            model.sequence = this.data.Sequence;
            model.type = this.FormItem.controls.type.value.value;
            model.typeName = this.FormItem.controls.type.value.name;
            model.itemCode = this.FormItem.controls.item.value.code || this.FormItem.controls.item.value.gtinNumber;
            model.itemDescription = this.FormItem.controls.item.value.description || this.FormItem.controls.item.value.tradeName;
            model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
            model.display = this.FormItem.controls.display.value;
            model.isPackage = this.FormItem.controls.isPackage.value;
            model.bodySite = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.value : '';
            model.bodySiteName = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.name : '';
            model.subSite = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.value : '';
            model.subSiteName = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.name : '';
            model.quantity = parseFloat(this.FormItem.controls.quantity.value);
            model.quantityCode = this.FormItem.controls.quantityCode.value;
            model.strength = this.FormItem.controls.strength.value;
            model.endDate = this.FormItem.controls.endDate.value; 
            model.absenceScientificCode = this.FormItem.controls.absenceScientificCode.value.value;
         //   model.authoredOnStr = this.datePipe.transform(this.FormItem.controls.authoredOn.value, 'dd-MM-yyyy hh:mm aa');

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
         
            // console.log("item model = " + JSON.stringify(model));
            this.dialogRef.close(model);
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


    closeDialog() {
        this.dialogRef.close();
    }

    onBodySiteChange(event) {
        if (event.value === "") {
            this.FormItem.controls.subSite.setValue("");
        }
    }

}
