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
  selector: 'app-add-edit-item-details-modal',
  templateUrl: './add-edit-item-details-modal.component.html',
  styles: []
})
export class AddEditItemDetailsModalComponent implements OnInit {

  @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
  itemList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredSupportingInfo: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredCareTeam: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  filteredDiagnosis: ReplaySubject<any> = new ReplaySubject<any[]>(1);
  IsItemLoading = false;

  onDestroy = new Subject<void>();

  FormItem: FormGroup = this.formBuilder.group({
    type: ['', Validators.required],
    item: ['', Validators.required],
    itemFilter: [''],
    nonStandardCode: [''],
    display: [''],
    quantity: ['1']
  });

  isSubmitted = false;

  typeList = this.sharedDataService.itemTypeList;

  today: Date;
  constructor(
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<AddEditItemDetailsModalComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe,
    private sharedServices: SharedServices, private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.today = new Date();
  }

  ngOnInit() {

    if (this.data.type) {
      this.setTypes(this.data.type);
    }

    if (this.data.item && this.data.item.itemCode) {
      this.FormItem.patchValue({
        type: this.typeList.filter(x => x.value === this.data.item.type)[0],
        nonStandardCode: this.data.item.nonStandardCode,
        display: this.data.item.display,
      });


      this.getItemList();
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

  getItemList() {
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
      this.itemList.filter(item => item.description.toLowerCase().indexOf(search) > -1 || item.code.toString().toLowerCase().indexOf(search) > -1)
    );
  }


  onSubmit() {
    this.isSubmitted = true;
    if (this.FormItem.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.type = this.FormItem.controls.type.value.value;
      model.typeName = this.FormItem.controls.type.value.name;
      model.itemCode = this.FormItem.controls.item.value.code;
      model.itemDescription = this.FormItem.controls.item.value.description;
      model.nonStandardCode = this.FormItem.controls.nonStandardCode.value;
      model.display = this.FormItem.controls.display.value;
      model.quantity = this.FormItem.controls.quantity.value;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
