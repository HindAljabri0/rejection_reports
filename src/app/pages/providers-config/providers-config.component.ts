import { Component, OnInit } from '@angular/core';
import {
  SuperAdminService,
  SERVICE_CODE_RESTRICTION_KEY,
  ICD10_RESTRICTION_KEY,
  VALIDATE_RESTRICT_PRICE_UNIT,
  SFDA_RESTRICTION_KEY,
  PBM_RESTRICTION_KEY,
  NET_AMOUNT_RESTRICTION_KEY
} from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';

@Component({
  selector: 'app-providers-config',
  templateUrl: './providers-config.component.html',
  styleUrls: ['./providers-config.component.css']
})
export class ProvidersConfigComponent implements OnInit {

  providers: any[] = [];
  filteredProviders: any[] = [];
  providerController: FormControl = new FormControl();

  errors: {
    providersError?: string,
    payersError?: string,
    serviceCodeError?: string,
    serviceCodeSaveError?: string,
    portalUserError?: string,
    portalUserSaveError?: string,
    ICD10SaveError?: string,
    sfdaError?: string,
    sfdaSaveError?: string,
    midtableError?: string,
    midtableSaveError?: string,
    payerMappingError?: string,
    payerMappingSaveError?: string,
    providerMappingError?: string,
    providerMappingSaveError?: string,
    pbmConfigurationError?: string,
    pbmConfigurationSaveError?: string,
    netAmountConfigurationError?: string,
    netAmountConfigurationSaveError?: string,
  } = {};
  success: {
    serviceCodeSaveSuccess?: string,
    portalUserSaveSuccess?: string,
    ICD10SaveSuccess?: string,
    sfdaSaveSuccess?: string,
    midtableSaveSuccess?: string,
    payerMappingSaveSuccess?: string,
    providerMappingSaveSuccess?: string,
    pbmConfigurationSaveSuccess?: string,
    netAmountConfigurationSaveSuccess?: string

  } = {};
  componentLoading = {
    serviceCode: true,
    portalUser: true,
    ICD10Validation: true,
    sfda: true,
    pbmConfiguration: true,
    midtable: true,
    payerMapping: true,
    providerMapping: true,
    netAmount: true
  };

  selectedProvider: string;
  associatedPayers: any[] = [];
  serviceCodeValidationSettings: any[] = [];
  priceUnitSettings: any[] = [];
  ICD10ValidationSettings: any[] = [];
  sfdaValidationSettings: any[] = [];
  pbmValidationSettings: any[] = [];
  newServiceValidationSettings: { [key: string]: boolean } = {};
  newPriceUnitSettings: { [key: string]: boolean } = {};
  newICD10ValidationSettings: { [key: string]: boolean } = {};
  newSFDAValidationSettings: { [key: string]: boolean } = {};
  newPBMValidationSettings: { [key: string]: boolean } = {};
  portalUserSettings: any;
  portalUsernameController: FormControl = new FormControl('');
  portalPasswordController: FormControl = new FormControl('');
  addDbConfigForm: FormGroup;
  newPayerMappingEnable: { [key: number]: boolean } = {};
  newPayerMappingValue: { [key: number]: string } = {};
  newPayerName: { [key: number]: string } = {};
  deletePayerMappingList: any[] = [];
  addPayerMappingList: any[] = [];
  existingPayers: any[] = [];
  providerMappingController: FormControl = new FormControl('');
  providerMappingValue: string;
  PBMUserController: FormControl = new FormControl('');
  PBMPasswordController: FormControl = new FormControl('');
  PBMCheckValueController: FormControl = new FormControl('');
  payerMappingValue: { [key: number]: string } = {};
  isPBMLoading: boolean = false;
  exisingServiceAndPriceValidationData: any = [];
  netAmountController: FormControl = new FormControl('');
  netAmountValue: number;

