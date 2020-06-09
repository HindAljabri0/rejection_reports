import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SuperAdminService, SERVICE_CODE_VALIDATION_KEY } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-providers-config',
  templateUrl: './providers-config.component.html',
  styleUrls: ['./providers-config.component.css']
})
export class ProvidersConfigComponent implements OnInit {

  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();

  errors: { providersError?: string, payersError?: string, serviceCodeError?: string, portalUserError?: string } = {};
  componentLoading = { serviceCode: true, portalUser: true };

  selectedProvider: string;
  associatedPayers: any[] = [];
  serviceCodeValidationSettings: any[] = [];
  newServiceCodeValidationSettings: { [key: string]: boolean } = {};
  portalUserSettings: any;
  portalUsernameController: FormControl = new FormControl();
  portalPasswordController: FormControl = new FormControl();

  constructor(private superAdmin: SuperAdminService, private router: Router, private sharedServices: SharedServices, private location: Location) {
    sharedServices.loadingChanged.next(true);
  }



  ngOnInit() {

    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          if (!location.href.endsWith('providers')) {
            let paths = location.href.split('/');
            this.selectedProvider = paths[paths.length - 1];

            let provider = this.providers.find(provider => provider.switchAccountId == this.selectedProvider);
            if (provider != undefined) {
              this.providerController.setValue(`${provider.switchAccountId} | ${provider.name}`);
              this.updateFilter();
              this.getAssociatedPayers();
            } else this.sharedServices.loadingChanged.next(false);
          } else this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.errors.providersError = 'could not load providers, please try again later.'
      console.log(error);
    });
  }

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
  }

  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.location.go(`/administration/config/providers/${providerId}`);
    this.getAssociatedPayers();
  }

  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') return;
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.associatedPayers = event.body;
        }
        if (this.associatedPayers.length == 0) {
          this.errors.payersError = 'There are no payers associated with this provider.';
        }
        this.sharedServices.loadingChanged.next(false);
        this.fetchSettings();
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 404) {
          this.errors.payersError = 'There are no payers associated with this provider.';
        } else {
          this.errors.payersError = 'Could not load payers, please try again later.';
        }
      }

      console.log(error);
      this.sharedServices.loadingChanged.next(false);
    })
  }

  fetchSettings() {
    this.getServiceCodeValidationSettings();
    this.getPortalUserSettings();
  }

  save() {

  }

  reset() {
    if (Object.keys(this.newServiceCodeValidationSettings).length > 0) {
      this.componentLoading.serviceCode = true;
      setTimeout(() => this.componentLoading.serviceCode = false, 100);
      this.newServiceCodeValidationSettings = {};
    }
    if (this.portalUserSettings != null) {
      this.portalUsernameController.setValue(this.portalUserSettings.username);
      this.portalPasswordController.setValue('************************');
    }
  }

  getServiceCodeValidationSettings() {
    this.componentLoading.serviceCode = true;
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, SERVICE_CODE_VALIDATION_KEY).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.serviceCodeValidationSettings = event.body;
          this.componentLoading.serviceCode = false;
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.serviceCodeError = 'Could not load service code settings, please try again later.';
        }
      }
      this.componentLoading.serviceCode = false;
    });
  }

  getPortalUserSettings() {
    this.componentLoading.portalUser = true;
    this.superAdmin.getPortalUserSettings(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.portalUserSettings = event.body;
        this.portalUsernameController.setValue(this.portalUserSettings.username);
        this.portalPasswordController.setValue('************************');
        this.componentLoading.portalUser = false;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.portalUserError = 'Could not load portal user settings, please try again later.';
        }
      }
      this.componentLoading.portalUser = false;
    });
  }

  get isLoading() {
    return this.sharedServices.loading;
  }

  getServiceCodeSettingsOfPayer(payerid: string) {
    let setting = this.serviceCodeValidationSettings.find(setting => setting.payerId == payerid);
    return setting != null && setting.value == '1';
  }

  onServiceCodeSettingChange(payerid: string, event: MatSlideToggleChange) {
    this.newServiceCodeValidationSettings[payerid] = event.checked;
  }

}
