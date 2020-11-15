import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SuperAdminService, SERVICE_CODE_VALIDATION_KEY, SERVICE_CODE_RESTRICTION_KEY, ICD10_RESTRICTION_KEY, VALIDATE_RESTRICT_PRICE_UNIT } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { MatSlideToggleChange } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-providers-config',
  templateUrl: './providers-config.component.html',
  styleUrls: ['./providers-config.component.css']
})
export class ProvidersConfigComponent implements OnInit {

  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();

  errors: { providersError?: string, payersError?: string, serviceCodeError?: string, serviceCodeSaveError?: string, portalUserError?: string, portalUserSaveError?: string, ICD10SaveError?: string } = {};
  success: { serviceCodeSaveSuccess?: string, portalUserSaveSuccess?: string, ICD10SaveSuccess?: string } = {};
  componentLoading = { serviceCode: true, portalUser: true, ICD10Validation: true };

  selectedProvider: string;
  associatedPayers: any[] = [];
  serviceCodeValidationSettings: any[] = [];
  serviceCodeRestrictionSettings: any[] = [];
  priceUnitSettings: any[] = [];
  ICD10ValidationSettings: any[] = [];
  newServiceCodeValidationSettings: { [key: string]: boolean } = {};
  newServiceRestrictionSettings: { [key: string]: boolean } = {};
  newPriceUnitSettings: { [key: string]: boolean } = {};
  newICD10ValidationSettings: { [key: string]: boolean } = {};
  portalUserSettings: any;
  portalUsernameController: FormControl = new FormControl('');
  portalPasswordController: FormControl = new FormControl('');

