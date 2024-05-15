import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
    selector: 'app-add-edit-item-details-modal',
    templateUrl: './add-edit-item-details-modal.component.html',
    styles: []
})
export class AddEditItemDetailsModalComponent implements OnInit {
    @ViewChild('reasonSelect', { static: true }) reasonSelect: ElementRef;
    @ViewChild('otherInput', { static: true }) otherInput: ElementRef;
    @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
    itemList: any = [];
    itemListFiltered: any = [];
    // tslint:disable-next-line:max-line-length
    filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredSupportingInfo: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredCareTeam: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredPescribedMedicationItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    medicationReasonList = this.sharedDataService.itemMedicationReasonList;
    pharmacySubstituteList = this.sharedDataService.pharmacySubstituteList;
    prescribedMedicationList: any;
    IsItemLoading = false;
    showTextInput = false;
    showEBPfeilds = false;
    otherReason = '';
    onDestroy = new Subject<void>();

    FormItem: FormGroup = this.formBuilder.group({
        type: ['', Validators.required],
        item: ['', Validators.required],
        itemFilter: [''],
        nonStandardCode: [''],
        display: [''],
        quantity: ['1'],
        quantityCode: [''],
        searchQuery: [''],
        prescribedMedicationItemFilter: [''],
        pharmacistSelectionReason: [''],
        prescribedDrugCode: [''],
        reasonPharmacistSubstitute: [''],
        pharmacistSubstitute: ['']
    });

    isSubmitted = false;
    typeListSearchResult = [];

    typeList = this.sharedDataService.itemTypeList;
    cnhiTypeList: { value: string; name: string; }[];

    today: Date;
    renderer: any;
    constructor(
        private sharedDataService: SharedDataService,
        private dialogRef: MatDialogRef<AddEditItemDetailsModalComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
        private sharedServices: SharedServices, private formBuilder: FormBuilder,
        private providerNphiesSearchService: ProviderNphiesSearchService) {
        this.today = new Date();
    }