  constructor(
    private superAdmin: SuperAdminService,
    private router: Router,
    private sharedServices: SharedServices,
    private location: Location,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private dbMapping: DbMappingService) {
    sharedServices.loadingChanged.next(true);
  }



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
              this.getAssociatedPayers();
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
    this.addDbConfigForm = this.formBuilder.group({
      dbType: [''],
      hostName: [''],
      port: [''],
      databaseName: [''],
      dbUserName: [''],
      dbPassword: ['']
    });
  }

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.code} | ${provider.name}`.toLowerCase().includes(this.providerController.value.toLowerCase())
    );
  }

  selectProvider(providerId: string) {
    this.selectedProvider = providerId;
    this.location.go(`/administration/config/providers/${providerId}`);
    this.reset();
    this.getAssociatedPayers();

  }

  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') { return; }
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.newPBMValidationSettings["101"] = false;
          this.associatedPayers = event.body;

          this.associatedPayers.forEach(payer => {
            // this.newServiceValidationSettings[payer.switchAccountId] = false;
            // this.newPriceUnitSettings[payer.switchAccountId] = false;

            this.newICD10ValidationSettings[payer.switchAccountId] = false;
            this.newSFDAValidationSettings[payer.switchAccountId] = false;
            // new changes for payer mapping
            this.existingPayers.push({ payerId: payer.switchAccountId, payerName: payer.name, mappingName: '', providerId: this.selectedProvider });
            this.newPayerMappingEnable[payer.switchAccountId] = false;
            this.newPayerMappingValue[payer.switchAccountId] = '';
            this.payerMappingValue[payer.switchAccountId] = '';
            this.newPayerName[payer.switchAccountId] = '';
            this.addPayerMappingList = [];
            this.addDbConfigForm.reset();
            // this.providerMappingController.
          });
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
    });
  }
  serviceAndPriceValidationSetting() {
    this.componentLoading.serviceCode = true;
    this.superAdmin.getPriceListValidationSettings(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body: any = event['body'];
        this.associatedPayers.forEach(payer => {
          const settingData = body.find(ele => ele.payerId === payer.switchAccountId);
          if (settingData !== null && settingData !== undefined) {
            this.newServiceValidationSettings[payer.switchAccountId] = settingData.isServiceCodeEnable === '1' ? true : false;
            this.newPriceUnitSettings[payer.switchAccountId] = settingData.isPriceUnitEnable === '1' ? true : false;
            const obj = {
              payerId: payer.switchAccountId,
              isServiceCodeEnable: settingData.isServiceCodeEnable,
              isPriceUnitEnable: settingData.isPriceUnitEnable
            }
            this.exisingServiceAndPriceValidationData.push(obj);
            // payer.hasAssociatedPriceList = settingData.isEnabled === '1' ? true : false;
          }
          else {
            this.newServiceValidationSettings[payer.switchAccountId] = false;
            this.newPriceUnitSettings[payer.switchAccountId] = false;
            // payer.hasAssociatedPriceList = false;
            const obj = {
              payerId: payer.switchAccountId,
              isServiceCodeEnable: '0',
              isPriceUnitEnable: '0'
            }
            this.exisingServiceAndPriceValidationData.push(obj);
          }
        });
      }
      this.componentLoading.serviceCode = false;
    }, err => {
      console.log(err);
      this.componentLoading.serviceCode = false;
    });

  }

  fetchSettings() {
    // this.getSetting(SERVICE_CODE_RESTRICTION_KEY, this.serviceCodeValidationSettings, this.newServiceValidationSettings, false);
    // this.getSetting(VALIDATE_RESTRICT_PRICE_UNIT, this.priceUnitSettings, this.newPriceUnitSettings, false);

    this.getSetting(ICD10_RESTRICTION_KEY, this.ICD10ValidationSettings, this.newICD10ValidationSettings, false);
    this.getSetting(SFDA_RESTRICTION_KEY, this.sfdaValidationSettings, this.newSFDAValidationSettings, false);
    this.getSetting(PBM_RESTRICTION_KEY, this.pbmValidationSettings, this.newPBMValidationSettings, false);
    this.getPortalUserSettings();
    // ####### Chages on 02-01-2021 start
    this.getDatabaseConfig();
    this.getPayerMapping();
    this.getProviderMapping();
    // ####### Chages on 02-01-2021 end

    // ####### changes on 05-07-2021
    this.serviceAndPriceValidationSetting();

    // Changes on 19-07-2021
    this.getNetAmountAccuracy();
  }

  save() {
    if (this.isLoading ||
      this.componentLoading.serviceCode ||
      this.componentLoading.portalUser ||
      this.componentLoading.ICD10Validation ||
      this.componentLoading.sfda ||
      this.componentLoading.pbmConfiguration ||
      this.componentLoading.midtable ||
      this.componentLoading.payerMapping ||
      this.componentLoading.providerMapping) {
      return;
    }
    this.resetUserMessages();
    const portalUserFlag = this.savePortalUserSettings();
    // const serviceCodeFlag = this.saveSettings(SERVICE_CODE_RESTRICTION_KEY, this.newServiceValidationSettings, this.serviceCodeValidationSettings);
    const icd10Flag = this.saveSettings(ICD10_RESTRICTION_KEY, this.newICD10ValidationSettings, this.ICD10ValidationSettings);
    // const priceUnitFlag = this.saveSettings(VALIDATE_RESTRICT_PRICE_UNIT, this.newPriceUnitSettings, this.priceUnitSettings);
    const sfdaFlag = this.saveSettings(SFDA_RESTRICTION_KEY, this.newSFDAValidationSettings, this.sfdaValidationSettings);
    const pbmFlag = this.saveSettings(PBM_RESTRICTION_KEY, this.newPBMValidationSettings, this.pbmValidationSettings);
    // change on 02-01-2021 start
    const dbFlag = this.addDatabaseConfig();
    const payerFlag = this.savePayerMapping();
    const providerFlag = this.addProviderMapping();
    const priceListFlag = this.updatePriceListValidationSetting();
    const netAmountFlag = this.setNetAmountAccuracy();
    // change on 02-01-2021 end
    // && priceUnitFlag && serviceCodeFlag
    if (portalUserFlag && icd10Flag && sfdaFlag && dbFlag
      && payerFlag && providerFlag && pbmFlag && priceListFlag && netAmountFlag) {
      this.dialogService.openMessageDialog({
        title: '',
        message: 'There is no changes to save!',
        withButtons: false,
        isError: false
      });
    }

  }

  updatePriceListValidationSetting() {
    this.componentLoading.serviceCode = true;
    this.errors.payerMappingSaveError = null;
    this.success.payerMappingSaveSuccess = null;
    const priceValidationData = [];
    this.exisingServiceAndPriceValidationData.map((ele, index) => {
      const isServiceCodeEnable = this.newServiceValidationSettings[ele.payerId] ? '1' : '0';
      const isPriceUnitEnable = this.newPriceUnitSettings[ele.payerId] ? '1' : '0';
      if (ele.isServiceCodeEnable !== isServiceCodeEnable || ele.isPriceUnitEnable !== isPriceUnitEnable) {
        const obj = {
          payerId: ele.payerId,
          isServiceCodeEnable: this.newServiceValidationSettings[ele.payerId] ? '1' : '0',
          isPriceUnitEnable: this.newPriceUnitSettings[ele.payerId] ? '1' : '0'
        }
        priceValidationData.push(obj);
      }
    })

    if (priceValidationData.length === 0) {
      this.componentLoading.serviceCode = false;
      return false;
    }


    this.superAdmin.updatePriceListSettings(this.selectedProvider, priceValidationData).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body: any = event['body'];
        this.serviceAndPriceValidationSetting();
        this.success.serviceCodeSaveSuccess = 'Settings were saved successfully.';
        // this.setComponentLoading(SERVICE_CODE_RESTRICTION_KEY, false);
        return true;
      }

      this.componentLoading.serviceCode = false;
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.serviceCodeSaveError = 'Could not change payer mapping, please try again later.';
        }
        else {
          this.setSaveError(SERVICE_CODE_RESTRICTION_KEY, 'Could not save settings, please try again later.');
        }
      }
      this.componentLoading.serviceCode = false
    });

  }

  saveSettings(URLKey: string, newSettingValues: { [key: string]: boolean }, settingValues: any[]) {
    const payers = Object.keys(newSettingValues);
    if (payers.length > 0) {
      const newSettingsKeys = payers.filter(payerId => {
        const setting = settingValues.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != newSettingValues[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.setComponentLoading(URLKey, true);
        this.setSaveError(URLKey, null);
        this.setSaveSuccess(URLKey, null);
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              const index = settingValues.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.setSettingIndexed(URLKey, index, (newSettingValues[payerId]) ? '1' : '0');
              } else {
                this.addValueToSetting(URLKey, payerId, newSettingValues);
              }
            });
            this.setSaveSuccess(URLKey, 'Settings were saved successfully');
            this.setComponentLoading(URLKey, false);
          }
        }, error => {
          this.setSaveError(URLKey, 'Could not save settings, please try again later.');
          this.resetSection(URLKey, newSettingValues);
          this.componentLoading.serviceCode = false;
        });
        return false;
      }
      return true;
    }
    return true;
  }
  addValueToSetting(URLKey: string, payerId: string, newSettingValues: { [key: string]: boolean; }) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
        this.serviceCodeValidationSettings.push({
          providerId: this.selectedProvider,
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.priceUnitSettings.push({
          providerId: this.selectedProvider,
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case ICD10_RESTRICTION_KEY:
        this.ICD10ValidationSettings.push({
          providerId: this.selectedProvider,
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case SFDA_RESTRICTION_KEY:
        this.sfdaValidationSettings.push({
          providerId: this.selectedProvider,
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case PBM_RESTRICTION_KEY:
        this.pbmValidationSettings.push({
          providerId: this.selectedProvider,
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
    }
  }
  setSettingIndexed(URLKey: string, index: number, value: string) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
        this.serviceCodeValidationSettings[index].value = value;
        break;
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.priceUnitSettings[index].value = value;
        break;
      case ICD10_RESTRICTION_KEY:
        this.ICD10ValidationSettings[index].value = value;
        break;
      case SFDA_RESTRICTION_KEY:
        this.sfdaValidationSettings[index].value = value;
        break;
      case PBM_RESTRICTION_KEY:
        this.pbmValidationSettings[index].value = value;
        break;
    }
  }

  savePortalUserSettings() {
    if (this.portalUsernameController.value != '' && this.portalPasswordController.value != '') {
      const password: string = this.portalPasswordController.value;
      const match = password.match('(.)\\1*');
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
            this.success.portalUserSaveSuccess = 'Settings were saved successfully';
            this.componentLoading.portalUser = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status == 404) {
              this.errors.portalUserSaveError = 'The provided user does not exist in the system.';
            } else if (error.status == 401) {
              this.errors.portalUserSaveError = 'username/password is not correct, or user does not have required privilages';
            } else {
              this.errors.portalUserSaveError = 'Could not save settings at the moment, please try again later.';
            }
          } else {
            this.errors.portalUserSaveError = 'Could not save settings at the moment, please try again later.';
          }

          this.resetPortalUserSettings();
          this.componentLoading.portalUser = false;
        });
        return false;
      }
      return true;
    }
    return true;
  }

  reset() {
    this.resetSection(SERVICE_CODE_RESTRICTION_KEY, this.newServiceValidationSettings);
    this.resetSection(VALIDATE_RESTRICT_PRICE_UNIT, this.newPriceUnitSettings);
    this.resetSection(ICD10_RESTRICTION_KEY, this.newICD10ValidationSettings);
    this.resetSection(SFDA_RESTRICTION_KEY, this.newSFDAValidationSettings);
    this.resetSection(PBM_RESTRICTION_KEY, this.newPBMValidationSettings);
    this.resetDbAndMapping();
    this.resetUserMessages();
  }
  resetSection(URLKey: string, newSettingArray: { [key: string]: boolean; }) {
    if (Object.keys(newSettingArray).length > 0) {
      this.setComponentLoading(URLKey, true);

      switch (URLKey) {
        case SERVICE_CODE_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.serviceCode = false, 100);
          this.newServiceValidationSettings = {};
          break;
        case VALIDATE_RESTRICT_PRICE_UNIT:
          setTimeout(() => this.componentLoading.serviceCode = false, 100);
          this.newPriceUnitSettings = {};
          break;
        case ICD10_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.ICD10Validation = false, 100);
          this.newICD10ValidationSettings = {};
          break;
        case SFDA_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.sfda = false, 100);
          this.newSFDAValidationSettings = {};
          break;
        case PBM_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.pbmConfiguration = false, 100);
          this.newPBMValidationSettings = {};
          break;
      }
    }

  }

  resetPortalUserSettings() {
    if (this.portalUserSettings != null) {
      this.portalUsernameController.setValue(this.portalUserSettings.username);
      this.portalPasswordController.setValue('************************');
    }
  }

  resetUserMessages() {
    this.success = {};
    this.errors = {};
  }

  getSetting(URLKey: string, settingValues: any[], newSettingValues: { [key: string]: boolean }, defaultValue: boolean) {
    this.setComponentLoading(URLKey, true);
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, URLKey).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          settingValues = event.body;
          const payers = Object.keys(newSettingValues);
          if (payers.length > 0) {
            payers.forEach(payer => {
              const index = settingValues.findIndex(setting => setting.payerId == payer);
              if (index != -1) {
                newSettingValues[payer] = (settingValues[index].value == '1');
              } else {
                newSettingValues[payer] = defaultValue;
              }
              this.addValueToSetting(URLKey, payer, newSettingValues);
            });
          }

          this.setComponentLoading(URLKey, false);
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.setErrorMessage('Could not load service code settings, please try again later.', URLKey);
        } else {
          const payers = Object.keys(newSettingValues);
          payers.forEach(payer => {
            newSettingValues[payer] = defaultValue;
            this.addValueToSetting(URLKey, payer, newSettingValues);
          });
        }
      }
      this.setComponentLoading(URLKey, false);
    });
  }
  setErrorMessage(message: string, URLKey: string) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.errors.serviceCodeError = message;
        break;
      case ICD10_RESTRICTION_KEY:
        this.errors.ICD10SaveError = message;
        break;
      case SFDA_RESTRICTION_KEY:
        this.errors.sfdaError = message;
        break;
      case PBM_RESTRICTION_KEY:
        this.errors.pbmConfigurationError = message;
        break;
      case NET_AMOUNT_RESTRICTION_KEY:
        this.errors.netAmountConfigurationError = message;
        break;
    }
  }

  setComponentLoading(URLKey: string, componentLoading: boolean) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.componentLoading.serviceCode = componentLoading;
        break;
      case ICD10_RESTRICTION_KEY:
        this.componentLoading.ICD10Validation = componentLoading;
        break;
      case SFDA_RESTRICTION_KEY:
        this.componentLoading.sfda = componentLoading;
        break;
      case PBM_RESTRICTION_KEY:
        this.componentLoading.pbmConfiguration = componentLoading;
        break;
    }
  }

  setSaveError(URLKey: string, value: any) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.errors.serviceCodeSaveError = value;
        break;
      case ICD10_RESTRICTION_KEY:
        this.errors.ICD10SaveError = value;
        break;
      case SFDA_RESTRICTION_KEY:
        this.errors.sfdaSaveError = value;
        break;
      case PBM_RESTRICTION_KEY:
        this.errors.pbmConfigurationSaveError = value;
        break;
      case NET_AMOUNT_RESTRICTION_KEY:
        this.errors.netAmountConfigurationSaveError = value;
        break;
    }

  }

  setSaveSuccess(URLKey: string, value: any) {
    switch (URLKey) {
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.success.serviceCodeSaveSuccess = value;
        break;
      case ICD10_RESTRICTION_KEY:
        this.success.ICD10SaveSuccess = value;
        break;
      case SFDA_RESTRICTION_KEY:
        this.success.sfdaSaveSuccess = value;
        break;
      case PBM_RESTRICTION_KEY:
        this.success.pbmConfigurationSaveSuccess = value;
        break;
      case NET_AMOUNT_RESTRICTION_KEY:
        this.success.netAmountConfigurationSaveSuccess = value;
        break;
    }
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


  get isLoading() {
    return this.sharedServices.loading;
  }


  isPriceUnitDisabled(payerId: string) {
    return !this.newServiceValidationSettings[payerId];
  }


  getDatabaseConfig() {
    this.componentLoading.midtable = true;
    this.errors.midtableError = null;
    this.errors.midtableSaveError = null;
    this.success.midtableSaveSuccess = null;
    this.dbMapping.getDatabaseConfig(this.selectedProvider).subscribe(event => {

      if (event instanceof HttpResponse) {
        const data = event.body['dbObject'];
        if (data != null) {
          this.addDbConfigForm.patchValue({
            dbType: data.dbType,
            hostName: data.hostName,
            port: data.port,
            databaseName: data.databaseName,
            dbUserName: data.dbUserName,
            dbPassword: data.dbPassword
          });
        } else {
          this.addDbConfigForm.reset();
        }
        this.componentLoading.midtable = false;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.midtableError = 'Could not load mid tables config, please try again later.';
        }
      }
      this.componentLoading.midtable = false;
    });
  }

  addDatabaseConfig() {
    this.errors.midtableSaveError = null;
    this.success.midtableSaveSuccess = null;
    if (this.addDbConfigForm.value.hostName == null && this.addDbConfigForm.value.port == null
      && this.addDbConfigForm.value.databaseName == null && this.addDbConfigForm.value.dbUserName == null
      && this.addDbConfigForm.value.dbPassword == null) {
      return true;
    }
    if (this.addDbConfigForm.dirty) {
      if (this.addDbConfigForm.valid) {
        if (this.addDbConfigForm.controls['dbType'].untouched && this.addDbConfigForm.controls['hostName'].untouched
          && this.addDbConfigForm.controls['port'].untouched && this.addDbConfigForm.controls['databaseName'].untouched
          && this.addDbConfigForm.controls['dbUserName'].untouched && this.addDbConfigForm.controls['dbPassword'].untouched) {
          return true;
        }
        const body = {
          dbType: this.addDbConfigForm.value.dbType,
          hostName: this.addDbConfigForm.value.hostName.trim(),
          port: this.addDbConfigForm.value.port,
          databaseName: this.addDbConfigForm.value.databaseName.trim(),
          dbUserName: this.addDbConfigForm.value.dbUserName.trim(),
          dbPassword: this.addDbConfigForm.value.dbPassword.trim(),
          providerId: this.selectedProvider
        };
        if (body.hostName == '' && body.port == null && body.databaseName == '' && body.dbUserName == ''
          && body.dbPassword == '') {
          this.dbMapping.deleteDatabaseConfig(this.selectedProvider).subscribe(event => {
            if (event instanceof HttpResponse) {
              const data = event.body['response'];
              if (data) {
                this.getDatabaseConfig();
                this.success.midtableSaveSuccess = 'Data save successfully';
              } else {
                this.errors.midtableSaveError = 'Could not save mid table configuration !';
              }
              this.componentLoading.midtable = false;
            }
          }, error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status != 404) {
                this.errors.midtableSaveError = 'Could not add db config, please try again later.';
              }
            }
            this.componentLoading.midtable = false;
          });
          return false;
        }
        this.componentLoading.midtable = true;
        this.dbMapping.setDatabaseConfig(this.selectedProvider, body).subscribe(event => {
          if (event instanceof HttpResponse) {
            const data = event.body['message'];
            if (data != null) {
              this.getDatabaseConfig();
              this.success.midtableSaveSuccess = 'Data save successfully';
            } else {
              this.errors.midtableSaveError = 'Could not save mid table configuration !';
            }
            this.componentLoading.midtable = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status != 404) {
              this.errors.midtableSaveError = 'Could not add db config, please try again later.';
            }
          }
          this.componentLoading.midtable = false;
        });
        return false;
      }
      if (this.addDbConfigForm.invalid &&
        ((this.addDbConfigForm.value.hostName == null || this.addDbConfigForm.value.hostName.trim() == '')
          || this.addDbConfigForm.value.dbType == null || this.addDbConfigForm.value.port == null
          || (this.addDbConfigForm.value.databaseName == null || this.addDbConfigForm.value.databaseName.trim() == '')
          || (this.addDbConfigForm.value.dbUserName == null || this.addDbConfigForm.value.dbUserName.trim() == '')
          || (this.addDbConfigForm.value.dbPassword == null || this.addDbConfigForm.value.dbPassword.trim() == ''))) {
        this.errors.midtableSaveError = 'Please fill all fields.';
        return true;
      }
      return true;
    }
    return true;
  }

  static test(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }

  validateForm() {
    this.addDbConfigForm.controls['dbType'].clearValidators();
    this.addDbConfigForm.controls['hostName'].clearValidators();
    this.addDbConfigForm.controls['port'].clearValidators();
    this.addDbConfigForm.controls['databaseName'].clearValidators();
    this.addDbConfigForm.controls['dbUserName'].clearValidators();
    this.addDbConfigForm.controls['dbPassword'].clearValidators();
    if (!((this.addDbConfigForm.value.hostName == null || this.addDbConfigForm.value.hostName.trim() == '')
      && this.addDbConfigForm.value.port == null
      && (this.addDbConfigForm.value.databaseName == null || this.addDbConfigForm.value.databaseName.trim() == '')
      && (this.addDbConfigForm.value.dbUserName == null || this.addDbConfigForm.value.dbUserName.trim() == '')
      && (this.addDbConfigForm.value.dbPassword == null || this.addDbConfigForm.value.dbPassword.trim() == ''))) {

      this.addDbConfigForm.controls['dbType'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['hostName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['port'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['databaseName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['dbUserName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['dbPassword'].setValidators([Validators.required]);
    }
    this.addDbConfigForm.controls['dbType'].updateValueAndValidity();
    this.addDbConfigForm.controls['hostName'].updateValueAndValidity();
    this.addDbConfigForm.controls['port'].updateValueAndValidity();
    this.addDbConfigForm.controls['databaseName'].updateValueAndValidity();
    this.addDbConfigForm.controls['dbUserName'].updateValueAndValidity();
    this.addDbConfigForm.controls['dbPassword'].updateValueAndValidity();
  }

  get f() { return this.addDbConfigForm.controls; }

  onPayerMapSetting(payerData, event, index) {
    this.newPayerName[payerData.switchAccountId] = payerData.name;
    if (event.checked && !this.addPayerMappingList.includes(payerData.switchAccountId)) {
      this.addPayerMappingList.push(payerData.switchAccountId);
    } else {
      const temp = this.addPayerMappingList.findIndex(x => x === payerData.switchAccountId);
      this.addPayerMappingList.splice(temp, 1);
    }
  }

  savePayerMapping() {
    this.errors.payerMappingSaveError = null;
    this.success.payerMappingSaveSuccess = null;
    if (this.existingPayers.filter(payer =>
      this.newPayerMappingEnable[payer.payerId]
      && this.newPayerMappingValue[payer.payerId] == ''
    ).length > 0) {
      this.errors.payerMappingSaveError = 'Please fill mapped value for payer.';
      return true;
    }
    const newPayerMapping = this.existingPayers.filter(payer =>
      this.newPayerMappingValue[payer.payerId].trim() != ''
      && this.newPayerMappingValue[payer.payerId] != payer.mappingName
    );
    this.addPayerMappingList = newPayerMapping.map(payer => payer.payerId);
    const toDeletePayerMapping = this.existingPayers.filter(payer =>
      payer.mappingName != '' && !this.newPayerMappingEnable[payer.payerId]
    );
    this.deletePayerMappingList = toDeletePayerMapping.map(payer => payer.payerId);

    if (this.addPayerMappingList.length == 0 && this.deletePayerMappingList.length == 0) {
      return true;
    }
    const selectedPayer = [];
    if (this.addPayerMappingList.length > 0) {
      this.addPayerMappingList.forEach(id => {
        const data = {
          payerId: id,
          mapPayerName: this.newPayerMappingValue[id],
          payerName: this.newPayerName[id]
        };
        selectedPayer.push(data);
      });
      this.componentLoading.payerMapping = true;
      this.dbMapping.savePayerMapping(this.selectedProvider, selectedPayer).subscribe(event => {
        if (event instanceof HttpResponse) {
          const data = event.body['response'];
          if (data) {
            this.getPayerMapping();
            this.success.payerMappingSaveSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.payerMappingSaveError = 'Could not save payer mapping details !';
          }
          this.componentLoading.payerMapping = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.payerMappingSaveError = 'Could not change payer mapping, please try again later.';
          }
        }
        this.componentLoading.payerMapping = false;
      });
    }

    const deletePayers = [];
    if (this.deletePayerMappingList.length > 0) {
      this.deletePayerMappingList.forEach(id => {
        const data = {
          payerId: id
        };
        deletePayers.push(data);
      });
      this.componentLoading.payerMapping = true;
      // call delete function
      this.dbMapping.deletePayerMapping(this.selectedProvider, deletePayers).subscribe(event => {
        this.deletePayerMappingList = [];
        if (event instanceof HttpResponse) {
          const data = event.body['response'];
          if (data) {
            this.getPayerMapping();
            this.success.payerMappingSaveSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.payerMappingSaveError = 'Could not save payer mapping details !';
          }
          this.componentLoading.payerMapping = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.payerMappingSaveError = 'Could not change payer mapping, please try again later.';
          }
        }
        this.componentLoading.payerMapping = false;
      });
    }
    return false;
  }
  getPayerMapping() {
    this.componentLoading.payerMapping = true;
    this.errors.payerMappingError = null;
    this.errors.payerMappingSaveError = null;
    this.success.payerMappingSaveSuccess = null;
    this.dbMapping.getPayerMapping(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const response = event.body['response'];
        if (response) {
          const mappingList = event.body['mappingList'];
          this.existingPayers = this.existingPayers.filter(payer => mappingList.findIndex(payer1 => payer1.payerId == payer.payerId));
          if (mappingList.length > 0) {
            mappingList.forEach(payer => {
              this.newPayerMappingEnable[payer.payerId] = true;
              this.newPayerMappingValue[payer.payerId] = payer.mappingName;
              this.payerMappingValue[payer.payerId] = payer.mappingName;
              this.newPayerName[payer.payerId] = payer.payerName;
              this.addPayerMappingList.push(payer.payerId);
              this.existingPayers.push(payer);
            });
          }
        }
        this.componentLoading.payerMapping = false;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.payerMappingError = 'Could not load payer mapping, please try again later.';
        }
      }
      this.componentLoading.payerMapping = false;
    });
  }
  get selectedProviderName() {
    return this.providers.find(provider => provider.switchAccountId == this.selectedProvider).name;
  }
  get selectedProviderCode() {
    return this.providers.find(provider => provider.switchAccountId == this.selectedProvider).code;
  }

  addProviderMapping() {
    this.errors.providerMappingSaveError = null;
    this.success.providerMappingSaveSuccess = null;
    if (this.providerMappingController.value != null &&
      this.providerMappingController.value != this.providerMappingValue) {
      if (this.providerMappingController.value.trim() == '') {
        this.componentLoading.providerMapping = true;
        this.dbMapping.deleteProviderMapping(this.selectedProvider).subscribe(event => {
          if (event instanceof HttpResponse) {
            const data = event.body['response'];
            if (data) {
              this.getProviderMapping();
              this.success.providerMappingSaveSuccess = 'Settings were saved successfully.';
            } else {
              this.errors.providerMappingSaveError = 'Could not save provider mapping details !';
            }
            this.componentLoading.providerMapping = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status != 404) {
              this.errors.providerMappingSaveError = 'Could not save provider mapping, please try again later.';
            }
          }
          this.componentLoading.providerMapping = false;
        });
        return false;
      }
      const body = {
        providerCode: this.selectedProviderCode,
        mappingProviderCode: this.providerMappingController.value
      };
      this.componentLoading.providerMapping = true;
      this.dbMapping.setProviderMapping(body, this.selectedProvider).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.providerMappingValue = body.mappingProviderCode;
          const data = event.body['message'];
          if (data != null) {
            this.getProviderMapping();
            this.success.providerMappingSaveSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.providerMappingSaveError = 'Could not save provider mapping details !';
          }
          this.componentLoading.providerMapping = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.providerMappingSaveError = 'Could not save provider mapping, please try again later.';
          }
        }
        this.componentLoading.providerMapping = false;
      });
      return false;
    }
    return true;
  }

  getProviderMapping() {
    this.componentLoading.providerMapping = true;
    this.errors.providerMappingError = null;
    this.errors.providerMappingSaveError = null;
    this.success.providerMappingSaveSuccess = null;
    this.dbMapping.getProviderMapping(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const data = event.body['providerMapping'];
        if (data != null) {
          this.providerMappingController.setValue(data.mappingProviderCode);
          this.providerMappingValue = data.mappingProviderCode;
        } else {
          this.providerMappingController.setValue(null);
        }
      }
      this.componentLoading.providerMapping = false;
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.providerMappingError = 'Could not load provider settings, please try again later.';
        }
      }
      this.componentLoading.providerMapping = false;
    });
  }
  resetDbAndMapping() {

    this.newPayerMappingEnable = {};
    this.newPayerMappingValue = {};
    this.payerMappingValue = {};
    this.newPayerName = {};
    this.addPayerMappingList = [];
    this.addDbConfigForm.reset();
    this.providerMappingController.setValue('');
  }
  getNetAmountAccuracy() {
    this.componentLoading.netAmount = true;
    this.errors.netAmountConfigurationError = null;
    this.errors.netAmountConfigurationSaveError = null;
    this.success.netAmountConfigurationSaveSuccess = null;
    this.dbMapping.getNetAmountAccuracy(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const data: any = event.body;
        if (event.status === 200 && data !== null) {
          this.netAmountValue = parseInt(data);
          this.netAmountController.setValue(data);
        } else {
          this.netAmountValue = null;
          this.netAmountController.setValue(null);
        }
      }
      this.componentLoading.netAmount = false;
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.netAmountConfigurationError = 'Could not load net amount settings, please try again later.';
        }
      }
      this.componentLoading.netAmount = false;
      this.netAmountValue = null;
      this.netAmountController.setValue(null);
    });
  }
  setNetAmountAccuracy() {
    this.errors.netAmountConfigurationError = null;
    this.errors.netAmountConfigurationSaveError = null;
    this.success.netAmountConfigurationSaveSuccess = null;
    if (this.netAmountController.value === this.netAmountValue && this.netAmountController.value !== null)
      return false;

    this.componentLoading.netAmount = true;
    this.dbMapping.setNetAmountAccuracy(this.selectedProvider, this.netAmountController.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.setSaveSuccess(NET_AMOUNT_RESTRICTION_KEY, 'Settings were saved successfully');
        } else {
          this.netAmountController.setValue(null);
        }
        this.componentLoading.netAmount = false;
        return true;
      }
      return false;

    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.netAmountConfigurationSaveError = 'Could not change payer mapping, please try again later.';
        }
        else {
          this.setSaveError(NET_AMOUNT_RESTRICTION_KEY, 'Could not save settings, please try again later.');
        }
      }
      this.componentLoading.netAmount = false
      return false;
    });
    return false;
  }
}
