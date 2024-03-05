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
    selector: 'app-add-edit-item-details-prescription',
    templateUrl: './add-edit-item-details-prescription.component.html',
    styleUrls: ['./add-edit-item-details-prescription.component.css'],
})
export class AddEditItemDetailsPrescriptionComponent implements OnInit {

    @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
    itemList: any = [];
    // tslint:disable-next-line:max-line-length
    filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    filteredPescribedMedicationItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
    IsItemLoading = false;

    onDestroy = new Subject<void>();

    FormItem: FormGroup = this.formBuilder.group({
        type: ['', Validators.required],
        item: ['', Validators.required],
        itemFilter: [''],
        prescribedMedicationItemFilter: [''],
        // itemCode: [''],
        // itemDescription: [''],
        nonStandardCode: [''],
        display: [''],
        absenceScientificCode: [],
        strength: ['', Validators.required],
        quantity: ['', Validators.required],
        quantityCode: [''],
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
    constructor(
        private sharedDataService: SharedDataService,
        private dialogRef: MatDialogRef<AddEditItemDetailsPrescriptionComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
        private sharedServices: SharedServices, private formBuilder: FormBuilder,
        private providerNphiesSearchService: ProviderNphiesSearchService) {
        this.today = new Date();
    }

    ngOnInit() {
        this.prescribedCode = [{ value: 'scientific-codes', name: 'Scientific Code' },
        { value: 'medication-codes', name: 'GTIN Code' }];

        this.FormItem.controls.quantityCode.setValue('{package}');
        this.FormItem.controls.quantityCode.disable();
        if (this.data.item && this.data.item.code) {
            this.FormItem.patchValue({
                type: this.prescribedCode.filter(x => x.value === this.data.item.type)[0],
                description: this.itemList.filter(x => x.code === this.data.item.code)[0],
                code: this.itemList.filter(x => x.code === this.data.item.code)[0],
                nonStandardCode: this.data.item.nonStandardCode,
                display: this.data.item.display,
                quantity: this.data.item.quantity,
                quantityCode: this.data.item.quantityCode != null ? this.data.item.quantityCode : "",
                strength: this.data.item.strength,
                absenceScientificCode: (this.absenceReasonList.filter(x => x.value === this.data.item.absenceScientificCode).length > 0 ? this.absenceReasonList.filter(x => x.value === this.data.item.absenceScientificCode)[0] : "")

            });

            if (this.data.item.type === 'scientific-codes') {
                this.FormItem.controls.type.setValue(this.prescribedCode.filter(x => x.value === 'scientific-codes')[0]);
                this.typeChange('scientific-codes');
            }
            this.getItemList();
        } else {
            this.FormItem.controls.type.setValue(this.prescribedCode.filter(x => x.value === 'scientific-codes')[0]);
            this.typeChange('scientific-codes');
        }

    }

    get IsQuantityCodeRequired() {
        if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {
            return true;
        } else {
            return false;
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
        if (this.FormItem.controls.type.value && this.FormItem.controls.type.value.value === 'medication-codes') {

            this.getItemList(type);
        }
        this.FormItem.controls.item.setValue('');

    }

    setPrescribedMedication(gtinNumber: any) {
        const filteredData = this.itemList.filter((item) => item.code === gtinNumber);


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

    getItemList(type = null) {
        this.IsItemLoading = true;
        this.FormItem.controls.item.disable();
        // tslint:disable-next-line:max-line-length
        this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormItem.controls.type.value.value).subscribe(event => {
            if (event instanceof HttpResponse) {
                this.itemList = event.body;
                if (this.data.item && this.data.item.code) {
                    this.FormItem.patchValue({
                        item: this.itemList.filter(x => x.code === this.data.item.code)[0]
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
            }
        }, error => {
            if (error instanceof HttpErrorResponse) {
                console.log(error);
            }
        });
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
        const RequestDate = this.data.dateOrdered;
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

    selectItem(type) {
        if (type) {
            this.FormItem.patchValue({
                type: this.typeList.filter(x => x.value === type.itemType)[0],
                nonStandardCode: type.nonStandardCode,
                display: type.nonStandardDescription,
                unitPrice: type.unitPrice,
                discount: type.discount,
            });
            this.getItemList(type);
        }
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.FormItem.valid) {

            const pattern = /(^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)/;

            if (!pattern.test(parseFloat(this.FormItem.controls.quantity.value).toString())) {
                return;
            }

            const model: any = {};
            model.sequence = this.data.Sequence;
            model.type = this.FormItem.controls.type.value.value;
            model.typeName = this.FormItem.controls.type.value.name;
            model.code = this.FormItem.controls.item.value.code;
            model.description = this.FormItem.controls.item.value.description;
            model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
            model.strength = this.FormItem.controls.strength.value;
            model.quantity = parseFloat(this.FormItem.controls.quantity.value);
            model.quantityCode = this.FormItem.controls.quantityCode.value;

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