    ngOnInit() {

        this.cnhiTypeList = [{ value: 'moh-category', name: 'MOH Billing Codes' }];

        if (this.data.type) {
            this.setTypes(this.data.type);
        }

        if (this.data.item && this.data.item.itemCode) {
            this.showEBPfeilds = this.data.type === "pharmacy" && this.data.item.type === "medication-codes";
            this.FormItem.patchValue({
                type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === this.data.item.type)[0] : this.typeList.filter(x => x.value === this.data.item.type)[0],
                nonStandardCode: this.data.item.nonStandardCode,
                display: this.data.item.display,
                pharmacistSelectionReason: this.data.item.pharmacistSelectionReason,
                pharmacistSubstitute: this.data.item.pharmacistSubstitute,
                reasonPharmacistSubstitute: this.data.item.reasonPharmacistSubstitute,
            });


            this.getItemList();
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
                                    prescribedDrugCode: res,
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
                break;
            case 'pharmacy':
                this.typeList = [
                    { value: 'medical-devices', name: 'Medical Devices' },
                    { value: 'medication-codes', name: 'Medication Codes' }
                ];
                break;
        }
    }

    getItemList(type = null) {
        this.IsItemLoading = true;
        this.sharedServices.loadingChanged.next(true);
        this.FormItem.controls.item.disable();
        if(this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes'){
            this.showEBPfeilds = true;
        }else{
            this.showEBPfeilds = false;
        }
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormItem.controls.type.value.value).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.itemList = event.body;
                if (this.data.item && this.data.item.itemCode) {
                    this.FormItem.patchValue({
                        item: this.itemList.filter(x => x.code === this.data.item.itemCode)[0]
                    });
                    this.sharedServices.loadingChanged.next(false);
                } else {
                    if (type) {
                        this.FormItem.patchValue({
                            item: this.itemList.filter(x => x.code === type.code)[0]
                        });
                        this.sharedServices.loadingChanged.next(false);
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
                    
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                console.log(error);
            }
        });
        this.sharedServices.loadingChanged.next(false);
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
            // tslint:disable-next-line:max-line-length
            this.itemList.filter(item => item.description.toLowerCase().indexOf(search) > -1 || item.code.toString().toLowerCase().indexOf(search) > -1)
        );
    }

    searchItems() {
        const itemType = this.FormItem.controls.itemType == null ? null : this.FormItem.controls.itemType.value;
        const searchStr = this.FormItem.controls.searchQuery.value;
        const claimType = this.data.type;
        const RequestDate = this.datePipe.transform(this.data.dateOrdered, 'yyyy-MM-dd');
        const payerNphiesId = this.data.payerNphiesId;
        const tpaNphiesId = this.data.tpaNphiesId;

        if (searchStr.length > 2) {
            // tslint:disable-next-line:max-line-length
            this.providerNphiesSearchService.getItemList(this.sharedServices.providerId, itemType, searchStr, payerNphiesId, claimType, RequestDate, tpaNphiesId, 0, 10).subscribe(event => {
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    this.typeListSearchResult = body['content'];
                }
            }, errorEvent => {
                if (errorEvent instanceof HttpErrorResponse) {

                }
            });
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
        if (this.data.type === "pharmacy") {
            //this.itemList.filter(x => x.code === this.data.item.itemCode)[0];
            this.filteredPescribedMedicationItem.next(this.prescribedMedicationList);
            const res = this.prescribedMedicationList.filter(x => x.gtinNumber === gtinNumber)[0];
            if (res != undefined) {
                this.FormItem.patchValue({
                    prescribedDrugCode: res,
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

    selectItem(type) {
        if (type) {
            console.log("OOO "   +JSON.stringify(this.data))
            console.log("this.typeList "   +JSON.stringify(this.typeList))
            console.log("this.cnhiTypeList "   +JSON.stringify(this.cnhiTypeList))
            console.log("this.itemType "   +JSON.stringify(type.itemType))
            this.FormItem.patchValue({
                type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === type.itemType)[0] : this.typeList.filter(x => x.value === type.itemType)[0],
                nonStandardCode: type.nonStandardCode,
                display: type.nonStandardDescription,
                unitPrice: type.unitPrice,
                discount: type.discount,
                pharmacistSelectionReason:this.data.type === 'pharmacy' ?this.medicationReasonList.filter(x => x.value === this.data.item.pharmacistSelectionReason)[0] ? this.medicationReasonList.filter(x => x.value === this.data.item.pharmacistSelectionReason)[0] : '':'',
                pharmacistSubstitute: this.data.type === 'pharmacy' ?this.data.item.pharmacistSubstitute:'',
                reasonPharmacistSubstitute: this.data.type === 'pharmacy' ?this.data.item.reasonPharmacistSubstitute:'',
            });
            if (type.itemType && type.itemType === 'medication-codes') {
                this.showEBPfeilds = true;
            } else {
                this.showEBPfeilds = false;
            }
            this.getItemList(type);
        }
    }
    validateCodesInPharmacy() {
        if (this.data.type === "pharmacy" && this.FormItem.controls.pharmacistSelectionReason.value == null) {
            this.FormItem.controls.pharmacistSelectionReason.setValidators([Validators.required]);
            this.FormItem.controls.pharmacistSelectionReason.updateValueAndValidity();
            return false;
        } else {
            this.FormItem.controls.pharmacistSelectionReason.clearValidators();
            this.FormItem.controls.pharmacistSelectionReason.updateValueAndValidity();
        }
        //------------------------------------
        if (this.data.type === "pharmacy" && this.FormItem.controls.prescribedDrugCode.value == null) {
            this.FormItem.controls.prescribedDrugCode.setValidators([Validators.required]);
            this.FormItem.controls.prescribedDrugCode.updateValueAndValidity();
            return false;
        }else{

            this.FormItem.controls.prescribedDrugCode.clearValidators();
            this.FormItem.controls.prescribedDrugCode.updateValueAndValidity();
        }
        return true;

    }
    onSubmit() {
        this.isSubmitted = true;
        if (!this.validateCodesInPharmacy()) {
            return;
        }
        if (this.FormItem.valid) {

            const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

            if (!pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString())) {
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
            model.quantity = parseFloat(this.FormItem.controls.quantity.value);
            model.quantityCode = this.FormItem.controls.quantityCode.value;
            model.itemDetails = [];
            if (this.data.type === "pharmacy") {
                model.pharmacistSelectionReason = this.FormItem.controls.pharmacistSelectionReason.value;
                model.prescribedDrugCode = this.FormItem.controls.prescribedDrugCode.value.descriptionCode;
                model.pharmacistSelectionReasonName = this.FormItem.controls.pharmacistSelectionReason.value;
                model.reasonPharmacistSubstitute = this.FormItem.controls.reasonPharmacistSubstitute.value;
                model.pharmacistSubstitute = this.FormItem.controls.pharmacistSubstitute.value;
            }
            this.dialogRef.close(model);
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

}
