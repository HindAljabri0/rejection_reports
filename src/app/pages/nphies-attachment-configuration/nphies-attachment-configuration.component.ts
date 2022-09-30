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
  headerWidth: any;
  headerHeight: any;
  footerWidth: any;
  footerHeight: any;
  footerFile: any;
  footerFileName: string;
  enabled: boolean = false;
  isHeaderNotSubmitted: boolean = false;
  isFooterNotSubmitted: boolean = false;
  isHeaderSize: boolean = false;
  isFooterSize: boolean = false;
  header: any;
  footer: any;
  HeadersizeInMB: string;
  FootersizeInMB: string;
  isHeaderDimension: boolean = false;
  isFooterDimension: boolean = false;
  isValidateMessage: boolean = false;
  isSubmitted: boolean = false;
  isHeaderFormat: boolean = false;
  isFooterFormat: boolean = false;
  HeaderFormat: string;
  FooterFormat: string;
  ImageFormat = ["jpg", "jpeg"];

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
              this.selectedProvider = "";
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
        if (event.status == 200 && result != null) {
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
        else {
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
    this.HeadersizeInMB = '';
    this.HeaderFormat = event.target.files[0].name.split('.').pop();
    this.headerFileName = event.target.files[0].name;
    this.HeadersizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);
    if (!this.ImageFormat.includes(this.HeaderFormat.toLowerCase())) {
      this.isHeaderFormat = true;
      this.isHeaderSize = false;
      this.isHeaderDimension = false;
      this.isHeaderNotSubmitted = false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.header = data.substring(data.indexOf(',') + 1);
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        this.headerHeight = img.naturalHeight;
        this.headerWidth = img.naturalWidth;
        if (!this.HeadersizeInMB.includes('KB') ||
          !(this.headerHeight <= 100 && this.headerWidth <= 500)) {
          this.isHeaderNotSubmitted = false;
          if (this.HeadersizeInMB.includes('KB')) {
            var hdSize = parseFloat(this.HeadersizeInMB.replace("KB", "").trim());
            if (hdSize > 300) {
              this.isHeaderSize = true;
            }
          }
          if (!(this.headerHeight <= 100 && this.headerWidth <= 500)) this.isHeaderDimension = true;
        } else {
          this.headerFile = event.target.files[0];
          this.isHeaderSize = false;
          this.isHeaderDimension = false;
          this.isHeaderNotSubmitted = false;
          this.isHeaderFormat = false;
        }
      };
    };


  }

  selectFooterFile(event) {
    this.footerFileName = event.target.files[0].name;
    this.FooterFormat = event.target.files[0].name.split('.')[1];
    this.FootersizeInMB = this.sharedServices.formatBytes(event.target.files[0].size);
    if (!this.ImageFormat.includes(this.FooterFormat.toLowerCase())) {
      this.isFooterFormat = true;
      this.isFooterSize = false;
      this.isFooterDimension = false;
      this.isFooterNotSubmitted = false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.footer = data.substring(data.indexOf(',') + 1);
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        this.footerHeight = img.naturalHeight;
        this.footerWidth = img.naturalWidth;
        if (!this.FootersizeInMB.includes('KB') ||
          !(this.footerHeight <= 100 && this.footerWidth <= 500)) {
          this.isFooterNotSubmitted = false;

          if (this.FootersizeInMB.includes('KB')) {
            var ftSize = parseFloat(this.FootersizeInMB.replace("KB", "").trim());
            if (ftSize > 300) {
              this.isFooterSize = true;
            }
          }
          if (!(this.footerHeight <= 100 && this.footerWidth <= 500)) this.isFooterDimension = true;
        } else {
          this.footerFile = event.target.files[0];
          this.isFooterSize = false;
          this.isFooterDimension = false;
          this.isFooterNotSubmitted = false;
          this.isFooterFormat = false;
        }
      };
    };

  }

  headerClearFiles(event) {
    event.target.value = '';
    this.headerFile = "";
    this.headerFileName = "";
    this.HeadersizeInMB = "";
    this.header = "";
    this.isHeaderDimension = false;
    this.isHeaderSize = false;
    this.isHeaderNotSubmitted = false;
    this.isHeaderFormat = false;
    if (this.isSubmitted) {
      if (!this.headerFile) this.isHeaderNotSubmitted = true;
      this.sharedServices.loadingChanged.next(false);
    }
  }

  footerClearFiles(event) {
    event.target.value = '';
    this.footerFile = "";
    this.footerFileName = "";
    this.FootersizeInMB = "";
    this.footer = "";
    this.isFooterDimension = false;
    this.isFooterSize = false;
    this.isFooterNotSubmitted = false;
    this.isFooterFormat = false;
    if (this.isSubmitted) {
      if (!this.footerFile) this.isFooterNotSubmitted = true;
      this.sharedServices.loadingChanged.next(false);
    }
  }

  enabledChange(event) {
    this.enabled = event.value;
  }

  checkValidation() {
    this.isSubmitted = true;
    if (!this.selectedProvider || this.selectedProvider == undefined || this.selectedProvider == "") {
      this.dialogService.openMessageDialog({
        title: '',
        message: "Please select provider.",
        isError: true
      });
    }
    if (!this.headerFile || !this.footerFile) {
      if (!this.headerFile) this.isHeaderNotSubmitted = true;
      if (!this.footerFile) this.isFooterNotSubmitted = true;
    }
    else if (!this.isHeaderSize && !this.isHeaderDimension && !this.isFooterSize && !this.isFooterDimension && !this.isHeaderFormat && !this.isFooterFormat) {
      this.onSubmit();
    }

  }

  onSubmit() {

    this.sharedServices.loadingChanged.next(true);
    if (!this.selectedProvider || this.selectedProvider == undefined || this.selectedProvider == "") {
      this.dialogService.openMessageDialog({
        title: '',
        message: "Please select provider.",
        isError: true
      });
      this.sharedServices.loadingChanged.next(false);
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
          location.reload();
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
