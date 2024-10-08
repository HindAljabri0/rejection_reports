import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { PaymentProviderModel } from 'src/app/models/PaymentProviderModel';
import * as moment from 'moment';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
@Component({
  selector: 'app-add-provider-contract-dialog',
  templateUrl: './add-provider-contract-dialog.component.html',
  styles: []
})
export class AddProviderContractDialogComponent implements OnInit {
  fileUploadFlag = false;
  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl('', [Validators.required]);
  selectedProvider: string;
  errors: string;
  associatedPayers: any[] = [];
  paymentProviderContractModel = new PaymentProviderModel();
  currentFileUpload: File;
  sizeInMB: string;
  uploadContainerClass = '';
  error = '';
  isPayerSelected = true;
  addOrEditContractLabel = 'Add';
  isProviderDisabled = true;
  closeStatus = false;
  isPromptPayment = true;
  preIsActive: any;
  constructor(
    private dialogRef: MatDialogRef<AddProviderContractDialogComponent>,
    private sharedServices: SharedServices,
    private superAdmin: SuperAdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private dbMappingService: DbMappingService
  ) { }

  ngOnInit() {
    this.getProvidersData();
  }
  getProvidersData() {
    this.providers = this.data.providers;
    this.filteredProviders = this.providers;
    if (this.data.isEditData) {
      this.addOrEditContractLabel = 'Edit';
      this.selectedProvider = this.data.editData.providerId;
      const providerData = this.providers.find((ele) => ele.switchAccountId === parseInt(this.data.editData.providerId, 10));
      const selectedProviderValue = providerData.switchAccountId + ' | ' + providerData.code + ' | ' + providerData.name;
      this.providerController.patchValue(selectedProviderValue);
      this.paymentProviderContractModel.effectiveDate = moment(this.data.editData.effectiveDate, 'YYYY-MM-DD').toDate();
      this.paymentProviderContractModel.expiryDate = moment(this.data.editData.expiryDate, 'YYYY-MM-DD').toDate();
      this.paymentProviderContractModel.modePayment = this.data.editData.modeOfPayment;
      this.paymentProviderContractModel.payerid = null;
      this.isPromptPayment = this.paymentProviderContractModel.modePayment === 'Prompt Payment' ? true : false;
      this.paymentProviderContractModel.numberOfDays = this.data.editData.numberOfDays;
      const expiryDate = moment(this.data.editData.expiryDate).format('DD-MM-YYYY');
      const effectiveDate = moment(this.data.editData.effectiveDate).format('DD-MM-YYYY');
      // this.currentFileUpload = new File([fileBlob],
      //   this.data.editData.providerId + '_' + this.data.editData.payerName + '_' + effectiveDate + '_' + expiryDate + '.pdf',
      //   { type: 'application/pdf' });

      if (this.data.editData.agreementCopy) {
        this.fileUploadFlag = true;
        this.paymentProviderContractModel.agreementCopy = this.data.editData.agreementCopy;
        const fileBlob = this.sharedServices.dataURItoBlob(this.data.editData.agreementCopy, 'application/pdf');
        this.currentFileUpload = new File([fileBlob],
          this.data.editData.fileName,
          { type: 'application/pdf' });
      }

      this.paymentProviderContractModel.isActive = this.data.editData.isActive;
      this.associatedPayers = this.data.associatedPayers;
      this.isProviderDisabled = false;
      this.isPayerSelected = false;
      this.paymentProviderContractModel.payerid = parseInt(this.data.editData.payerId, 10);
      this.preIsActive = this.data.editData.isActive;
    } else {
      this.paymentProviderContractModel = new PaymentProviderModel();
      this.fileUploadFlag = false;
      this.selectedProvider = this.data.selectedProvider;
      const providerData = this.providers.find((ele) => ele.switchAccountId === parseInt(this.data.selectedProvider, 10));
      const selectedProviderValue = providerData.switchAccountId + ' | ' + providerData.code + ' | ' + providerData.name;
      this.providerController.patchValue(selectedProviderValue);
      this.getAssociatedPayers();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  selectFile(event) {
    this.fileUploadFlag = true;
    this.currentFileUpload = event.target.files[0];
    this.sizeInMB = this.sharedServices.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      event.target.files = [];
      this.currentFileUpload = undefined;
      return;
    }
  }

  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.sharedServices.loadingChanged.next(false);
  }


