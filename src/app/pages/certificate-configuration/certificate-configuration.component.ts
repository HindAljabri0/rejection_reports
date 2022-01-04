import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
import { changePageTitle } from 'src/app/store/mainStore.actions';
import { CertificateConfigurationModelComponent } from '../certificate-configuration-model/certificate-configuration-model.component';
import { Store } from '@ngrx/store';
import { toEditMode, cancelEdit } from 'src/app/claim-module-components/store/claim.actions';
import { CertificateConfigurationRespnse } from 'src/app/models/certificateConfigurationRespnse';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { ClaimPageMode, getClaim, getPageMode, getPageType } from 'src/app/claim-module-components/store/claim.reducer';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
@Component({
  selector: 'app-certificate-configuration',
  templateUrl: './certificate-configuration.component.html',
  styleUrls: ['./certificate-configuration.component.css']
})
export class CertificateConfigurationComponent implements OnInit {
  providerController: FormControl = new FormControl();
  enterPassword: any;
  filteredProviders: any[] = [];
  providers: any[] = [];
  selectedProvider: string;
  certificateConfigurationProvider = new CertificateConfigurationProvider();
  isFileUploded = false;
  fileName = '';
  fileSize = '';
  currentFileUplod: File;
  closeStatus = false;
  error = '';
  uploadContainerClass = '';
  certificateConfigurationRespnse = new CertificateConfigurationRespnse();
  notEditMode = true;
  isEdit = false;
  // pageMode: ClaimPageMode;
  pageMode = ''
  claim: Claim;
  pageType: string;
  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private settingsService: SettingsService,
    private dialogService: DialogService,
    private superAdmin: SuperAdminService,
    private location: Location,
  ) { }

  ngOnInit() {

    if (!this.currentFileUplod == null && this.certificateConfigurationProvider.password !== null) {

    }
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          this.notEditMode = false;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      console.log(error);
    });
  }


  clearFiles(event) {
    event.target.value = '';
  }
  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
    this.selectedProvider = this.providerController.value === '' ? undefined : this.selectedProvider;
  }
  // close(result?) {
  //   this.dialogRef.close(result != null ? `${result}` : null);
  // }

  upload() {

    if (this.currentFileUplod === undefined) {
      this.error = 'Please upload the one p12 file.';
      return;
    }
    this.error = '';



    this.save();
  }
  save() {

    if (this.certificateConfigurationProvider.password == null || this.certificateConfigurationProvider.password == '' && this.currentFileUplod == null || this.currentFileUplod == undefined) {
      return this.dialogService.openMessageDialog(new MessageDialogData('', 'Please Make Sure Password is ENTER Or File is Uploded', true));
    }
    this.isEdit = false;
    this.settingsService.getSaveCertificateFileToProvider(
      this.selectedProvider,
      this.currentFileUplod,
      this.certificateConfigurationProvider.password

    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.closeStatus = true;
          this.pageMode = 'EDIT';
          this.notEditMode =false ;
          this.isEdit=false;
        
        
          // this.closeDialog();
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


  openP12(event) {
    this.fileSize = this.sharedServices.formatBytes(event.target.files[0].size);
    this.fileName = event.target.files[0].name;
    this.currentFileUplod = event.target.files[0];
    //     if(event.target.files){
    //  let reader =new FileReader();
    //  reader.readAsDataURL(event.target.files[0])
    //  reader.onload=(event:any)=>{
    //    this.currentFileUplod=event.target.result
    //  }

    //     }
    const dialogRefrence = this.dialog.open(CertificateConfigurationModelComponent,
      {
        panelClass: ['primary-dialog'],
        autoFocus: false,
        data: {
          file: event.target.files[0],
          providerId: this.sharedServices.providerId,
          selectedProviderId: this.selectedProvider,
          password: this.certificateConfigurationProvider.password
        }
      });
    dialogRefrence.afterClosed().subscribe(result => {
      if (result) {
        if (!this.checkfile()) {
          event.target.files = [];
          this.currentFileUplod = undefined;
          return;
        }
        else {
          this.isFileUploded = true;


        }

      }


    }, error => {

    });

  }

  reset() {
    this.certificateConfigurationProvider.password = '';
    this.fileName = '';
    this.isFileUploded = false;
    this.currentFileUplod == null;
  }

  selectProvider(providerId: string = null) {
    this.pageMode = 'EDIT';
    if (providerId !== null)
      this.selectedProvider = providerId;

    else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }
    this.reset();
    this.settingsService.getDetails(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200 && event.body != null) {
          this.certificateConfigurationRespnse = event.body as CertificateConfigurationRespnse;



          this.fileName = this.certificateConfigurationRespnse.fileName;
          this.currentFileUplod = this.dataURLtoFile("data:text/plain;base64," + this.certificateConfigurationRespnse.uploadfile, this.fileName);

          this.isFileUploded = true;
          this.certificateConfigurationProvider.password = this.certificateConfigurationRespnse.password;



      


          this.sharedServices.loadingChanged.next(false);
        }

      }
    }, err=>{

      if(err instanceof HttpErrorResponse){
        if(err.status==404){
        this.notEditMode =true ;
        this.isEdit=true;
        this.pageMode = 'save';
      }}

      




    });


  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  showError(error: string) {
    this.currentFileUplod = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.sharedServices.loadingChanged.next(false);
  }
  checkfile() {
    const validExts = new Array('.p12');
    let fileExt = this.fileName;
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

  onEdit() {
    this.isEdit = true;
    this.pageMode = 'save';
    this.notEditMode =true ;

    //this.pageMode == 'EDIT';

  }
  deleteFile() {
    this.currentFileUplod = null;
    this.isFileUploded = false;
  }


}
