import { Component, OnInit, Inject, ViewChild,ElementRef, Renderer2} from '@angular/core';
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
  // tslint:disable-next-line:max-line-length
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredSupportingInfo: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredCareTeam: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredPescribedMedicationItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  medicationReasonList = this.sharedDataService.itemMedicationReasonList;
  pharmacySubstituteList = this.sharedDataService.pharmacySubstituteList;
  IsItemLoading = false;
  showTextInput = false;
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
    pharmacistSelectionReason: ['',Validators.required],
    prescribedDrugCode: ['',Validators.required],
    reasonPharmacistSubSitute: [''],
    pharmacistSubstitute:['']
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
      this.FormItem.patchValue({
        type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === this.data.item.type)[0] : this.typeList.filter(x => x.value === this.data.item.type)[0],
            nonStandardCode: this.data.item.nonStandardCode,
        display: this.data.item.display,
      });


      this.getItemList();
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
    this.FormItem.controls.item.disable();
    // tslint:disable-next-line:max-line-length
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
        type: this.data.source === 'CNHI' ? this.cnhiTypeList.filter(x => x.value === this.data.item.type)[0] : this.typeList.filter(x => x.value === this.data.item.type)[0],
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
      model.itemCode = this.FormItem.controls.item.value.code;
      model.itemDescription = this.FormItem.controls.item.value.description;
      model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
      model.display = this.FormItem.controls.display.value;
      model.quantity = parseFloat(this.FormItem.controls.quantity.value);
      model.quantityCode = this.FormItem.controls.quantityCode.value;
      model.pharmacistSelectionReason = this.FormItem.controls.pharmacistSelectionReason.value;
      model.prescribedDrugCode = this.FormItem.controls.prescribedDrugCode.value;
      model.reasonPharmacistSubSitute = this.FormItem.controls.reasonPharmacistSubSitute.value;
      model.pharmacistSubstitute = this.FormItem.controls.pharmacistSubstitute.value;
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