  checkfile() {
    const validExts = ['.pdf'];
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.showError('Invalid file selected, valid files are of ' +
        validExts.toString() + ' types.');
      return false;
    } else {
      this.uploadContainerClass = '';
      this.error = '';
      return true;
    }
  }

  get isLoading() {
    return this.sharedServices.loading;
  }
  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase()
        .includes(this.providerController.value.toLowerCase())
    );
  }
  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.isProviderDisabled = true;
    this.isPayerSelected = true;
    this.getAssociatedPayers();
  }
  submit() {
    this.sharedServices.loadingChanged.next(true);
    this.closeStatus = false;

    let expiryDate = '';
    if (this.paymentProviderContractModel.expiryDate) {
      expiryDate = moment(this.paymentProviderContractModel.expiryDate).format('YYYY-MM-DD');
    }

    let effectiveDate = '';
    if (this.paymentProviderContractModel.effectiveDate) {
      effectiveDate = moment(this.paymentProviderContractModel.effectiveDate).format('YYYY-MM-DD');
    }

    const providerContractObjdata = {
      effectiveDate,
      expiryDate,
      payerid: this.paymentProviderContractModel.payerid,
      modePayment: this.paymentProviderContractModel.modePayment,
      numberOfDays: this.paymentProviderContractModel.numberOfDays === undefined || this.paymentProviderContractModel.numberOfDays === null || this.paymentProviderContractModel.numberOfDays === '' ? 0 : this.paymentProviderContractModel.numberOfDays,
      agreementCopy: this.paymentProviderContractModel.agreementCopy,
      isActive: this.paymentProviderContractModel.isActive

    };
    if (this.data.isEditData) {
      if (this.preIsActive !== this.paymentProviderContractModel.isActive) {
        const msg = this.paymentProviderContractModel.isActive === '1' ? 'activate' : 'deactivate';
        const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
          panelClass: ['primary-dialog'],
          disableClose: true,
          autoFocus: false,
          data: {
            mainMessage: 'Are you sure you want to ' + msg + ' this contract?',
            subMessage: this.paymentProviderContractModel.isActive === '1' ? 'Other contract between this provider and payer will be deactivated' : '',
            mode: 'alert'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.updateProviderContactDetails(providerContractObjdata, this.data.editData.contractId);
          }
        }, error => { });
      } else {
        this.updateProviderContactDetails(providerContractObjdata, this.data.editData.contractId);
      }

    } else {
      this.saveProviderContactDetails(providerContractObjdata);
    }

  }
  updateProviderContactDetails(providerContractObjdata: any, editId: string) {
    this.superAdmin.updatePayerPaymentContractDetailsData(
      this.selectedProvider,
      this.currentFileUpload,
      providerContractObjdata,
      editId).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been updated successfully', false));
            this.closeStatus = true;
            this.closeDialog();
          }

          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
        if (err instanceof HttpErrorResponse) {
          this.sharedServices.loadingChanged.next(false);
          this.closeStatus = false;
          this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
        }
      });
  }
  saveProviderContactDetails(providerContractObjdata: any) {
    this.superAdmin.addPayerPaymentContractDetailsData(
      this.selectedProvider,
      this.currentFileUpload,
      providerContractObjdata
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.closeDialog();
          this.closeStatus = true;
          this.closeDialog();
        }

        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        this.closeStatus = false;
        this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
      }
    });
  }
  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') { return; }
    this.sharedServices.loadingChanged.next(true);
    this.dbMappingService.getPayerMapping(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        // this.sharedServices.loadingChanged.next(false);
        this.associatedPayers = event.body['mappingList'];
        this.associatedPayers = this.associatedPayers.filter(x => x.enabled === true);
         // enabled: true
          // mappingName: "TCS"
          // payerId: 313
          // payerName: "TCS"
          // providerId: "601"

        this.isProviderDisabled = false;
        if (this.data.isEditData) {
          this.isPayerSelected = false;
          this.paymentProviderContractModel.payerid = parseInt(this.data.editData.payerId, 10);
        }
      }
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
    });

    // this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
    //   if (event instanceof HttpResponse) {
    //     if (event.body instanceof Array) {
    //       this.associatedPayers = event.body;
    //       this.isProviderDisabled = false;
    //       if (this.data.isEditData) {
    //         this.isPayerSelected = false;
    //         this.paymentProviderContractModel.payerid = parseInt(this.data.editData.payerId, 10);
    //       }
    //     }
    //     this.sharedServices.loadingChanged.next(false);
    //   }
    // }, err => {
    //   this.sharedServices.loadingChanged.next(false);
    // });
  }
  payerSelection(event) {
    if (event.value !== '') {
      this.isPayerSelected = false;
    }
  }
  deleteFile() {
    this.currentFileUpload = null;
    this.paymentProviderContractModel.agreementCopy = null;
    this.fileUploadFlag = false;
  }
  modeOfPayment() {
    this.isPromptPayment = this.paymentProviderContractModel.modePayment === 'Prompt Payment' ? true : false;
  }

}
