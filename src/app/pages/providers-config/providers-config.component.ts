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
import { Location, DatePipe } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';


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
    NphiesPayerError?: string,
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
    NphiespayerMappingError?: string,
    payerMappingSaveError?: string,
    NphiesMappingSaveError?: string,

    NphiesPayerMappingError?: string,
    providerMappingError?: string,
    providerMappingSaveError?: string,
    pbmConfigurationError?: string,
    pbmConfigurationSaveError?: string,
    netAmountConfigurationError?: string,
    netAmountConfigurationSaveError?: string,
    pollTypeConfigurationError?: string,
    pollTypeConfigurationSaveError?: string,
  } = {};
  success: {
    serviceCodeSaveSuccess?: string,
    portalUserSaveSuccess?: string,
    ICD10SaveSuccess?: string,
    sfdaSaveSuccess?: string,
    midtableSaveSuccess?: string,
    payerMappingSaveSuccess?: string,
    NphiesPayerMappingSuccess?: string,
    providerMappingSaveSuccess?: string,
    pbmConfigurationSaveSuccess?: string,
    netAmountConfigurationSaveSuccess?: string
    pollTypeConfigurationSaveSuccess?: string

  } = {};
  componentLoading = {
    serviceCode: true,
    portalUser: true,
    ICD10Validation: true,
    sfda: true,
    pbmConfiguration: true,
    midtable: true,
    payerMapping: true,
    NphiesPayerMapping: true,
    providerMapping: true,
    netAmount: true,
    pollType: true
  };

  selectedProvider: string;
  selectednphiesPayerId: string;
  associatedPayers: any[] = [];
  associatedNphiePayers: any[] = [];
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
  newNphiesPayerMappingEnable: { [key: number]: boolean } = {};
  newNphiesPayerMappingValue: { [key: number]: string } = {};
  newNphiesPayerName: { [key: number]: string } = {};
  newNphiesPayerTpaId: { [key: number]: string } = {};
  newNphiesPayerTpaName: { [key: number]: string } = {};
  deleteNphiesPayerMappingList: any[] = [];

  addPayerMappingList: any[] = [];
  addNphiesPayerMappingList: any[] = [];
  existingPayers: any[] = [];
  existingNphiePayers: any[] = [];
  providerMappingController: FormControl = new FormControl('');
  restrictExtractionDateController: FormControl = new FormControl(new Date(2021, 0, 1));
  providerMappingValue: string;
  restrictExtractionDateValue: Date;
  PBMUserController: FormControl = new FormControl('');
  PBMPasswordController: FormControl = new FormControl('');
  PBMCheckValueController: FormControl = new FormControl('');
  payerMappingValue: { [key: number]: string } = {};
  isPBMLoading = false;
  exisingServiceAndPriceValidationData: any = [];
  netAmountController: FormControl = new FormControl('');
  netAmountValue: number;
  pollTypeController: FormControl = new FormControl('');
  pollTypeValue: string;
  pollTypePeriodController: FormControl = new FormControl('');
  pollTypePeriod: number;
  pollTypePeriodUnitController: FormControl = new FormControl('');
  pollTypePeriodUnit: string;

  isBothSame = true;
  dbConfigs = [];

  organizations: {
    id: string
    code: string,
    display: string,
    displayAlt: string,
    subList: {
      value: string,
      id: string,
      code: string,
      display: string,
      displayAlt: string
    }[]
  }[] = [];

  constructor(
    public datepipe: DatePipe,
    private superAdmin: SuperAdminService,
    private router: Router,
    private sharedServices: SharedServices,
    private location: Location,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private dbMapping: DbMappingService) {
    sharedServices.loadingChanged.next(true);
  }

  static test(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }
  //
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
              this.getLovPayers();

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
      // midTablesType: [''],
      waseelDbType: [''],
      waseelHostName: [''],
      waseelPort: [''],
      waseelDatabaseName: [''],
      waseelDbUserName: [''],
      waseelDbPassword: [''],

      nphiesDbType: [''],
      nphiesHostName: [''],
      nphiesPort: [''],
      nphiesDatabaseName: [''],
      nphiesDbUserName: [''],
      nphiesDbPassword: [''],
    });
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
    this.location.go(`/administration/config/providers/${providerId}`);
    this.reset();
    this.getAssociatedPayers();
    this.getLovPayers();

  }

  getAssociatedPayers() {
    if (this.selectedProvider == null || this.selectedProvider == '') { return; }
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAssociatedPayers(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.newPBMValidationSettings['101'] = false;
          this.associatedPayers = event.body;
          this.associatedPayers.forEach(payer => {
            // this.newServiceValidationSettings[payer.switchAccountId] = false;
            // this.newPriceUnitSettings[payer.switchAccountId] = false;

            this.newICD10ValidationSettings[payer.switchAccountId] = false;
            this.newSFDAValidationSettings[payer.switchAccountId] = false;
            // new changes for payer mapping
            this.existingPayers.push({
              payerId: payer.switchAccountId, payerName: payer.name, mappingName: '',
              providerId: this.selectedProvider
            });
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

  getLovPayers() {
    this.componentLoading.NphiesPayerMapping = true;
    this.providerNphiesSearchService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.associatedNphiePayers = [];
          body.forEach(x => {
            x.subList.forEach(y => {
              y.nphiesPayerId = y.code;
              y.payerName = y.display;
              y.tpaNphiesId = x.code;
              y.tpaName = x.display;
              y.combination = x.code + ':' + y.code;
            });
            this.associatedNphiePayers = [...this.associatedNphiePayers, ...x.subList];
          });

          this.associatedNphiePayers.forEach(x => {
            this.newNphiesPayerMappingValue[x.combination] = '';
            this.newNphiesPayerName[x.combination] = x.display;
            this.newNphiesPayerTpaId[x.combination] = x.tpaNphiesId;
            this.newNphiesPayerTpaName[x.combination] = x.tpaName != 'None' ? x.tpaName : null;
            this.addNphiesPayerMappingList = [];
          });

          this.componentLoading.NphiesPayerMapping = false;
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.NphiespayerMappingError = 'Could not load payer mapping, please try again later.';
        }
      }
      this.componentLoading.NphiesPayerMapping = false;
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
            };
            this.exisingServiceAndPriceValidationData.push(obj);
            // payer.hasAssociatedPriceList = settingData.isEnabled === '1' ? true : false;
          } else {
            this.newServiceValidationSettings[payer.switchAccountId] = false;
            this.newPriceUnitSettings[payer.switchAccountId] = false;
            // payer.hasAssociatedPriceList = false;
            const obj = {
              payerId: payer.switchAccountId,
              isServiceCodeEnable: '0',
              isPriceUnitEnable: '0'
            };
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
    this.getNphiesPayerMapping();
    this.getProviderMapping();
    // ####### Chages on 02-01-2021 end

    // ####### changes on 05-07-2021
    this.serviceAndPriceValidationSetting();

    // Changes on 19-07-2021
    this.getNetAmountAccuracy();

    this.getPollConfiguration();
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
      this.componentLoading.NphiesPayerMapping ||
      this.componentLoading.providerMapping ||
      this.componentLoading.pollType) {
      return;
    }

    this.resetUserMessages();
    const portalUserFlag = this.savePortalUserSettings();
    // const serviceCodeFlag = this.saveSettings(SERVICE_CODE_RESTRICTION_KEY, this.newServiceValidationSettings,
    // this.serviceCodeValidationSettings);
    const icd10Flag = this.saveSettings(ICD10_RESTRICTION_KEY, this.newICD10ValidationSettings, this.ICD10ValidationSettings);
    // const priceUnitFlag = this.saveSettings(VALIDATE_RESTRICT_PRICE_UNIT, this.newPriceUnitSettings, this.priceUnitSettings);
    const sfdaFlag = this.saveSettings(SFDA_RESTRICTION_KEY, this.newSFDAValidationSettings, this.sfdaValidationSettings);
    const pbmFlag = this.saveSettings(PBM_RESTRICTION_KEY, this.newPBMValidationSettings, this.pbmValidationSettings);
    // change on 02-01-2021 start
    const dbFlag = this.addDatabaseConfig();
    const payerFlag = this.savePayerMapping();
    const nphiesPayerFlag = this.saveNphiesPayerMapping();
    const providerFlag = this.addProviderMapping();
    const priceListFlag = this.updatePriceListValidationSetting();
    const netAmountFlag = this.setNetAmountAccuracy();
    const pollConfigFlag = this.savePollConfiguration();
    // change on 02-01-2021 end
    // && priceUnitFlag && serviceCodeFlag
    if (portalUserFlag && icd10Flag && sfdaFlag && dbFlag
      && payerFlag && nphiesPayerFlag && providerFlag && pbmFlag && priceListFlag && netAmountFlag && pollConfigFlag) {
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
        };
        priceValidationData.push(obj);
      }
    });

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
        } else {
          this.setSaveError(SERVICE_CODE_RESTRICTION_KEY, 'Could not save settings, please try again later.');
        }
      }
      this.componentLoading.serviceCode = false;
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
          payerId,
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
          payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.priceUnitSettings.push({
          providerId: this.selectedProvider,
          payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case ICD10_RESTRICTION_KEY:
        this.ICD10ValidationSettings.push({
          providerId: this.selectedProvider,
          payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case SFDA_RESTRICTION_KEY:
        this.sfdaValidationSettings.push({
          providerId: this.selectedProvider,
          payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        });
        break;
      case PBM_RESTRICTION_KEY:
        this.pbmValidationSettings.push({
          providerId: this.selectedProvider,
          payerId,
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
    this.dbMapping.getDatabaseConfigList(this.selectedProvider).subscribe(event => {

      if (event instanceof HttpResponse) {
        const data = event.body['dbObject'];
        if (data != null) {
          this.dbConfigs = data;
          this.isBothSame = data.length > 1 ? false : true;
          data.forEach(x => {
            if (x.midTableType === 'WASEEL_MID_TABLES' || x.midTableType === 'BOTH') {
              this.addDbConfigForm.patchValue({
                waseelDbType: x.dbType,
                waseelHostName: x.hostName,
                waseelPort: x.port,
                waseelDatabaseName: x.databaseName,
                waseelDbUserName: x.dbUserName,
                waseelDbPassword: x.dbPassword,
              });
            } else if (x.midTableType === 'NPHIES_MID_TABLES') {
              this.addDbConfigForm.patchValue({
                nphiesDbType: x.dbType,
                nphiesHostName: x.hostName,
                nphiesPort: x.port,
                nphiesDatabaseName: x.databaseName,
                nphiesDbUserName: x.dbUserName,
                nphiesDbPassword: x.dbPassword
              });
            }
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
    if (this.addDbConfigForm.value.waseelHostName == null && this.addDbConfigForm.value.waseelPort == null
      && this.addDbConfigForm.value.waseelDatabaseName == null && this.addDbConfigForm.value.waseelDbUserName == null
      && this.addDbConfigForm.value.waseelDbPassword == null) {
      return true;
    }

    if (!this.isBothSame) {
      if (this.addDbConfigForm.value.nphiesHostName == null && this.addDbConfigForm.value.nphiesPort == null
        && this.addDbConfigForm.value.nphiesDatabaseName == null && this.addDbConfigForm.value.nphiesDbUserName == null
        && this.addDbConfigForm.value.nphiesDbPassword == null) {
        return true;
      }
    }

    let bothStatus = this.dbConfigs.length > 1 ? false : true;

    if (this.addDbConfigForm.dirty || (this.isBothSame !== bothStatus)) {
      if (this.addDbConfigForm.valid) {

        if (this.isBothSame === bothStatus) {

          if (this.isBothSame) {
            if (this.addDbConfigForm.controls['waseelDbType'].untouched
              && this.addDbConfigForm.controls['waseelHostName'].untouched
              && this.addDbConfigForm.controls['waseelPort'].untouched && this.addDbConfigForm.controls['waseelDatabaseName'].untouched
              && this.addDbConfigForm.controls['waseelDbUserName'].untouched
              && this.addDbConfigForm.controls['waseelDbPassword'].untouched) {
              return true;
            }
          } else {
            if (this.addDbConfigForm.controls['waseelDbType'].untouched
              && this.addDbConfigForm.controls['waseelHostName'].untouched
              && this.addDbConfigForm.controls['waseelPort'].untouched && this.addDbConfigForm.controls['waseelDatabaseName'].untouched
              && this.addDbConfigForm.controls['waseelDbUserName'].untouched && this.addDbConfigForm.controls['waseelDbPassword'].untouched
              && this.addDbConfigForm.controls['nphiesDbType'].untouched
              && this.addDbConfigForm.controls['nphiesHostName'].untouched
              && this.addDbConfigForm.controls['nphiesPort'].untouched && this.addDbConfigForm.controls['nphiesDatabaseName'].untouched
              && this.addDbConfigForm.controls['nphiesDbUserName'].untouched
              && this.addDbConfigForm.controls['nphiesDbPassword'].untouched) {
              return true;
            }
          }

        }

        const body = [];

        body.push({
          midTableType: this.isBothSame ? 'BOTH' : 'WASEEL_MID_TABLES',
          dbType: this.addDbConfigForm.value.waseelDbType,
          hostName: this.addDbConfigForm.value.waseelHostName.trim(),
          port: this.addDbConfigForm.value.waseelPort,
          databaseName: this.addDbConfigForm.value.waseelDatabaseName.trim(),
          dbUserName: this.addDbConfigForm.value.waseelDbUserName.trim(),
          dbPassword: this.addDbConfigForm.value.waseelDbPassword.trim(),
          providerId: this.selectedProvider
        });

        if (!this.isBothSame) {
          body.push({
            midTableType: 'NPHIES_MID_TABLES',
            dbType: this.addDbConfigForm.value.nphiesDbType,
            hostName: this.addDbConfigForm.value.nphiesHostName.trim(),
            port: this.addDbConfigForm.value.nphiesPort,
            databaseName: this.addDbConfigForm.value.nphiesDatabaseName.trim(),
            dbUserName: this.addDbConfigForm.value.nphiesDbUserName.trim(),
            dbPassword: this.addDbConfigForm.value.nphiesDbPassword.trim(),
            providerId: this.selectedProvider
          });
        }

        body.forEach(x => {
          if (x.hostName == '' && x.port == null && x.databaseName == '' && x.dbUserName == ''
            && x.dbPassword == '') {
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
        });


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
      if (this.addDbConfigForm.invalid && this.isBothSame &&
        ((this.addDbConfigForm.value.waseelHostName == null || this.addDbConfigForm.value.waseelHostName.trim() == '')
          || this.addDbConfigForm.value.waseelDbType == null || this.addDbConfigForm.value.waseelPort == null
          || (this.addDbConfigForm.value.waseelDatabaseName == null || this.addDbConfigForm.value.waseelDatabaseName.trim() == '')
          || (this.addDbConfigForm.value.waseelDbUserName == null || this.addDbConfigForm.value.waseelDbUserName.trim() == '')
          || (this.addDbConfigForm.value.waseelDbPassword == null || this.addDbConfigForm.value.waseelDbPassword.trim() == ''))) {
        this.errors.midtableSaveError = 'Please fill all fields.';
        return true;
      }

      if (this.addDbConfigForm.invalid && !this.isBothSame &&
        (((this.addDbConfigForm.value.waseelHostName == null || this.addDbConfigForm.value.waseelHostName.trim() == '')
          || this.addDbConfigForm.value.waseelDbType == null || this.addDbConfigForm.value.waseelPort == null
          || (this.addDbConfigForm.value.waseelDatabaseName == null || this.addDbConfigForm.value.waseelDatabaseName.trim() == '')
          || (this.addDbConfigForm.value.waseelDbUserName == null || this.addDbConfigForm.value.waseelDbUserName.trim() == '')
          || (this.addDbConfigForm.value.waseelDbPassword == null || this.addDbConfigForm.value.waseelDbPassword.trim() == '')) ||

          ((this.addDbConfigForm.value.nphiesHostName == null || this.addDbConfigForm.value.nphiesHostName.trim() == '')
            || this.addDbConfigForm.value.nphiesDbType == null || this.addDbConfigForm.value.nphiesPort == null
            || (this.addDbConfigForm.value.nphiesDatabaseName == null || this.addDbConfigForm.value.nphiesDatabaseName.trim() == '')
            || (this.addDbConfigForm.value.nphiesDbUserName == null || this.addDbConfigForm.value.nphiesDbUserName.trim() == '')
            || (this.addDbConfigForm.value.nphiesDbPassword == null || this.addDbConfigForm.value.nphiesDbPassword.trim() == '')))) {
        this.errors.midtableSaveError = 'Please fill all fields.';
        return true;
      }

      return true;
    }
    return true;
  }

  validateForm() {
    // this.addDbConfigForm.controls['midTablesType'].clearValidators();
    this.addDbConfigForm.controls['waseelDbType'].clearValidators();
    this.addDbConfigForm.controls['waseelHostName'].clearValidators();
    this.addDbConfigForm.controls['waseelPort'].clearValidators();
    this.addDbConfigForm.controls['waseelDatabaseName'].clearValidators();
    this.addDbConfigForm.controls['waseelDbUserName'].clearValidators();
    this.addDbConfigForm.controls['waseelDbPassword'].clearValidators();
    if (!((this.addDbConfigForm.value.waseelHostName == null || this.addDbConfigForm.value.waseelHostName.trim() == '')
      && this.addDbConfigForm.value.waseelPort == null
      && (this.addDbConfigForm.value.waseelDatabaseName == null || this.addDbConfigForm.value.waseelDatabaseName.trim() == '')
      && (this.addDbConfigForm.value.waseelDbUserName == null || this.addDbConfigForm.value.waseelDbUserName.trim() == '')
      && (this.addDbConfigForm.value.waseelDbPassword == null || this.addDbConfigForm.value.waseelDbPassword.trim() == ''))) {
      // this.addDbConfigForm.controls['midTablesType'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelDbType'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelHostName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelPort'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelDatabaseName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelDbUserName'].setValidators([Validators.required]);
      this.addDbConfigForm.controls['waseelDbPassword'].setValidators([Validators.required]);
    }
    // this.addDbConfigForm.controls['midTablesType'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelDbType'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelHostName'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelPort'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelDatabaseName'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelDbUserName'].updateValueAndValidity();
    this.addDbConfigForm.controls['waseelDbPassword'].updateValueAndValidity();

    if (!this.isBothSame) {
      this.addDbConfigForm.controls['nphiesDbType'].clearValidators();
      this.addDbConfigForm.controls['nphiesHostName'].clearValidators();
      this.addDbConfigForm.controls['nphiesPort'].clearValidators();
      this.addDbConfigForm.controls['nphiesDatabaseName'].clearValidators();
      this.addDbConfigForm.controls['nphiesDbUserName'].clearValidators();
      this.addDbConfigForm.controls['nphiesDbPassword'].clearValidators();
      if (!((this.addDbConfigForm.value.nphiesHostName == null || this.addDbConfigForm.value.nphiesHostName.trim() == '')
        && this.addDbConfigForm.value.nphiesPort == null
        && (this.addDbConfigForm.value.nphiesDatabaseName == null || this.addDbConfigForm.value.nphiesDatabaseName.trim() == '')
        && (this.addDbConfigForm.value.nphiesDbUserName == null || this.addDbConfigForm.value.nphiesDbUserName.trim() == '')
        && (this.addDbConfigForm.value.nphiesDbPassword == null || this.addDbConfigForm.value.nphiesDbPassword.trim() == ''))) {
        // this.addDbConfigForm.controls['midTablesType'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesDbType'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesHostName'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesPort'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesDatabaseName'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesDbUserName'].setValidators([Validators.required]);
        this.addDbConfigForm.controls['nphiesDbPassword'].setValidators([Validators.required]);
      }
      // this.addDbConfigForm.controls['midTablesType'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesDbType'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesHostName'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesPort'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesDatabaseName'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesDbUserName'].updateValueAndValidity();
      this.addDbConfigForm.controls['nphiesDbPassword'].updateValueAndValidity();
    }
  }

  get f() { return this.addDbConfigForm.controls; }

  onPayerMapSetting(payerData, event, index) {

    this.newPayerName[payerData.switchAccountId] = payerData.name;
    this.newPayerMappingEnable[payerData.switchAccountId] = event.checked
    if (event.checked && !this.addPayerMappingList.includes(payerData.switchAccountId)) {
      this.addPayerMappingList.push(payerData.switchAccountId);
    } else {
      const temp = this.addPayerMappingList.findIndex(x => x === payerData.switchAccountId);
      this.addPayerMappingList.splice(temp, 1);
    }
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
              this.newPayerMappingEnable[payer.payerId] = payer.enabled;
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

  getNphiesPayerMapping() {
    this.componentLoading.NphiesPayerMapping = true;
    this.errors.NphiesMappingSaveError = null;
    this.errors.NphiesPayerError = null;
    this.success.NphiesPayerMappingSuccess = null;
    this.dbMapping.getNphiesPayerMapping(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {      
        const response = event.body['response'];

        if (response) {
          const mappingList = event.body['mappingList'];
          this.existingNphiePayers = [];
          if (mappingList.length > 0) {
            mappingList.forEach(x => {
              x.combination = x.tpaNphiesId +':'+ x.nphiesPayerId;
              this.newNphiesPayerMappingValue[x.combination] = x.mappingPayerValue;              
              this.newNphiesPayerTpaId[x.combination] = x.tpaNphiesId;
              this.newNphiesPayerName[x.combination] = x.payerName;
              this.newNphiesPayerTpaName[x.combination] = x.tpaName != 'None' ? x.tpaName : null;              

              this.addNphiesPayerMappingList.push(x.combination);
              this.existingNphiePayers.push(x);
            });
          }
        }
        this.componentLoading.NphiesPayerMapping = false;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.NphiespayerMappingError = 'Could not load payer mapping, please try again later.';
        }
      }
      this.componentLoading.NphiesPayerMapping = false;

    });

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

    // const newPayerMapping = this.existingPayers.filter(payer =>
    //   (this.newPayerMappingValue[payer.payerId].trim() != ''
    //     && this.newPayerMappingValue[payer.payerId] != payer.mappingName) &&
    //   this.newPayerMappingEnable[payer.payerId] != payer.enabled
    // );

    const newPayerMapping = this.existingPayers.filter(payer =>
      // tslint:disable-next-line:max-line-length
      this.newPayerMappingValue[payer.payerId] && ((this.newPayerMappingValue[payer.payerId].trim() != '' && this.newPayerMappingValue[payer.payerId] != payer.mappingName) || (this.newPayerMappingValue[payer.payerId].trim() != '' && this.newPayerMappingEnable[payer.payerId] != payer.enabled))
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
          payerName: this.newPayerName[id],
          enabled: this.newPayerMappingEnable[id]

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

  saveNphiesPayerMapping() {

    this.errors.NphiesMappingSaveError = null;
    this.success.NphiesPayerMappingSuccess = null;
          
    const newNphiesPayerMapping = this.existingNphiePayers.filter(payer =>
      // tslint:disable-next-line:max-line-length
      this.newNphiesPayerMappingValue[payer.combination] && ((this.newNphiesPayerMappingValue[payer.combination].trim() != '' && this.newNphiesPayerMappingValue[payer.combination] != payer.mappingPayerValue))
    );

    this.addNphiesPayerMappingList = newNphiesPayerMapping.map(payer => payer.combination);

    this.addNphiesPayerMappingList = [...this.addNphiesPayerMappingList, ...this.associatedNphiePayers.filter(x => this.newNphiesPayerMappingValue[x.combination] && !this.addNphiesPayerMappingList.find(y => y == x.combination) && !this.existingNphiePayers.find(z => z.combination == x.combination)).map(x => x.combination)];

    const toDeleteNphiesPayerMapping = this.existingNphiePayers.filter(payer =>
      payer.mappingPayerValue !== '' && !this.newNphiesPayerMappingValue[payer.combination]
    );
    this.deleteNphiesPayerMappingList = toDeleteNphiesPayerMapping.map(payer => payer.combination);

    if (this.addNphiesPayerMappingList.length == 0 && this.deleteNphiesPayerMappingList.length == 0) {
      return true;
    }

    const selectedNphiesPayer = [];
    if (this.addNphiesPayerMappingList.length > 0) {
      this.addNphiesPayerMappingList.forEach(id => {
        const data = {
          nphiesPayerId: id.split(':')[1],
          tpaNphiesId: this.newNphiesPayerTpaId[id],
          payerName: this.newNphiesPayerName[id],
          tpaName: this.newNphiesPayerTpaName[id],
          mappingPayerValue: this.newNphiesPayerMappingValue[id]
        };
        selectedNphiesPayer.push(data);
      });      
      this.componentLoading.NphiesPayerMapping = true;
      this.dbMapping.saveNphiesPayerMapping(this.selectedProvider, selectedNphiesPayer).subscribe(event => {
        if (event instanceof HttpResponse) {
          const data = event.body['response'];
          if (data) {
            this.getNphiesPayerMapping();
            this.success.NphiesPayerMappingSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.NphiesMappingSaveError = 'Could not save nphies payer mapping details !';
          }
          this.componentLoading.NphiesPayerMapping = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.NphiesMappingSaveError = 'Could not change nphies payer mapping, please try again later.';
          }
        }
        this.componentLoading.NphiesPayerMapping = false;
      });
    }

    const deleteNphiesPayers = [];
    if (this.deleteNphiesPayerMappingList.length > 0) {
      this.deleteNphiesPayerMappingList.forEach(id => {
        const data = {
          nphiesPayerId: id.split(':')[1],
          tpaNphiesId: this.newNphiesPayerTpaId[id],
        };
        deleteNphiesPayers.push(data);
      });      
      this.componentLoading.NphiesPayerMapping = true;
      // call delete function
      this.dbMapping.deleteNphiesPayerMapping(this.selectedProvider, deleteNphiesPayers).subscribe(event => {
        this.deleteNphiesPayerMappingList = [];
        if (event instanceof HttpResponse) {
          const data = event.body['response'];
          if (data) {
            this.getPayerMapping();
            this.success.NphiesPayerMappingSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.NphiesMappingSaveError = 'Could not save nphies payer mapping details !';
          }
          this.componentLoading.NphiesPayerMapping = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.NphiesMappingSaveError = 'Could not change nphies payer mapping, please try again later.';
          }
        }
        this.componentLoading.NphiesPayerMapping = false;
      });
    }
    return false;
  }

  getTpaName(tpaNphiesId) {
    if (tpaNphiesId !== '-1') {
      return this.organizations.filter(x => x.code === tpaNphiesId)[0] ? this.organizations.filter(x => x.code === tpaNphiesId)[0].display : '';
    } else {
      return '';
    }

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
      (this.providerMappingController.value != this.providerMappingValue ||
        new Date(this.restrictExtractionDateController.value).getTime() != this.restrictExtractionDateValue.getTime())) {
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
        mappingProviderCode: this.providerMappingController.value,
        restrictExtractionDate: this.restrictExtractionDateController.value == null ? null
          : this.datepipe.transform(new Date(this.restrictExtractionDateController.value), 'yyyy-MM-dd')
      };
      this.componentLoading.providerMapping = true;
      this.dbMapping.setProviderMapping(body, this.selectedProvider).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.providerMappingValue = body.mappingProviderCode;
          this.restrictExtractionDateValue = new Date(body.restrictExtractionDate);
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
          this.restrictExtractionDateController.setValue(new Date(data.restrictExtractionDate));
          this.restrictExtractionDateValue = new Date(data.restrictExtractionDate);
        } else {
          this.providerMappingController.setValue(null);
          this.restrictExtractionDateController.setValue(new Date(2021, 0, 1));
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
    this.newNphiesPayerMappingEnable = {};
    this.newPayerMappingValue = {};
    this.newNphiesPayerMappingValue = {};
    this.payerMappingValue = {};
    this.newNphiesPayerName = {};
    this.newNphiesPayerTpaId = {};
    this.newNphiesPayerTpaName = {};
    this.newPayerName = {};
    this.addPayerMappingList = [];
    this.addNphiesPayerMappingList = [];
    this.addDbConfigForm.reset();
    this.providerMappingController.setValue('');
    this.restrictExtractionDateController.setValue(new Date(2021, 0, 1));
    this.pollTypeController.setValue('');
    this.pollTypePeriodController.setValue(6);
    this.pollTypePeriodUnitController.setValue('MONTH');
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

    if (this.netAmountController.value === this.netAmountValue)
      return false;

    if (this.netAmountController.value === '' || this.netAmountController.value === null || this.netAmountController.value === undefined)
      this.netAmountController.setValue(0.5);

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
          this.errors.netAmountConfigurationSaveError = 'Could not change Net Amount Accuracy, please try again later.';
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

  savePollConfiguration() {
    this.errors.pollTypeConfigurationSaveError = null;
    this.success.pollTypeConfigurationSaveSuccess = null;
    if ((this.pollTypeController.value != null && this.pollTypeController.value != this.pollTypeValue)
      || this.pollTypePeriodController.value != this.pollTypePeriod
      || this.pollTypePeriodUnitController.value != this.pollTypePeriodUnit) {
      const body = {
        pollType: this.pollTypeController.value,
        period: this.pollTypePeriodController.value == null ? 6 : this.pollTypePeriodController.value,
        periodUnit: this.pollTypePeriodUnitController.value == null ? 'MONTH' : this.pollTypePeriodUnitController.value
      };
      this.componentLoading.pollType = true;
      this.dbMapping.savePollConfiguration(body, this.selectedProvider).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.pollTypeValue = body.pollType;
          const data = event.body;
          if (data != null) {
            this.getPollConfiguration();
            this.success.pollTypeConfigurationSaveSuccess = 'Settings were saved successfully.';
          } else {
            this.errors.pollTypeConfigurationSaveError = 'Could not save poll configuration details !';
          }
          this.componentLoading.pollType = false;
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status != 404) {
            this.errors.pollTypeConfigurationSaveError = 'Could not save poll configuration, please try again later.';
          }
        }
        this.componentLoading.pollType = false;
      });
      return false;
    }
    return true;
  }

  getPollConfiguration() {
    this.componentLoading.pollType = true;
    this.errors.pollTypeConfigurationError = null;
    this.errors.pollTypeConfigurationSaveError = null;
    this.success.pollTypeConfigurationSaveSuccess = null;
    this.dbMapping.getPollConfiguration(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const data = event.body;
        if (data != null) {
          this.pollTypeController.setValue(data['pollType']);
          this.pollTypeValue = data['pollType'];
          this.pollTypePeriod = data['period'];
          this.pollTypePeriodUnit = data['periodUnit'];
          if ((this.pollTypeValue == 'CLAIM' || this.pollTypeValue == 'PRE_AUTH') && this.pollTypePeriod == null) {
            this.pollTypePeriodController.setValue(6);
          } else {
            this.pollTypePeriodController.setValue(data['period']);
          }
          if ((this.pollTypeValue == 'CLAIM' || this.pollTypeValue == 'PRE_AUTH') && this.pollTypePeriodUnit == null) {
            this.pollTypePeriodUnitController.setValue('MONTH');
          } else {
            this.pollTypePeriodUnitController.setValue(data['periodUnit']);
          }
          // this.pollTypePeriodController.setValue(data['period'] == null ? 6 : data['period']);
          // this.pollTypePeriodUnitController.setValue(data['periodUnit'] == null ? 'MONTH' : data['periodUnit']);
        } else {
          this.pollTypeController.setValue(null);
          this.pollTypePeriodController.setValue(6);
          this.pollTypePeriodUnitController.setValue('MONTH');
        }
      }
      this.componentLoading.pollType = false;
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 404) {
          this.pollTypeController.setValue('ALL');
        }
        if (error.status != 404) {
          this.errors.pollTypeConfigurationError = 'Could not load provider settings, please try again later.';
        }
      }
      this.componentLoading.pollType = false;
    });
  }

  // get isWaseelMidTables() {
  //     return this.addDbConfigForm.value.midTablesType != null && this.addDbConfigForm.value.midTablesType == 'WASEEL_MID_TABLES';
  // }


  // get isNphiesMidTables() {
  //     return this.addDbConfigForm.value.midTablesType != null && this.addDbConfigForm.value.midTablesType == 'NPHIES_MID_TABLES';
  // }
}