  constructor(private superAdmin: SuperAdminService,
    private router: Router,
    private sharedServices: SharedServices,
    private location: Location,
    private dialogService: DialogService) {
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
    this.reset();
    this.getAssociatedPayers();
  }

  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') return;
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.associatedPayers = event.body;
          this.associatedPayers.forEach(payer => {
            this.newServiceCodeValidationSettings[payer.switchAccountId] = true;
            this.newServiceRestrictionSettings[payer.switchAccountId] = false;
            this.newPriceUnitSettings[payer.switchAccountId] = false;
            this.newICD10ValidationSettings[payer.switchAccountId] = true;
          })
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
    this.getServiceCodeRestrictionSettings();
    this.getUnitPriceSettings();
    this.getICD10ValidationSettings();
  }

  save() {
    if (this.isLoading || this.componentLoading.serviceCode || this.componentLoading.portalUser || this.componentLoading.ICD10Validation) {
      return;
    }
    let flag1 = this.saveServiceCodeValidationSettings();
    let flag2 = this.savePortalUserSettings();
    let flag3 = this.saveServiceRestrictionSettings();
    let flag4 = this.saveICD10ValidationSettings();
    let flag5 = this.savePriceUnitSettings();
    if (flag1 && flag2 && flag3 && flag4 && flag5) {
      this.dialogService.openMessageDialog({
        title: '',
        message: 'There is no changes to save!',
        withButtons: false,
        isError: false
      });
    }

  }

  saveServiceCodeValidationSettings() {
    let payers = Object.keys(this.newServiceCodeValidationSettings);
    if (payers.length > 0) {
      let newSettingsKeys = payers.filter(payerId => {
        let setting = this.serviceCodeValidationSettings.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != this.newServiceCodeValidationSettings[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.componentLoading.serviceCode = true;
        this.errors.serviceCodeSaveError = null;
        this.success.serviceCodeSaveSuccess = null;
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: SERVICE_CODE_VALIDATION_KEY,
          value: (this.newServiceCodeValidationSettings[payerId]) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              let index = this.serviceCodeValidationSettings.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.serviceCodeValidationSettings[index].value = (this.newServiceCodeValidationSettings[payerId]) ? '1' : '0';
              } else {
                this.serviceCodeValidationSettings.push({
                  providerId: this.selectedProvider,
                  payerId: payerId,
                  key: SERVICE_CODE_VALIDATION_KEY,
                  value: (this.newServiceCodeValidationSettings[payerId]) ? '1' : '0'
                });
              }
            });

            this.success.serviceCodeSaveSuccess = "Settings were saved successfully";
            this.componentLoading.serviceCode = false;
          }
        }, error => {
          this.errors.serviceCodeSaveError = 'Could not save settings, please try again later.';
          this.resetServiceCodeValidationSettings();
          this.componentLoading.serviceCode = false;
        });
        return false;
      } return true;
    } return true;
  }

  saveServiceRestrictionSettings() {
    let payers = Object.keys(this.newServiceRestrictionSettings);
    if (payers.length > 0) {
      let newSettingsKeys = payers.filter(payerId => {
        let setting = this.serviceCodeRestrictionSettings.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != this.newServiceRestrictionSettings[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.componentLoading.serviceCode = true;
        this.errors.serviceCodeSaveError = null;
        this.success.serviceCodeSaveSuccess = null;
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: SERVICE_CODE_RESTRICTION_KEY,
          value: (this.newServiceRestrictionSettings[payerId]) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              let index = this.serviceCodeRestrictionSettings.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.serviceCodeRestrictionSettings[index].value = (this.newServiceRestrictionSettings[payerId]) ? '1' : '0';
              } else {
                this.serviceCodeRestrictionSettings.push({
                  providerId: this.selectedProvider,
                  payerId: payerId,
                  key: SERVICE_CODE_RESTRICTION_KEY,
                  value: (this.newServiceRestrictionSettings[payerId]) ? '1' : '0'
                });
              }
            });

            this.success.serviceCodeSaveSuccess = "Settings were saved successfully";
            this.componentLoading.serviceCode = false;
          }
        }, error => {
          this.errors.serviceCodeSaveError = 'Could not save settings, please try again later.';
          this.resetServiceRestrictionSettings();
          this.componentLoading.serviceCode = false;
        });
        return false;
      } return true;
    } return true;
  }

  savePriceUnitSettings() {
    let payers = Object.keys(this.newPriceUnitSettings);
    if (payers.length > 0) {
      let newSettingsKeys = payers.filter(payerId => {
        let setting = this.priceUnitSettings.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != this.newPriceUnitSettings[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.componentLoading.serviceCode = true;
        this.errors.serviceCodeSaveError = null;
        this.success.serviceCodeSaveSuccess = null;
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: VALIDATE_RESTRICT_PRICE_UNIT,
          value: (this.newPriceUnitSettings[payerId] && !this.isPriceUnitDisabled(payerId)) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              let index = this.priceUnitSettings.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.priceUnitSettings[index].value = (this.newPriceUnitSettings[payerId]) ? '1' : '0';
              } else {
                this.priceUnitSettings.push({
                  providerId: this.selectedProvider,
                  payerId: payerId,
                  key: VALIDATE_RESTRICT_PRICE_UNIT,
                  value: (this.newPriceUnitSettings[payerId]) ? '1' : '0'
                });
              }
            });

            this.success.serviceCodeSaveSuccess = "Settings were saved successfully";
            this.componentLoading.serviceCode = false;
          }
        }, error => {
          this.errors.serviceCodeSaveError = 'Could not save settings, please try again later.';
          this.resetPriceUnitSettings();
          this.componentLoading.serviceCode = false;
        });
        return false;
      } return true;
    } return true;
  }

  savePortalUserSettings() {
    if (this.portalUsernameController.value != '' && this.portalPasswordController.value != '') {
      let password: string = this.portalPasswordController.value;
      let match = password.match("(.)\\1*");
      if (this.portalUserSettings == null
        || (this.portalUserSettings != null && this.portalUsernameController.value != this.portalUserSettings.username)
        || match[0] != match['input']) {
        this.componentLoading.portalUser = true;
        this.errors.portalUserSaveError = null;
        this.success.portalUserSaveSuccess = null;
        this.superAdmin.savePortalUserSettings(this.selectedProvider, this.portalUsernameController.value, password).subscribe(event => {
          if (event instanceof HttpResponse) {
            this.portalUserSettings = { username: this.portalUsernameController.value };
            this.portalPasswordController.setValue('************************');
            this.success.portalUserSaveSuccess = "Settings were saved successfully";
            this.componentLoading.portalUser = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status == 404) {
              this.errors.portalUserSaveError = 'The provided user does not exist in the system.';
            } else if (error.status == 401) {
              this.errors.portalUserSaveError = 'username/password is not correct, or user does not have required privilages';
            } else {
              this.errors.portalUserSaveError = 'Could not save settings at the moment, please try again later.'
            }
          } else {
            this.errors.portalUserSaveError = 'Could not save settings at the moment, please try again later.'
          }

          this.resetPortalUserSettings();
          this.componentLoading.portalUser = false;
        });
        return false;
      } return true;
    } return true;
  }

  saveICD10ValidationSettings() {
    let payers = Object.keys(this.newICD10ValidationSettings);
    if (payers.length > 0) {
      let newSettingsKeys = payers.filter(payerId => {
        let setting = this.ICD10ValidationSettings.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != this.newICD10ValidationSettings[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.componentLoading.ICD10Validation = true;
        this.errors.ICD10SaveError = null;
        this.success.ICD10SaveSuccess = null;
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: ICD10_RESTRICTION_KEY,
          value: (this.newICD10ValidationSettings[payerId]) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              let index = this.ICD10ValidationSettings.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.ICD10ValidationSettings[index].value = (this.ICD10ValidationSettings[payerId]) ? '1' : '0';
              } else {
                this.ICD10ValidationSettings.push({
                  providerId: this.selectedProvider,
                  payerId: payerId,
                  key: ICD10_RESTRICTION_KEY,
                  value: (this.ICD10ValidationSettings[payerId]) ? '1' : '0'
                });
              }
            });
            this.success.ICD10SaveSuccess = "Settings were saved successfully";
            this.componentLoading.ICD10Validation = false;
          }
        }, error => {
          this.errors.ICD10SaveError = 'Could not save settings, please try again later.';
          this.resetICD10ValidationSettings;
          this.componentLoading.ICD10Validation = false;
        });
        return false;
      } return true;
    } return true;
  }



  reset() {
    this.resetServiceCodeValidationSettings();
    this.resetServiceRestrictionSettings();
    this.resetPortalUserSettings();
    this.resetICD10ValidationSettings();
  }

  resetServiceCodeValidationSettings() {
    if (Object.keys(this.newServiceCodeValidationSettings).length > 0) {
      this.componentLoading.serviceCode = true;
      setTimeout(() => this.componentLoading.serviceCode = false, 100);
      this.newServiceCodeValidationSettings = {};
    }
  }
  resetServiceRestrictionSettings() {
    if (Object.keys(this.newServiceRestrictionSettings).length > 0) {
      this.componentLoading.serviceCode = true;
      setTimeout(() => this.componentLoading.serviceCode = false, 100);
      this.newServiceRestrictionSettings = {};
    }
  }
  resetPriceUnitSettings() {
    if (Object.keys(this.newPriceUnitSettings).length > 0) {
      this.componentLoading.serviceCode = true;
      setTimeout(() => this.componentLoading.serviceCode = false, 100);
      this.newPriceUnitSettings = {};
    }
  }
  resetPortalUserSettings() {
    if (this.portalUserSettings != null) {
      this.portalUsernameController.setValue(this.portalUserSettings.username);
      this.portalPasswordController.setValue('************************');
    }
  }

  resetICD10ValidationSettings() {
    if (Object.keys(this.newICD10ValidationSettings).length > 0) {
      this.componentLoading.ICD10Validation = true;
      setTimeout(() => this.componentLoading.ICD10Validation = false, 100);
      this.newICD10ValidationSettings = {};
    }
  }

  getServiceCodeValidationSettings() {
    this.componentLoading.serviceCode = true;
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, SERVICE_CODE_VALIDATION_KEY).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.serviceCodeValidationSettings = event.body;

          let payers = Object.keys(this.newServiceCodeValidationSettings);
          if (payers.length > 0) {
            payers.forEach(payer => {
              let setting = this.serviceCodeValidationSettings.find(setting => setting.payerId == payer);
              this.newServiceCodeValidationSettings[payer] = (setting == null || setting.value == '1');
            });
          }

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

  getServiceCodeRestrictionSettings() {
    this.componentLoading.serviceCode = true;
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, SERVICE_CODE_RESTRICTION_KEY).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.serviceCodeRestrictionSettings = event.body;

          let payers = Object.keys(this.newServiceRestrictionSettings);
          if (payers.length > 0) {
            payers.forEach(payer => {
              let setting = this.serviceCodeRestrictionSettings.find(setting => setting.payerId == payer);
              this.newServiceRestrictionSettings[payer] = (setting != null && setting.value == '1');
            });
          }

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

  getUnitPriceSettings() {
    this.componentLoading.serviceCode = true;
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, VALIDATE_RESTRICT_PRICE_UNIT).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.priceUnitSettings = event.body;

          let payers = Object.keys(this.newServiceRestrictionSettings);
          if (payers.length > 0) {
            payers.forEach(payer => {
              let setting = this.priceUnitSettings.find(setting => setting.payerId == payer);
              this.newPriceUnitSettings[payer] = (setting != null && setting.value == '1');
            });
          }

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
    this.portalUserSettings = null;
    this.portalUsernameController.setValue('');
    this.portalPasswordController.setValue('');
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

  getICD10ValidationSettings() {
    this.componentLoading.ICD10Validation = true;
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, ICD10_RESTRICTION_KEY).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.ICD10ValidationSettings = event.body;
          let payers = Object.keys(this.newICD10ValidationSettings);
          if (payers.length > 0) {
            payers.forEach(payer => {
              let setting = this.ICD10ValidationSettings.find(setting => setting.payerId == payer);
              this.newICD10ValidationSettings[payer] = (setting == null || setting.value == '1');
            });
          }
          this.componentLoading.ICD10Validation = false;
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.ICD10SaveError = 'Could not load ICD10 settings, please try again later.';
        }
      }
      this.componentLoading.ICD10Validation = false;
    });
  }

  get isLoading() {
    return this.sharedServices.loading;
  }
  getPriceUnitCheckBoxLabel(payerId) {
    if (!this.newServiceRestrictionSettings[payerId] && !this.newServiceCodeValidationSettings[payerId]) {
      return '';
    } else if (this.newServiceRestrictionSettings[payerId]) {
      return 'Restriction';
    } else {
      return 'Warning';
    }
  }

  onServiceCodeSettingChange(payerid: string, event: MatSlideToggleChange) {
    if (event.checked) {
      this.newServiceRestrictionSettings[payerid] = !event.checked;
    }
  }
  onServiceRestrictionSettingChange(payerid: string, event: MatSlideToggleChange) {
    if (event.checked) {
      this.newServiceCodeValidationSettings[payerid] = !event.checked;
    }
  }
  isPriceUnitDisabled(payerId: string) {
    return !this.newServiceCodeValidationSettings[payerId] && !this.newServiceRestrictionSettings[payerId];
  }
}
