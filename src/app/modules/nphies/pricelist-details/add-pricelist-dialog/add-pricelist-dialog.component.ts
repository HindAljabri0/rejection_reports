import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSelect, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-add-pricelist-dialog',
  templateUrl: './add-pricelist-dialog.component.html',
  styleUrls: ['./add-pricelist-dialog.component.css']
})
export class AddPricelistDialogComponent implements OnInit {

  @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
  itemList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);

  FormPriceDetail: FormGroup = this.formBuilder.group({
    serviceType: ['', Validators.required],
    serviceCode: ['', Validators.required],
    nonStandardCode: ['', Validators.required],
    nonStandardDesc: ['', Validators.required],
    unitPrice: ['', Validators.required],
    factor: ['', [Validators.required, Validators.min(0), Validators.max(1)]],
    serviceCodeFilter: ['']
  });

  typeList = this.sharedDataService.itemsTypeList;
  cnhiTypeList = this.sharedDataService.itemcnhiTypeList;
  IsItemLoading = false;
  nphiesId : any;

  onDestroy = new Subject<void>();

  practitionerRoleList = this.sharedDataService.practitionerRoleList;
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddPricelistDialogComponent>,
    private sharedDataService: SharedDataService,
    private sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService,

  ) { }

  ngOnInit() {
    this.nphiesId =this.data.nphiesId;
    if (this.data && this.data.priceDetail) {
      this.FormPriceDetail.patchValue({
        // tslint:disable-next-line:max-line-length
        serviceType: this.nphiesId === '0000000163' ? this.sharedDataService.itemcnhiTypeList.filter(x => x.value === this.data.priceDetail.itemType)[0] ? this.sharedDataService.itemcnhiTypeList.filter(x => x.value === this.data.priceDetail.itemType)[0] : '' : this.sharedDataService.itemsTypeList.filter(x => x.value === this.data.priceDetail.itemType)[0] ? this.sharedDataService.itemsTypeList.filter(x => x.value === this.data.priceDetail.itemType)[0] : '',
        serviceCode: this.data.priceDetail.code,
        nonStandardCode: this.data.priceDetail.nonStandardCode,
        nonStandardDesc: this.data.priceDetail.nonStandardDescription,
        unitPrice: this.data.priceDetail.unitPrice,
        factor: this.data.priceDetail.factor,
      });

      this.FormPriceDetail.controls.serviceType.disable();
      this.FormPriceDetail.controls.serviceCode.disable();
      this.FormPriceDetail.controls.nonStandardCode.disable();
      this.FormPriceDetail.controls.nonStandardDesc.disable();
      this.getItemList();
    }
  }

  typeChange() {
    this.FormPriceDetail.controls.serviceCode.setValue('');
    this.getItemList();
  }

  getItemList() {
    if (this.FormPriceDetail.controls.serviceType.value) {
      this.sharedServices.loadingChanged.next(true);
      this.IsItemLoading = true;
      this.FormPriceDetail.controls.serviceCode.disable();
      // tslint:disable-next-line:max-line-length
      this.providerNphiesSearchService.getCodeDescriptionList(this.sharedServices.providerId, this.FormPriceDetail.controls.serviceType.value.value).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.itemList = event.body;

          if (this.data.priceDetail && this.data.priceDetail.code) {
            this.FormPriceDetail.patchValue({
              serviceCode: this.itemList.filter(x => x.code === this.data.priceDetail.code)[0]
            });
          }
          this.filteredItem.next(this.itemList.slice());
          this.IsItemLoading = false;
          if (!this.data || (this.data && !this.data.priceDetail)) {
            this.FormPriceDetail.controls.serviceCode.enable();
          }
          this.FormPriceDetail.controls.serviceCodeFilter.valueChanges
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
    let search = this.FormPriceDetail.controls.serviceCodeFilter.value;
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

  onSubmit() {

    this.isSubmitted = true;
    if (this.FormPriceDetail.valid) {

      const model: any = {};

      model.serviceType = this.FormPriceDetail.controls.serviceType.value.value;
      model.serviceCode = this.FormPriceDetail.controls.serviceCode.value.code;
      model.nonStandardCode = this.FormPriceDetail.controls.nonStandardCode.value;
      model.nonStandardDesc = this.FormPriceDetail.controls.nonStandardDesc.value;
      model.unitPrice = this.FormPriceDetail.controls.unitPrice.value;
      model.factor = this.FormPriceDetail.controls.factor.value;

      this.sharedServices.loadingChanged.next(true);

      let action: any;

      if (this.data && this.data.priceDetail) {
        action = this.nphiesConfigurationService.updatePriceDetail(this.sharedServices.providerId, this.data.priceListId, model);
      } else {
        action = this.nphiesConfigurationService.addPriceDetail(this.sharedServices.providerId, this.data.priceListId, model);
      }
      // tslint:disable-next-line:max-line-length
      action.subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
          }

          this.sharedServices.loadingChanged.next(false);
          this.dialogRef.close(true);
        }

      }, error => {
        this.sharedServices.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 500) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
        }
      });
    }
  }



  closeDialog() {
    this.dialogRef.close();
  }


}
