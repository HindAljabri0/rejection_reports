import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { PaymentProviderModel } from 'src/app/models/PaymentProviderModel';
import * as moment from 'moment';
import { parse } from 'querystring';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
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
  isPayerSelected: boolean = true;
  addOrEditContractLabel = "Add";
  isProviderDisabled: boolean = true;
  closeStatus: boolean = false;
  isPromptPayment: boolean = true;
  constructor(private dialogRef: MatDialogRef<AddProviderContractDialogComponent>, private sharedServices: SharedServices, private superAdmin: SuperAdminService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService) { }

  ngOnInit() {
    this.getProvidersData();
  }
  getProvidersData() {
    this.providers = this.data.providers;
    this.filteredProviders = this.providers;
    if (this.data.isEditData) {
      this.addOrEditContractLabel = "Edit";
      this.selectedProvider = this.data.editData.providerId;
      const providerData = this.providers.find((ele) => ele.switchAccountId === parseInt(this.data.editData.providerId));
      const selectedProviderValue = providerData.switchAccountId + ' | ' + providerData.code + ' | ' + providerData.name;
      this.providerController.patchValue(selectedProviderValue);
      this.paymentProviderContractModel.effectiveDate = moment(this.data.editData.effectiveDate, 'YYYY-MM-DD').toDate();
      this.paymentProviderContractModel.expiryDate = moment(this.data.editData.expiryDate, 'YYYY-MM-DD').toDate();
      this.paymentProviderContractModel.modePayment = this.data.editData.modeOfPayment;
      this.paymentProviderContractModel.payerid = null;
      this.isPromptPayment = this.paymentProviderContractModel.modePayment === 'Prompt Payment' ? true : false;
      this.paymentProviderContractModel.numberOfDays = this.data.editData.numberOfDays;
      const fileBlob = this.sharedServices.dataURItoBlob(this.data.editData.agreementCopy, 'application/pdf');
      const expiryDate = moment(this.data.editData.expiryDate).format('DD-MM-YYYY');
      const effectiveDate = moment(this.data.editData.effectiveDate).format('DD-MM-YYYY');
      this.currentFileUpload = new File([fileBlob], this.data.editData.providerId + '_' + this.data.editData.payerName + '_' + effectiveDate + '_' + expiryDate + '.pdf', { type: 'application/pdf' });
      this.paymentProviderContractModel.agreementCopy = this.data.editData.agreementCopy;
      this.fileUploadFlag = true;
      this.getAssociatedPayers();
    }
    else {
      this.paymentProviderContractModel = new PaymentProviderModel();
      this.fileUploadFlag = false;
      this.selectedProvider = this.data.selectedProvider;
      const providerData = this.providers.find((ele) => ele.switchAccountId === parseInt(this.data.selectedProvider));
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
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
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
    const expiryDate = moment(this.paymentProviderContractModel.expiryDate).format('YYYY-MM-DD');
    const effectiveDate = moment(this.paymentProviderContractModel.effectiveDate).format('YYYY-MM-DD');
    const providerContractObjdata = {
      effectiveDate: effectiveDate,
      expiryDate: expiryDate,
      payerid: this.paymentProviderContractModel.payerid,
      modePayment: this.paymentProviderContractModel.modePayment,
      numberOfDays: this.paymentProviderContractModel.numberOfDays,
      agreementCopy: this.paymentProviderContractModel.agreementCopy

    }
    if (this.data.isEditData)
      this.updateProviderContactDetails(providerContractObjdata, this.data.editData.contractId);
    else
      this.saveProviderContactDetails(providerContractObjdata);

  }
  updateProviderContactDetails(providerContractObjdata: any, editId: string) {
    this.superAdmin.updatePayerPaymentContractDetailsData(this.selectedProvider, this.currentFileUpload, providerContractObjdata, editId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', "Your data has been updated successfully", false));
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
    this.superAdmin.addPayerPaymentContractDetailsData(this.selectedProvider, this.currentFileUpload, providerContractObjdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', "Your data has been saved successfully", false));
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
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.associatedPayers = event.body;
          this.isProviderDisabled = false;
          if (this.data.isEditData) {
            this.isPayerSelected = false;
            this.paymentProviderContractModel.payerid = parseInt(this.data.editData.payerId);
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
    });
  }
  payerSelection(event) {
    if (event.value !== '')
      this.isPayerSelected = false;
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
