import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
import { CertificateConfigurationModelComponent } from '../certificate-configuration-model/certificate-configuration-model.component';
import { Store } from '@ngrx/store';
import { toEditMode, cancelEdit } from 'src/app/claim-module-components/store/claim.actions';
import { CertificateConfigurationRespnse } from 'src/app/models/certificateConfigurationRespnse';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
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
  store: any;
  certificateConfigurationRespnse =new CertificateConfigurationRespnse();

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private settingsService: SettingsService,
    private dialogService: DialogService,
    private superAdmin: SuperAdminService,
    private location: Location) { }

  ngOnInit() {
    if (!this.currentFileUplod == null && this.certificateConfigurationProvider.password !== null) {

    }
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
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
// closeDialog() {
//   this.dialogRef.close();
// }

upload() {

  if (this.currentFileUplod === undefined) {
    this.error = 'Please upload the one p12 file.';
    return;
  }
  this.error = '';



  this.startUploading();
}
startUploading() {
  this.settingsService.getSaveCertificateFileToProvider(
    this.selectedProvider,
    this.currentFileUplod,
    this.certificateConfigurationProvider.password

  ).subscribe(event => {
    if (event instanceof HttpResponse) {
      if (event.status === 200) {
        this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
        this.closeStatus = true;
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

  selectProvider(providerId: string = null) {
    if (providerId !== null)
      this.selectedProvider = providerId;

    else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }
    
    this.settingsService.getDetails(  this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
      //    debugger;
          this.certificateConfigurationRespnse = event.body as CertificateConfigurationRespnse;
        
          
          // this.certificateConfigurationRespnse.map(value =>{
            
          this.isFileUploded=  this.certificateConfigurationRespnse.fileName;
         
            this.certificateConfigurationProvider.password=this.certificateConfigurationRespnse.password;
  
          
          //   return value;
          // });
          
          this.sharedServices.loadingChanged.next(false);
        }
        
      }
    });
  

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


edit() {
  if (this.editable) {
    this.location.go(this.location.path() + '#edit');
    this.store.dispatch(toEditMode());
  }
}
  get editable() {
  return this.currentFileUplod != null && this.certificateConfigurationProvider.password != null

}
}
