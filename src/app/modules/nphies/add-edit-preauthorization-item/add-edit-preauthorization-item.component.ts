import { Component, OnInit, Inject, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ReplaySubject, Subject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { X } from '@angular/cdk/keycodes';
import { DatePipe, JsonPipe } from '@angular/common';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';

@Component({
    selector: 'app-add-edit-preauthorization-item',
    styleUrls: ['./add-edit-preauthorization-item.component.css'],
    templateUrl: './add-edit-preauthorization-item.component.html',
})
export class AddEditPreauthorizationItemComponent implements OnInit {
    @ViewChild('reasonSelect', { static: true }) reasonSelect: ElementRef;
    @ViewChild('otherInput', { static: true }) otherInput: ElementRef;
    @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
    itemList: any = [];
    itemListFiltered: any = [];
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
        isDentalBodySite: [true],
        bodySite: [''],
        subSite: [''],
        quantity: ['', Validators.required],
        quantityCode: [''],
        unitPrice: ['', Validators.required],
        discountPercent: [''],
        discount: [0],
        factor: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
        taxPercent: [''],
        patientSharePercent: [''],
        tax: [0],
        net: [''],
        patientShare: [''],
        payerShare: [''],
        startDate: [''],
        endDate: ['', Validators.required],
        supportingInfoSequence: [''],
        supportingInfoFilter: [''],
        careTeamSequence: [''],
        careTeamFilter: [''],
        diagnosisSequence: [''],
        diagnosisFilter: [''],
        invoiceNo: [''],

        // IsTaxApplied: [false],
        searchQuery: [''],
        pharmacistSelectionReason: [''],
        prescribedDrugCode: [''],
        // pharmacySubstitute: [''],
        pharmacistSubstitute: [''],
        reasonPharmacistSubstitute: [''],
    });
    showTextInput = false;
    otherReason = '';
    originalPrice = 0;
    granularUnit = null;
    isSubmitted = false;
    typeListSearchResult = [];
    SearchRequest;
    typeList = this.sharedDataService.itemTypeList;
    medicationReasonList = this.sharedDataService.itemMedicationReasonList;
    pharmacySubstituteList = this.sharedDataService.pharmacySubstituteList;
    prescribedMedicationList: any;
    bodySiteList = [];
    subSiteList = [];
    IscareTeamSequenceRequired = false;

    IsSupportingInfoSequenceRequired = false;
    supportingInfoError = '';

    IsDiagnosisSequenceRequired = false;
    diagnosisError = '';

    showQuantityCode = true;
    serviceDataError = '';

    showEBPfeilds = false;
    today: Date;
    loadSearchItem = false;
    renderer: any;
    cnhiTypeList: { value: string; name: string; }[];
    unitPriceDisabled = false;
    constructor(
        private sharedDataService: SharedDataService, private superAdmin: SuperAdminService,
        private dialogRef: MatDialogRef<AddEditPreauthorizationItemComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
        private sharedServices: SharedServices, private formBuilder: FormBuilder,
        private providerNphiesSearchService: ProviderNphiesSearchService) {
        this.today = new Date();
        this.today.setSeconds(0, 0);
    }


    ngOnInit() {
        this.cnhiTypeList = [{ value: 'moh-category', name: 'MOH Billing Codes' }];
        this.getNphiesUnitPriceSettings();
        if (this.data.providerType === 'vision' && !this.data.item) {
            const principalDiagnosis = this.data.diagnosises.filter(x => x.type === "principal");
            if (principalDiagnosis.length > 0) {
                this.FormItem.controls.diagnosisSequence.setValue([principalDiagnosis[0]]);
            } else {
                this.FormItem.controls.diagnosisSequence.setValue([this.data.diagnosises[0]]);
            }
        }
        if (this.data.source === 'APPROVAL') {
            this.FormItem.controls.invoiceNo.clearValidators();
            this.FormItem.controls.invoiceNo.updateValueAndValidity();
            this.FormItem.controls.invoiceNo.setValue('');
        } else if (this.data.source === 'CLAIM') {
            if (this.data.dateOrdered) {
                this.today = this.data.dateOrdered;
            }
            this.FormItem.controls.invoiceNo.setValidators(Validators.required);
            this.FormItem.controls.invoiceNo.updateValueAndValidity();
            this.FormItem.controls.invoiceNo.setValue('');
        }

        if (this.data.type) {
            this.setTypes(this.data.type);
            this.bodySiteList = this.sharedDataService.getBodySite(this.data.type);
            this.subSiteList = this.sharedDataService.getSubSite(this.data.type);
        }

        if (this.data.type === "pharmacy") {
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
            this.FormItem.controls.prescribedMedicationItemFilter.valueChanges
                .pipe(takeUntil(this.onDestroy))
                .subscribe(() => {
                    this.filterPrescribedMedicationItem();
                });
        }
        if (this.data.item) {
            this.showEBPfeilds = this.data.type === "pharmacy" && this.data.item.type === "medication-codes";
            if (this.data.source === 'APPROVAL' || this.data.source === 'CNHI') {
                if (this.data.item.itemDecision && this.data.item.itemDecision.status && (this.data.item.itemDecision.status.toLowerCase() === 'approved' || this.data.item.itemDecision.status.toLowerCase() === 'partial')) {
                    this.FormItem.controls.startDate.disable();
                    this.FormItem.controls.endDate.disable();
                }
            }
            if (this.data.isDentalBodySite) {
                this.bodySiteList = (this.data.isDentalBodySite === false)
                    ? this.sharedDataService.getBodySite('oral')
                    : this.sharedDataService.getBodySite(this.data.type)
                this.subSiteList = (this.data.isDentalBodySite === false)
                    ? this.sharedDataService.getSubSite('oral')
                    : this.sharedDataService.getSubSite(this.data.type);
            }
            this.FormItem.patchValue({
                type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === this.data.item.type)[0] : this.typeList.filter(x => x.value === this.data.item.type)[0],
                itemDescription: this.itemList.filter(x => x.code === this.data.item.itemDescription)[0],
                itemCode: this.itemList.filter(x => x.code === this.data.item.itemCode)[0],
                nonStandardCode: this.data.item.nonStandardCode,
                display: this.data.item.display,
                isPackage: this.data.item.isPackage,
                isDentalBodySite: this.data.item.isDentalBodySite,
                bodySite: ((this.data.item.bodySite && !this.data.item.isDentalBodySite) || (this.data.item.bodySite && (this.data.type === 'oral' || (this.data.type === 'institutional' && this.data.item.type === 'oral-health-ip')))) ? this.data.item.bodySite : (this.data.item.bodySite != null ? this.bodySiteList.filter(x => x.value === this.data.item.bodySite)[0] : ""),
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
                pharmacistSelectionReason: this.medicationReasonList.filter(x => x.value === this.data.item.pharmacistSelectionReason)[0] ? this.medicationReasonList.filter(x => x.value === this.data.item.pharmacistSelectionReason)[0] : '',
                pharmacistSubstitute: this.data.item.pharmacistSubstitute,
                reasonPharmacistSubstitute: this.data.item.reasonPharmacistSubstitute,
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
            if (this.data.source === 'APPROVAL' || this.data.source === 'CNHI') {
                this.FormItem.controls.quantity.setValue(1);
                this.FormItem.controls.startDate.setValue(this.today);
                this.FormItem.controls.endDate.setValue(this.today);

                if (this.data.careTeams && this.data.careTeams.length === 1) {
                    this.FormItem.patchValue({
                        // tslint:disable-next-line:max-line-length
                        careTeamSequence: this.data.careTeams
                    });
                }
            }

            if (this.data.beneficiaryPatientShare) {
                this.FormItem.controls.patientSharePercent.setValue(this.data.beneficiaryPatientShare);
            }
            // if (this.data.documentId && this.data.documentId === 'NI') {
            //   this.FormItem.controls.IsTaxApplied.setValue(false);
            // } else {
            //   this.FormItem.controls.IsTaxApplied.setValue(true);
            // }

            if (this.data.subType === 'op') {
                this.FormItem.controls.quantityCode.setValue('{package}');
                this.FormItem.controls.quantityCode.disable();
            }
            this.FormItem.controls.factor.setValue(1);
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

        if (this.data.providerType === 'vision' && this.data.source === 'APPROVAL') {
            this.FormItem.controls.factor.setValue(1);
            this.FormItem.controls.factor.disable();
        }
    }
    getNphiesUnitPriceSettings() {

        this.superAdmin.getNphiesUnitPriceFlageByProviderSettings(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                let response = event.body as boolean;
                if (response && this.data.source === 'APPROVAL') {
                    this.FormItem.controls.unitPrice.disable();
                } else {
                    this.FormItem.controls.unitPrice.enable();
                }
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status != 404) {
                    this.FormItem.controls.unitPrice.enable();
                }
            }
        });
    }
    onReasonSelectionChange(select: MatSelect): void {
        const selectedValue = select.value;
        this.showTextInput = selectedValue === 'other';

        if (this.showTextInput) {
            setTimeout(() => {
                this.otherInput.nativeElement.focus();
            });
        }
    }
    openDropdown(event: Event): void {
        event.stopPropagation();
        this.reasonSelect.nativeElement.open();
    }
    onSelectOption() {
        if (this.FormItem.controls.pharmacistSubstitute.value === 'Others') {
            setTimeout(() => {
                this.renderer.selectRootElement(this.otherInput.nativeElement).focus();
            });
        }
    }

    setTypes(type) {

        switch (type) {
            case 'vision':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'procedures', name: 'Procedures' },
                    { value: 'services', name: 'Services' }
                ];
                this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
                this.FormItem.controls.careTeamSequence.updateValueAndValidity();
                this.IscareTeamSequenceRequired = true;
                break;
            case 'professional':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'medication-codes', name: 'Medication Codes' },
                    { value: 'transportation-srca', name: 'Transportation SRCA' },
                    { value: 'imaging', name: 'Imaging' },
                    { value: 'procedures', name: 'Procedures' },
                    { value: 'services', name: 'Services' },
                    { value: 'laboratory', name: 'Laboratory' }
                ];
                this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
                this.FormItem.controls.careTeamSequence.updateValueAndValidity();
                this.IscareTeamSequenceRequired = true;
                break;
            case 'oral':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'medication-codes', name: 'Medication Codes' },
                    { value: 'transportation-srca', name: 'Transportation SRCA' },
                    { value: 'imaging', name: 'Imaging' },
                    { value: 'services', name: 'Services' },
                    { value: 'laboratory', name: 'Laboratory' },
                    { value: 'oral-health-op', name: 'Oral Health OP' },
                    { value: 'oral-health-ip', name: 'Oral Health IP' }
                ];
                this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
                this.FormItem.controls.careTeamSequence.updateValueAndValidity();
                this.IscareTeamSequenceRequired = true;
                break;
            case 'institutional':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'medication-codes', name: 'Medication Codes' },
                    { value: 'transportation-srca', name: 'Transportation SRCA' },
                    { value: 'imaging', name: 'Imaging' },
                    { value: 'procedures', name: 'Procedures' },
                    { value: 'services', name: 'Services' },
                    { value: 'laboratory', name: 'Laboratory' },
                    { value: 'oral-health-ip', name: 'Oral Health IP' }
                ];

                this.FormItem.controls.careTeamSequence.setValidators([Validators.required]);
                this.FormItem.controls.careTeamSequence.updateValueAndValidity();
                this.IscareTeamSequenceRequired = true;
                break;
            case 'pharmacy':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'medication-codes', name: 'Medication Codes' }
                ];
                this.FormItem.controls.careTeamSequence.clearValidators();
                this.FormItem.controls.careTeamSequence.updateValueAndValidity();
                this.IscareTeamSequenceRequired = false;
                break;
        }

    }

    selectItem(type) {
        if (type) {
            if (type.itemType && type.itemType === 'medication-codes') {
                this.FormItem.controls.quantityCode.setValidators([Validators.required]);
                this.FormItem.controls.quantityCode.updateValueAndValidity();
                this.FormItem.controls.quantityCode.setValue('{package}');
                this.showEBPfeilds = true && this.data.type === "pharmacy";
            } else {
                this.FormItem.controls.quantityCode.clearValidators();
                this.FormItem.controls.quantityCode.updateValueAndValidity();
                this.FormItem.controls.quantityCode.setValue('');
                this.FormItem.controls.quantityCode.disable();
                this.showQuantityCode = false;
                this.showEBPfeilds = false;
            }

            this.FormItem.patchValue({
                type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === type.itemType)[0] : this.typeList.filter(x => x.value === type.itemType)[0],
                nonStandardCode: type.nonStandardCode,
                display: type.nonStandardDescription,
                unitPrice: type.unitPrice,
                factor: type.factor ? type.factor : 1,
                // tax: 0
            });
            if (this.data.providerType === 'vision' && this.data.source === 'APPROVAL') {
                this.FormItem.controls.factor.setValue(1);
                this.FormItem.controls.factor.disable();
            }
            this.SetSingleRecord(type);
            this.updateDiscount();
            this.updateNet();
            if (this.data.type === "pharmacy") {
                this.FormItem.patchValue({
                    prescribedDrugCode: ""
                });
                this.setPrescribedMedication(type.code);
            }
        }
    }

    itemListFilteredFun(StanderCode) {
        this.itemListFiltered = [];
        this.itemList.forEach(x => {
            if (x.code === StanderCode) {

                this.itemListFiltered.unshift(x);
            } else {
                this.itemListFiltered.push(x);
            }
        });
    }
    setPrescribedMedication(gtinNumber: any) {
        const filteredData = this.itemList.filter((item) => item.code === gtinNumber);
        this.itemListFilteredFun(gtinNumber);
        this.FormItem.patchValue({
            item: this.itemList.filter(x => x.code === gtinNumber)[0]
        });
        //this.filteredItem.next(this.itemListFiltered.slice());
        this.FormItem.patchValue({
            unitPrice: filteredData[0].unitPrice,
        });

        this.originalPrice = filteredData[0].unitPrice;

        this.granularUnit = filteredData[0].granularUnit;
        this.updateNet();

        if (this.data.type === "pharmacy") {
            //this.itemList.filter(x => x.code === this.data.item.itemCode)[0];
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
        const endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'yyyy-MM-dd');

        this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, type.itemType, endDateStr).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.itemList = event.body;
                if (type) {
                    this.FormItem.patchValue({
                        item: this.itemList.filter(x => x.code === type.code)[0]
                    });
                }
                this.itemListFilteredFun(type.code);
                this.filteredItem.next(this.itemListFiltered.slice());
                //this.filteredItem.next(this.itemList.slice());
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
        if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
            this.FormItem.controls.quantityCode.setValidators([Validators.required]);
            this.FormItem.controls.quantityCode.updateValueAndValidity();
            this.FormItem.controls.quantityCode.setValue('{package}');
            this.showEBPfeilds = true && this.data.type === "pharmacy";
            this.subSiteList = (this.data.source === 'CNHI' && !this.FormItem.controls.isDentalBodySite.value)
                ? this.sharedDataService.getSubSite('oral')
                : this.sharedDataService.getSubSite(this.data.type);
        } else {
            this.FormItem.controls.quantityCode.clearValidators();
            this.FormItem.controls.quantityCode.updateValueAndValidity();
            this.FormItem.controls.quantityCode.setValue('');
            this.FormItem.controls.quantityCode.disable();
            this.showQuantityCode = false;
            this.showEBPfeilds = false;
        }
        this.FormItem.controls.item.setValue('');
        if (type) {
            this.getItemList(type);
        } else {
            this.getItemList();
        }
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
            const endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'yyyy-MM-dd');

            this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormItem.controls.type.value.value, endDateStr).subscribe(event => {
                if (event instanceof HttpResponse) {
                    this.itemList = event.body;
                    this.itemListFiltered = this.itemList;
                    if (this.data.item && this.data.item.itemCode) {
                        this.FormItem.patchValue({
                            item: this.itemList.filter(x => x.code === this.data.item.itemCode)[0]
                        });
                        this.itemListFilteredFun(this.data.item.itemCode);
                    } else {
                        if (type) {
                            this.FormItem.patchValue({
                                item: this.itemList.filter(x => x.code === type.code)[0]
                            });
                            this.itemListFilteredFun(type.code);
                        }
                    }
                    this.filteredItem.next(this.itemListFiltered.slice());
                    // this.filteredItem.next(this.itemList.slice());
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
    search = '';
    filterMyOptions(val) {
        this.search = val;
        this.filterItem();
        console.log(val);
    }
    filterItem() {
        if (!this.itemListFiltered) {
            return;
        }
        // get the search keyword
        //let search = this.FormItem.controls.itemFilter.value;
        if (this.search === null || this.search === '' || this.search.length === 0 || !this.search) {
            this.filteredItem.next(this.itemListFiltered.slice());
            return;
        } else {
            this.search = this.search.toLowerCase();
        }
        // filter the nations
        this.filteredItem.next(
            this.itemListFiltered.filter(item => item.description.toLowerCase().indexOf(this.search) > -1 || item.code.toString().toLowerCase().indexOf(this.search) > -1)
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


    updateDiscount() {

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && parseFloat(this.FormItem.controls.factor.value) >= 0 && parseFloat(this.FormItem.controls.factor.value) <= 1) {
            const gross = parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value);
            // const discount = ((100 - (parseFloat(this.FormItem.controls.factor.value) * 100)) * 100) / gross;
            // const discount = ((100 - (parseFloat(this.FormItem.controls.factor.value) * 100)) / 100) * gross;
            const discount = gross * (1 - parseFloat(this.FormItem.controls.factor.value));
            this.FormItem.controls.discount.setValue(parseFloat(discount.toFixed(2)));
        } else {
            this.FormItem.controls.discount.setValue(0);
        }

    }

    updateNet() {

        // tslint:disable-next-line:max-line-length
        if (this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && (this.FormItem.controls.tax.value != null && this.FormItem.controls.tax.value !== undefined)) {
            let tax = parseFloat(this.FormItem.controls.tax.value);
            if (tax < 0) {
                this.FormItem.controls.tax.setValue(0);
                tax = 0;
            }
            // tslint:disable-next-line:max-line-length
            const netValue = (parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value) * parseFloat(this.FormItem.controls.factor.value)) + tax;
            // console.log("Quntity = " + parseFloat(this.FormItem.controls.quantity.value) + " * Unit Price = " + parseFloat(this.FormItem.controls.unitPrice.value) + " * factor = " + parseFloat(this.FormItem.controls.factor.value) + " + tax = " + tax)
            this.FormItem.controls.net.setValue(this.roundTo(netValue));
        } else {
            this.FormItem.controls.net.setValue('');
        }
    }

    roundTo(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }
    updatePatientShare() {
        // tslint:disable-next-line:max-line-length
        if (parseFloat(this.FormItem.controls.patientSharePercent.value) && this.FormItem.controls.quantity.value && this.FormItem.controls.unitPrice.value && this.FormItem.controls.factor.value && parseFloat(this.FormItem.controls.factor.value) >= 0 && parseFloat(this.FormItem.controls.factor.value) <= 1) {
            const gross = parseFloat(this.FormItem.controls.quantity.value) * parseFloat(this.FormItem.controls.unitPrice.value);
            const patientSharePercent = this.FormItem.controls.patientSharePercent.value;
            const patientShareAmount = (gross * parseFloat(this.FormItem.controls.factor.value) * parseFloat(patientSharePercent)) / 100;
            this.FormItem.controls.patientShare.setValue(parseFloat(patientShareAmount.toFixed(2)));
        } else {
            this.FormItem.controls.patientShare.setValue(0);
        }
    }

    updatePayerShare() {
        if (this.FormItem.controls.net.value && this.FormItem.controls.patientShare.value) {
            const payerShareAmount = parseFloat(this.FormItem.controls.net.value) - parseFloat(this.FormItem.controls.patientShare.value);
            this.FormItem.controls.payerShare.setValue(parseFloat(payerShareAmount.toFixed(2)));
        } else {
            this.FormItem.controls.payerShare.setValue(0);
        }
    }
    Calculate(value) {

        switch (value) {
            case 'Quantity':
            case 'UitPrice':
                this.updateDiscount();
                this.updateNet();
                break;
            case 'Discount':
                this.updateFactor();
                this.updateNet();
                break;
            case 'Tax':
                this.updateNet();
                break;
            case 'Factor':
                this.updateDiscount();
                this.updateNet();
                break;
            case 'PatientShare':
                this.updatePatientShare();
                this.updatePayerShare();
                break;
        }

    }


    searchItems() {
        if (this.SearchRequest) {
            this.SearchRequest.unsubscribe();
        }

        const itemType = this.FormItem.controls.itemType == null ? null : this.FormItem.controls.itemType.value;
        const searchStr = this.FormItem.controls.searchQuery.value;
        const claimType = this.data.type;
        const RequestDate = this.datePipe.transform(this.data.dateOrdered, 'yyyy-MM-dd');
        const payerNphiesId = this.data.payerNphiesId;
        const tpaNphiesId = this.data.tpaNphiesId != -1 ? this.data.tpaNphiesId : null;

        if (searchStr.length > 2) {
            this.loadSearchItem = true;
            // tslint:disable-next-line:max-line-length
            this.SearchRequest = this.providerNphiesSearchService.getItemList(this.sharedServices.providerId, itemType, searchStr, payerNphiesId, claimType, RequestDate, tpaNphiesId, 0, 150, (this.data.source === 'APPROVAL' ? this.data.source : '')).subscribe(event => {
                if (event instanceof HttpResponse) {
                    if (event.status === 200) {
                        const body = event.body;
                        if (body) {
                            //   this.typeListSearchResult = body['content'];
                            this.typeListSearchResult = body['content'].sort((a, b) => (a.nonStandardCode && b.nonStandardCode && a.nonStandardCode.length < b.nonStandardCode.length ? -1 : 1));
                        }
                        this.loadSearchItem = false;

                    } else if (event.status === 204) {
                        this.loadSearchItem = false;
                        this.typeListSearchResult = [{ display: 'No Matching found' }];
                    }
                }
            }, errorEvent => {
                if (errorEvent instanceof HttpErrorResponse) {
                    this.loadSearchItem = false;
                    this.typeListSearchResult = [{ display: 'No Matching found' }];
                }
            });
        }
    }
    validateDiagnosisInPharmacy() {
        if (this.data.type === "pharmacy" && this.FormItem.controls.type.value.value === 'medication-codes' && this.FormItem.controls.pharmacistSelectionReason.value == null) {
            this.FormItem.controls.pharmacistSelectionReason.setValidators([Validators.required]);
            this.FormItem.controls.pharmacistSelectionReason.updateValueAndValidity();
        } else {
            this.FormItem.controls.pharmacistSelectionReason.clearValidators();
            this.FormItem.controls.pharmacistSelectionReason.updateValueAndValidity();
        }

        //------------------------------------
        if (this.data.type === "pharmacy" && this.FormItem.controls.type.value.value === 'medication-codes' && this.FormItem.controls.prescribedDrugCode.value == null) {
            this.FormItem.controls.prescribedDrugCode.setValidators([Validators.required]);
            this.FormItem.controls.prescribedDrugCode.updateValueAndValidity();
        } else {
            this.FormItem.controls.prescribedDrugCode.clearValidators();
            this.FormItem.controls.prescribedDrugCode.updateValueAndValidity();
        }

        if (this.data.type === "pharmacy" && this.FormItem.controls.diagnosisSequence.value.length == 0 && this.FormItem.controls.type.value.value === 'medication-codes') {

            this.FormItem.controls.diagnosisSequence.setValidators([Validators.required]);
            this.FormItem.controls.diagnosisSequence.updateValueAndValidity();
            this.IsDiagnosisSequenceRequired = true;
            this.diagnosisError = 'Diagnosis is required in this item';
            return false;
        } else {
            this.FormItem.controls.diagnosisSequence.clearValidators();
            this.FormItem.controls.diagnosisSequence.updateValueAndValidity();
            this.IsDiagnosisSequenceRequired = false;
            this.diagnosisError = '';
            return true;
        }
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
                    //console.log("SeqIsThere = " + SeqIsThere);

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
                unitPrice: this.granularUnit != null ? (this.originalPrice / this.granularUnit).toFixed(2) : this.originalPrice,
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
        if (!this.validateDiagnosisInPharmacy()) {
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
            model.itemCode = this.FormItem.controls.item.value.code;
            model.itemDescription = this.FormItem.controls.item.value.description;
            model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
            model.display = this.FormItem.controls.display.value;
            model.isPackage = this.FormItem.controls.isPackage.value;
            model.isDentalBodySite = this.FormItem.controls.isDentalBodySite.value
            if ((!this.FormItem.controls.isDentalBodySite.value && this.data.source === 'CNHI') || this.data.type === 'oral' || (this.data.type === 'institutional' && this.FormItem.controls.type.value.value === 'oral-health-ip')) {
                this.bodySiteList = this.sharedDataService.getBodySite('oral');
                let bodySite = this.bodySiteList.filter(x => x.value === this.FormItem.controls.bodySite.value)[0];
                model.bodySite = this.FormItem.controls.bodySite ? bodySite ? bodySite.value : '' : '';
                model.bodySiteName = this.FormItem.controls.bodySite ? bodySite ? bodySite.name : '' : '';
            } else {
                model.bodySite = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.value : '';
                model.bodySiteName = this.FormItem.controls.bodySite.value ? this.FormItem.controls.bodySite.value.name : '';
            } if (this.data.source === 'CNHI' && !this.FormItem.controls.isDentalBodySite.value) {
                this.subSiteList = this.sharedDataService.getSubSite('oral');
                model.subSite = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.value : '';
                model.subSiteName = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.name : '';
            } else {
                model.subSite = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.value : '';
                model.subSiteName = this.FormItem.controls.subSite.value ? this.FormItem.controls.subSite.value.name : '';
            }

            // tslint:disable-next-line:radix
            model.quantity = parseFloat(this.FormItem.controls.quantity.value);
            model.quantityCode = this.FormItem.controls.quantityCode.value;
            model.unitPrice = parseFloat(this.FormItem.controls.unitPrice.value);
            model.discount = this.FormItem.controls.discount.value ? parseFloat(this.FormItem.controls.discount.value) : 0;
            model.discountPercent = this.FormItem.controls.discountPercent.value ? parseFloat(this.FormItem.controls.discountPercent.value) : 0;
            model.factor = this.FormItem.controls.factor.value;
            model.taxPercent = this.FormItem.controls.taxPercent.value ? parseFloat(this.FormItem.controls.taxPercent.value) : 0;
            // tslint:disable-next-line:max-line-length
            model.patientSharePercent = this.FormItem.controls.patientSharePercent.value ? parseFloat(this.FormItem.controls.patientSharePercent.value) : 0;
            model.tax = this.FormItem.controls.tax.value ? parseFloat(this.FormItem.controls.tax.value) : 0;
            model.net = this.FormItem.controls.net.value;
            model.patientShare = this.FormItem.controls.patientShare.value ? parseFloat(this.FormItem.controls.patientShare.value) : 0;
            model.payerShare = this.FormItem.controls.payerShare.value ? parseFloat(this.FormItem.controls.payerShare.value) : 0;
            model.startDate = this.FormItem.controls.startDate.value; //this.datePipe.transform(this.FormItem.controls.startDate.value, 'yyyy-MM-dd hh:mm aa');
            model.startDateStr = this.datePipe.transform(this.FormItem.controls.startDate.value, 'dd-MM-yyyy hh:mm aa');

            model.endDate = this.FormItem.controls.endDate.value; //this.datePipe.transform(this.FormItem.controls.endDate.value, 'yyyy-MM-dd hh:mm aa');
            model.endDateStr = this.datePipe.transform(this.FormItem.controls.endDate.value, 'dd-MM-yyyy hh:mm aa');


            if (this.FormItem.controls.supportingInfoSequence.value && this.FormItem.controls.supportingInfoSequence.value.length > 0) {
                model.supportingInfoSequence = this.FormItem.controls.supportingInfoSequence.value.map((x) => { return x.sequence });
            }

            if (this.FormItem.controls.careTeamSequence.value && this.FormItem.controls.careTeamSequence.value.length > 0) {
                model.careTeamSequence = this.FormItem.controls.careTeamSequence.value.map((x) => { return x.sequence });
            }

            if (this.FormItem.controls.diagnosisSequence.value && this.FormItem.controls.diagnosisSequence.value.length > 0) {
                model.diagnosisSequence = this.FormItem.controls.diagnosisSequence.value.map((x) => { return x.sequence });
            }

            if (this.data.source === 'CLAIM') {
                model.invoiceNo = this.FormItem.controls.invoiceNo.value;
            }
            model.itemDetails = [];
            if (this.data.type === "pharmacy") {
                model.pharmacistSelectionReason = this.FormItem.controls.pharmacistSelectionReason.value.value;
                model.prescribedDrugCode = this.FormItem.controls.prescribedDrugCode.value.descriptionCode;
                model.pharmacistSelectionReasonName = this.FormItem.controls.pharmacistSelectionReason.value.name;
                model.pharmacistSubstitute = this.FormItem.controls.pharmacistSubstitute.value;
                model.reasonPharmacistSubstitute = this.FormItem.controls.reasonPharmacistSubstitute.value;
            }
            //console.log("item model = " + JSON.stringify(model));
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

    selectTooth(number) {
        //let val=this.bodySiteList.filter(x => x.value === number)[0];
        this.FormItem.controls.bodySite.setValue(number);
        //this.controllers[this.expandedInvoice].services[this.expandedService].toothNumber.setValue(number);
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
