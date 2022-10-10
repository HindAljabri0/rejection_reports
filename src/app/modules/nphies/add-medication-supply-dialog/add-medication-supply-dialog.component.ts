import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelect, MAT_DIALOG_DATA } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-add-medication-supply-dialog',
  templateUrl: './add-medication-supply-dialog.component.html',
  styleUrls: []
})

export class AddMedicationSupplyDialogComponent implements OnInit {
  
  FormItem: FormGroup = this.formBuilder.group({
    listId: [''],
    standardCode: ['', Validators.required],
    service: ['', Validators.required],
    standardDesc: ['', Validators.required],
    daysOfSupply: ['', Validators.required],
    providerId: ['', Validators.required],
    itemFilter: ['']
  });
  
  IsItemLoading = false;
  @ViewChild('itemSelect', { static: true }) itemSelect: MatSelect;
  itemList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredItem: ReplaySubject<any> = new ReplaySubject<any[]>(1);

  onDestroy = new Subject<void>();
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddMedicationSupplyDialogComponent>,
    private sharedDataService: SharedDataService,
    private common: SharedServices,
    private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.FormItem.patchValue({
      providerId: this.common.providerId
    });
    //console.log("data = "+JSON.stringify(this.data));
    if (this.data && this.data.item) {
      this.FormItem.patchValue({
        listId: this.data.item.listId,
        standardCode: this.data.item.standardCode,
        standardDesc: this.data.item.standardDesc,
        daysOfSupply: this.data.item.daysOfSupply,
      });
    }
    this.getStandardCodeList();
  }

  getStandardCodeList() {
    
      this.common.loadingChanged.next(true);
      this.IsItemLoading = true;
      this.FormItem.controls.service.disable();
      // tslint:disable-next-line:max-line-length
      this.providerNphiesSearchService.getCodeDescriptionList(this.common.providerId, "medication-codes").subscribe(event => {
        if (event instanceof HttpResponse) {
          this.itemList = event.body;
          
          if (this.data.item && this.data.item.standardCode) {
            let service= this.itemList.filter(x => x.code === this.data.item.standardCode)[0]
            this.FormItem.patchValue({
              service:service,
              standardCode: this.data.item.standardCode,
              standardDesc : this.data.item.standardDesc
            });
          } 
          this.filteredItem.next(this.itemList.slice());
          this.IsItemLoading = false;
          this.FormItem.controls.service.enable();
          this.FormItem.controls.itemFilter.valueChanges
            .pipe(takeUntil(this.onDestroy))
            .subscribe(() => {
              this.filterItem();
            });
          this.common.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
        }
      });
    
  }
  itemchange(){
    let service= this.itemList.filter(x => x.code === this.FormItem.controls.service.value.code)[0]
    this.FormItem.patchValue({
      standardCode: service.code,
      standardDesc : service.description
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
  get IsInvalidNumber() {
    //console.log("pattern test = "+pattern.test(parseFloat(this.FormItem.controls.daysOfSupply.value).toString()));
    return this.FormItem.controls.daysOfSupply.value < 0;
  }
onSubmit() {
  
    this.isSubmitted = true;
    console.log(this.FormItem.value);
    
    if (this.FormItem.valid) {
      /*console.log("value="+this.IsInvalidNumber);
      if(!this.IsInvalidNumber){
        return;
      }*/
      //console.log("on submit form valid");
      const model = this.FormItem.value;
      
      delete model.filteredItem;
      delete model.service;
      this.common.loadingChanged.next(true);

      if (this.data && this.data.item) {
        model.listId = this.data.item.listId;
      }else{
        model.listId = 0;
      }

      this.nphiesConfigurationService.addUpdateSingleMedicationSupply(this.common.providerId, model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;

            if (body.errormessage && body.errormessage.length > 0) {
              if (this.data && this.data.item) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error', `${body.errormessage.join('<br>')}`, 'alert', true, 'OK');
              } else {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error:', `${body.errormessage.join('<br>')}`, 'alert', true, 'OK');
              }
            } else {
              if (this.data && this.data.item) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Success', 'Record Updated Successfully', 'success', true, 'OK');
              } else {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Success', 'Record Added Successfully', 'success', true, 'OK');
              }

            }
          }

          this.common.loadingChanged.next(false);
          this.dialogRef.close(true);
        }

      }, error => {
        this.common.loadingChanged.next(false);
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
