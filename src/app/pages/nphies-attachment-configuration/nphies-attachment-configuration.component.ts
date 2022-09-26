import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';


@Component({
  selector: 'app-nphies-attachment-configuration',
  templateUrl: './nphies-attachment-configuration.component.html',
  styles: []
})
export class NphiesAttachmentConfigurationComponent implements OnInit {
  selectedProvider: string;
  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();
  headerFile: any;
  headerFileName: string;
  footerFile: any;
  footerFileName: string;
  enabled: boolean=false;
  isHeaderSubmitted:boolean=false;
  isFooterSubmitted:boolean=false;
  header: any;
  footer: any;
  HeadersizeInMB: string;
  FootersizeInMB: string;


  errors: {
    providersError?: string
  } = {};

  constructor(
    private superAdmin: SuperAdminService,
    private router: Router,
    private sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private settingsServices: SettingsService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {    
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          if (!location.href.endsWith('providers')) {
            const paths = location.href.split('/');
            this.selectedProvider = paths[paths.length - 1];

            const provider = this.providers.find(provider => provider.switchAccountId == this.selectedProvider);
            if (provider != undefined) {
              this.providerController.setValue(`${provider.switchAccountId} | ${provider.code} | ${provider.name}`);
              this.updateFilter();
            } else {
              this.sharedServices.loadingChanged.next(false);
            }
          } else {
            this.sharedServices.loadingChanged.next(false);
          }
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.errors.providersError = 'could not load providers, please try again later.';
      console.log(error);
    });
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

  selectProvider(providerId: string = null) {
    if (providerId !== null)
      this.selectedProvider = providerId;

    else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }


    this.sharedServices.loadingChanged.next(true);
    this.settingsServices.getNphiesAttachmentConfigDetails(this.selectedProvider).subscribe(event => {

      if (event instanceof HttpResponse) {
        var result = event.body["attachment"];
        if (event.status == 200) {
          this.footer = this.dataURLtoFile("data:text/plain;base64," + result.footerFile, result.footerFileName);
          this.footerFile = this.dataURLtoFile("data:text/plain;base64," + result.footerFile, result.footerFileName);
          this.footerFileName = result.footerFileName;
          this.header = this.dataURLtoFile("data:text/plain;base64," + result.headerFile, result.headerFileName);
          this.headerFile = this.dataURLtoFile("data:text/plain;base64," + result.headerFile, result.headerFileName);
          this.headerFileName = result.headerFileName;
          this.enabled = result.isEnabled
          this.selectedProvider = result.providerId;
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, eventError => {
      if (eventError instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: eventError.message,
          isError: true
        });
        this.sharedServices.loadingChanged.next(false);
      }
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

  selectHeaderFile(event) {
    this.headerFile = event.target.files[0];
    this.HeadersizeInMB = '';
    this.headerFileName = event.target.files[0].name;
    // this.supportingInfoList[i].attachmentType = event.target.files[0].type;
    // this.supportingInfoList[i].attachmentDate = new Date();
    this.HeadersizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);

    // if (event.target.files[0].size > 9437184) {
    //   this.supportingInfoList[i].fileError = 'File must be less than or equal to 10 MB';
    //   this.supportingInfoList[i].uploadContainerClass = 'has-error';
    //   this.supportingInfoList[i].attachment = null;
    //   return;
    // }

    // if (!this.checkfile(i)) {
    //   this.supportingInfoList[i].attachment = null;
    //   return;
    // }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.header = data.substring(data.indexOf(',') + 1);
    };
  }

  selectFooterFile(event) {
    this.footerFile = event.target.files[0];
    let FootersizeInMB = '';
    this.footerFileName = event.target.files[0].name;
    // this.supportingInfoList[i].attachmentType = event.target.files[0].type;
    // this.supportingInfoList[i].attachmentDate = new Date();
    this.FootersizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);

    // if (event.target.files[0].size > 9437184) {
    //   this.supportingInfoList[i].fileError = 'File must be less than or equal to 10 MB';
    //   this.supportingInfoList[i].uploadContainerClass = 'has-error';
    //   this.supportingInfoList[i].attachment = null;
    //   return;
    // }

    // if (!this.checkfile(i)) {
    //   this.supportingInfoList[i].attachment = null;
    //   return;
    // }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.footer = data.substring(data.indexOf(',') + 1);
    };
  }

  // checkfile(i) {
  //   const validExts = ['.pdf', '.jpg', '.jpeg'];
  //   let fileExt = this.supportingInfoList[i].attachmentName;
  //   fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
  //   if (validExts.indexOf(fileExt) < 0) {
  //     this.supportingInfoList[i].fileError = 'Invalid file selected, valid files are of ' + validExts.toString() + ' types.';
  //     this.supportingInfoList[i].uploadContainerClass = 'has-error';
  //     this.supportingInfoList[i].attachment = null;
  //     return false;
  //   } else {
  //     this.supportingInfoList[i].uploadContainerClass = '';
  //     this.supportingInfoList[i].fileError = '';
  //     return true;
  //   }
  // }

  headerClearFiles(event) {
    event.target.value = '';
    this.headerFile = "";
    this.headerFileName = "";
    this.HeadersizeInMB = "";
    this.header="";
  }

  footerClearFiles(event) {
    event.target.value = '';
    this.footerFile = "";
    this.footerFileName = "";
    this.FootersizeInMB = "";
    this.footer="";
  }

  enabledChange(event) {
    this.enabled = event.value;
  }

  onSubmit() {
    debugger
    this.sharedServices.loadingChanged.next(true);
    if(!this.selectedProvider){
      this.dialogService.openMessageDialog({
        title: '',
        message: "Please select provider.",
        isError: true
      });
      this.isHeaderSubmitted=true;
      this.isFooterSubmitted=true;
      this.sharedServices.loadingChanged.next(false);
      return false;
    }
    
    if(this.headerFile){
     this.isHeaderSubmitted=false;
    }
    else{
      this.isHeaderSubmitted=true;
      this.sharedServices.loadingChanged.next(false);
    }

    if(this.footerFile){
     this.isFooterSubmitted=false;
    }
    else{
      this.isFooterSubmitted=true;
      this.sharedServices.loadingChanged.next(false);
    }

    if(this.isFooterSubmitted == true || this.isHeaderSubmitted==true){
      return false;
    }
    const body: FormData = new FormData();
    body.append('enabled', this.enabled.toString());
    body.append('header', this.headerFile, this.headerFile.name);
    body.append('footer', this.footerFile, this.footerFile.name);

    this.settingsServices.saveNphiesAttachmentConfigData(this.selectedProvider, body).subscribe(event => {

      if (event instanceof HttpResponse) {
        var result = event.body;
        if (event.status == 200) {
          this.dialogService.openMessageDialog({
            title: '',
            message: "Data saved successfully.",
            isError: false
          });
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, eventError => {
      if (eventError instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: eventError.message,
          isError: true
        });
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

}
