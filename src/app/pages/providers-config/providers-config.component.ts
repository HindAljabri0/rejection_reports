import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SuperAdminService, SERVICE_CODE_VALIDATION_KEY, SERVICE_CODE_RESTRICTION_KEY, ICD10_RESTRICTION_KEY, VALIDATE_RESTRICT_PRICE_UNIT, SFDA_VALIDATION_KEY, SFDA_RESTRICTION_KEY } from 'src/app/services/administration/superAdminService/super-admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { MatSlideToggleChange } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { debug } from 'util';
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

  errors: { providersError?: string, payersError?: string, serviceCodeError?: string, serviceCodeSaveError?: string, portalUserError?: string, portalUserSaveError?: string, ICD10SaveError?: string, sfdaError?: string, sfdaSaveError?: string, midtableError?:string, payerMappingError?: string, providerMappingError?: string } = {};
  success: { serviceCodeSaveSuccess?: string, portalUserSaveSuccess?: string, ICD10SaveSuccess?: string, sfdaSaveSuccess?: string, midtableSuccess?:string, payerMappingSuccess?: string, providerMappingSuccess?: string } = {};
  componentLoading = { serviceCode: true, portalUser: true, ICD10Validation: true, sfda: true, midtable: true, payerMapping: true, providerMapping: true };

  selectedProvider: string;
  associatedPayers: any[] = [];
  serviceCodeValidationSettings: any[] = [];
  serviceCodeRestrictionSettings: any[] = [];
  priceUnitSettings: any[] = [];
  ICD10ValidationSettings: any[] = [];
  sfdaValidationSettings: any[] = [];
  sfdaRestrictionSettings: any[] = [];
  newServiceCodeValidationSettings: { [key: string]: boolean } = {};
  newServiceRestrictionSettings: { [key: string]: boolean } = {};
  newPriceUnitSettings: { [key: string]: boolean } = {};
  newICD10ValidationSettings: { [key: string]: boolean } = {};
  newSFDAValidationSettings: { [key: string]: boolean } = {};
  newSFDARestrictionSettings: { [key: string]: boolean } = {};
  portalUserSettings: any;
  portalUsernameController: FormControl = new FormControl('');
  portalPasswordController: FormControl = new FormControl('');
  addDbConfigForm: FormGroup;
  newPayerMappingEnable: {[key:number]: boolean} = {};
  newPayerMappingValue: {[key:number]: string} = {};
  newPayerName:{[key:number]: string} = {};
  deletePayerMappingList: any[] = [];
  addPayerMappingList: any[] = [];
  existingPayers : any[];
  providerMappingController: FormControl = new FormControl('');

  constructor(private superAdmin: SuperAdminService,
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
    this.addDbConfigForm = this.formBuilder.group({
      dbType: ['', [Validators.required]],
      hostName: ['', [Validators.required, ProvidersConfigComponent.test]],
      port: ['', [Validators.required]],
      databaseName: ['', [Validators.required, ProvidersConfigComponent.test]],
      dbUserName: ['', [Validators.required, ProvidersConfigComponent.test]],
      dbPassword: ['', [Validators.required, ProvidersConfigComponent.test]]
    });
    // this.getDatabaseConfig();
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
            this.newSFDARestrictionSettings[payer.switchAccountId] = true;
            this.newSFDAValidationSettings[payer.switchAccountId] = false;
            //new changes for payer mapping
            this.newPayerMappingEnable[payer.switchAccountId] = false;
            this.newPayerMappingValue[payer.switchAccountId] = "";
            this.newPayerName[payer.switchAccountId] = "";
            this.addPayerMappingList = [];
            this.addDbConfigForm.reset();
            // this.providerMappingController.
            
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
    this.getSetting(SERVICE_CODE_VALIDATION_KEY, this.serviceCodeValidationSettings, this.newServiceCodeValidationSettings);
    this.getSetting(SERVICE_CODE_RESTRICTION_KEY, this.serviceCodeRestrictionSettings, this.newServiceRestrictionSettings);
    this.getSetting(VALIDATE_RESTRICT_PRICE_UNIT, this.priceUnitSettings, this.newPriceUnitSettings);
    this.getSetting(ICD10_RESTRICTION_KEY, this.ICD10ValidationSettings, this.newICD10ValidationSettings);
    this.getSetting(SFDA_VALIDATION_KEY, this.sfdaValidationSettings, this.newSFDAValidationSettings);
    this.getSetting(SFDA_RESTRICTION_KEY, this.sfdaRestrictionSettings, this.newSFDARestrictionSettings);
    this.getPortalUserSettings();
    // ####### Chages on 02-01-2021 start
    this.getDatabaseConfig();
    this.getPayerMapping();
    this.getProviderMapping();
    // ####### Chages on 02-01-2021 end
  }

  save() {
    if (this.isLoading || this.componentLoading.serviceCode || this.componentLoading.portalUser || this.componentLoading.ICD10Validation 
      || this.componentLoading.sfda || this.componentLoading.midtable || this.componentLoading.payerMapping || this.componentLoading.providerMapping) {
      return;
    }
    let flag1 = this.saveSettings(SERVICE_CODE_VALIDATION_KEY,this.newServiceCodeValidationSettings,this.serviceCodeValidationSettings);
    let flag2 = this.savePortalUserSettings();
    let flag3 = this.saveSettings(SERVICE_CODE_RESTRICTION_KEY,this.newServiceRestrictionSettings,this.serviceCodeRestrictionSettings);
    let flag4 = this.saveSettings(ICD10_RESTRICTION_KEY,this.newICD10ValidationSettings,this.ICD10ValidationSettings);
    let flag5 = this.saveSettings(VALIDATE_RESTRICT_PRICE_UNIT,this.newPriceUnitSettings,this.priceUnitSettings);
    let flag6 = this.saveSettings(SFDA_VALIDATION_KEY,this.newSFDAValidationSettings,this.sfdaValidationSettings);
    let flag7 = this.saveSettings(SFDA_RESTRICTION_KEY,this.newSFDARestrictionSettings,this.sfdaRestrictionSettings);
    //change on 02-01-2021 start
    let dbFlag = this.addDatabaseConfig();
    let payerFlag = this.savePayerMapping();
    let providerFlag = this.addProviderMapping();
    console.log(dbFlag + " "+  payerFlag + " " + providerFlag)
    //change on 02-01-2021 end
    if (flag1 && flag2 && flag3 && flag4 && flag5 && flag6 && flag7 && dbFlag && payerFlag && providerFlag) {
      this.dialogService.openMessageDialog({
        title: '',
        message: 'There is no changes to save!',
        withButtons: false,
        isError: false
      });
    }

  }

  saveSettings(URLKey:string,newSettingValues: { [key: string]: boolean },settingValues: any[]) {
    let payers = Object.keys(newSettingValues);
    if (payers.length > 0) {
      let newSettingsKeys = payers.filter(payerId => {
        let setting = settingValues.find(setting => setting.payerId == payerId);
        return (setting != null && (setting.value == '1') != newSettingValues[payerId])
          || setting == null;
      });
      if (newSettingsKeys.length > 0) {
        this.setComponentLoading(URLKey,true);
        this.setSaveError(URLKey,null);
        this.setSaveSuccess(URLKey,null);
        this.superAdmin.saveProviderPayerSettings(this.selectedProvider, newSettingsKeys.map(payerId => ({
          payerId: payerId,
          key: URLKey,
          value: (newSettingValues[payerId]) ? '1' : '0'
        })
        )).subscribe(event => {
          if (event instanceof HttpResponse) {
            newSettingsKeys.map(payerId => {
              let index = settingValues.findIndex(setting => setting.payerId == payerId);
              if (index != -1) {
                this.setSettingIndexed(URLKey,index,(newSettingValues[payerId]) ? '1' : '0');
                
              } else {
                this.addValueToSetting(URLKey,payerId,newSettingValues);
              }
            });
            this.setSaveSuccess(URLKey,"Settings were saved successfully");
            this.setComponentLoading(URLKey,false);
          }
        }, error => {
          this.setSaveError(URLKey,'Could not save settings, please try again later.');
          this.resetSection(URLKey,newSettingValues);
          this.componentLoading.serviceCode = false;
        });
        return false;
      } return true;
    } return true;
  }
  addValueToSetting(URLKey: string, payerId: string, newSettingValues: { [key: string]: boolean; }) {

    switch (URLKey) {
      case SERVICE_CODE_VALIDATION_KEY:
          this.serviceCodeValidationSettings.push({
            providerId: this.selectedProvider,
            payerId: payerId,
            key: URLKey,
            value: (newSettingValues[payerId]) ? '1' : '0'
          });
          break;
      case SERVICE_CODE_RESTRICTION_KEY:
          this.serviceCodeRestrictionSettings.push({
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
      case SFDA_VALIDATION_KEY:
          this.sfdaValidationSettings.push({
            providerId: this.selectedProvider,
            payerId: payerId,
            key: URLKey,
            value: (newSettingValues[payerId]) ? '1' : '0'
          });
          break;
      case SFDA_RESTRICTION_KEY:
          this.sfdaRestrictionSettings.push({
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
      case SERVICE_CODE_VALIDATION_KEY:
          this.serviceCodeValidationSettings[index].value = value;
          break;
      case SERVICE_CODE_RESTRICTION_KEY:
          this.serviceCodeRestrictionSettings[index].value = value;
          break;
      case VALIDATE_RESTRICT_PRICE_UNIT:
          this.priceUnitSettings[index].value = value;
        break;
      case ICD10_RESTRICTION_KEY:
          this.ICD10ValidationSettings[index].value = value;
        break;
      case SFDA_VALIDATION_KEY:
          this.sfdaValidationSettings[index].value = value;
          break;
      case SFDA_RESTRICTION_KEY:
          this.sfdaRestrictionSettings[index].value = value;
        break;
    }
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

  reset() {
    this.resetSection(SERVICE_CODE_VALIDATION_KEY, this.newServiceCodeValidationSettings);
    this.resetSection(SERVICE_CODE_RESTRICTION_KEY,this.newServiceRestrictionSettings);
    this.resetSection(VALIDATE_RESTRICT_PRICE_UNIT,this.newPriceUnitSettings);
    this.resetSection(ICD10_RESTRICTION_KEY,this.newICD10ValidationSettings);
    this.resetSection(SFDA_VALIDATION_KEY,this.newSFDAValidationSettings);
    this.resetSection(SFDA_RESTRICTION_KEY,this.newSFDARestrictionSettings);
    this.resetDbAndMapping();
  }
  resetSection(URLKey: string, newSettingArray: { [key: string]: boolean; }) {
    if (Object.keys(newSettingArray).length > 0) {
      this.setComponentLoading(URLKey, true);

      switch (URLKey) {
        case SERVICE_CODE_VALIDATION_KEY:
            setTimeout(() => this.componentLoading.serviceCode = false, 100);
            this.newServiceCodeValidationSettings = {};
            break;
        case SERVICE_CODE_RESTRICTION_KEY:
            setTimeout(() => this.componentLoading.serviceCode = false, 100);
            this.newServiceRestrictionSettings = {};
            break;
        case VALIDATE_RESTRICT_PRICE_UNIT:
          setTimeout(() => this.componentLoading.serviceCode = false, 100);
          this.newPriceUnitSettings = {};
          break;
        case ICD10_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.ICD10Validation = false, 100);
          this.newICD10ValidationSettings = {};
          break;
        case SFDA_VALIDATION_KEY:
            setTimeout(() => this.componentLoading.sfda = false, 100);
            this.newSFDAValidationSettings = {};
            break;
        case SFDA_RESTRICTION_KEY:
          setTimeout(() => this.componentLoading.sfda = false, 100);
          this.newSFDARestrictionSettings = {};
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

  getSetting(URLKey: string, seetingValues: any[], newSettingValues: { [key: string]: boolean }) {
    this.setComponentLoading(URLKey, true);
    this.superAdmin.getProviderPayerSettings(this.selectedProvider, URLKey).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          seetingValues = event.body;
          let payers = Object.keys(newSettingValues);
          if (payers.length > 0) {
            payers.forEach(payer => {
              let setting = seetingValues.find(setting => setting.payerId == payer);
              newSettingValues[payer] = (setting != null && setting.value == '1');
            });
          }

          this.setComponentLoading(URLKey, false);
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.setErrorMessage('Could not load service code settings, please try again later.', URLKey);
        }
      }
      this.setComponentLoading(URLKey, false);
    });
  }
  setErrorMessage(message: string, URLKey: string) {
    switch (URLKey) {
      case SERVICE_CODE_VALIDATION_KEY:
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.errors.serviceCodeError = message;
        break;
      case ICD10_RESTRICTION_KEY:
        this.errors.ICD10SaveError = message;
        break;
      case SFDA_VALIDATION_KEY:
      case SFDA_RESTRICTION_KEY:
        this.errors.sfdaError = message;
        break;
    }
  }

  setComponentLoading(URLKey: string, componentLoading: boolean) {
    switch (URLKey) {
      case SERVICE_CODE_VALIDATION_KEY:
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
        this.componentLoading.serviceCode = componentLoading;
        break;
      case ICD10_RESTRICTION_KEY:
        this.componentLoading.ICD10Validation = componentLoading;
        break;
      case SFDA_VALIDATION_KEY:
      case SFDA_RESTRICTION_KEY:
        this.componentLoading.sfda = componentLoading;
        break;
    }
  }

  setSaveError(URLKey: string, value: any)
  {
    switch (URLKey) {
      case SERVICE_CODE_VALIDATION_KEY:
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
          this.errors.serviceCodeSaveError = value;
        break;
      case ICD10_RESTRICTION_KEY:
          this.errors.ICD10SaveError = value;
        break;
      case SFDA_VALIDATION_KEY:
      case SFDA_RESTRICTION_KEY:
          this.errors.sfdaSaveError = value;
        break;
    }

  }

  setSaveSuccess(URLKey: string, value: any)
  {
    switch (URLKey) {
      case SERVICE_CODE_VALIDATION_KEY:
      case SERVICE_CODE_RESTRICTION_KEY:
      case VALIDATE_RESTRICT_PRICE_UNIT:
          this.success.serviceCodeSaveSuccess = value;
        break;
      case ICD10_RESTRICTION_KEY:
          this.success.ICD10SaveSuccess = value;
        break;
      case SFDA_VALIDATION_KEY:
      case SFDA_RESTRICTION_KEY:
          this.success.sfdaSaveSuccess = value;
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

  onSFDAWarningSettingChange(payerid: string, event: MatSlideToggleChange) {
    if (event.checked) {
      this.newSFDARestrictionSettings[payerid] = !event.checked;
    }
  }
  onSFDARestrictionSettingChange(payerid: string, event: MatSlideToggleChange) {
    if (event.checked) {
      this.newSFDAValidationSettings[payerid] = !event.checked;
    }
  }

  
  getDatabaseConfig() {
    this.componentLoading.midtable = true;
    this.errors.midtableError = null;
    this.success.midtableSuccess = null;
    this.dbMapping.getDatabaseConfig(this.selectedProvider).subscribe(event => {
      
      if (event instanceof HttpResponse) {
        const data = event.body['dbObject'];
        if(data != null) {
          this.addDbConfigForm.patchValue({
            dbType: data.dbType,
            hostName: data.hostName,
            port: data.port,
            databaseName: data.databaseName,
            dbUserName: data.dbUserName,
            dbPassword: data.dbPassword
          });
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
    })
  }

  addDatabaseConfig() {
    const body = {
      dbType: this.addDbConfigForm.value.dbType.trim(),
      hostName: this.addDbConfigForm.value.hostName.trim(),
      port: this.addDbConfigForm.value.port,
      databaseName: this.addDbConfigForm.value.databaseName.trim(),
      dbUserName: this.addDbConfigForm.value.dbUserName.trim(),
      dbPassword: this.addDbConfigForm.value.dbPassword.trim(),
      providerId: this.selectedProvider
    };
    this.componentLoading.midtable = true;
    this.dbMapping.setDatabaseConfig(this.selectedProvider,body).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.status);
        const data = event.body['message'];
        if(data != null){
          this.success.midtableSuccess = "Data save successfully";
        }else{
          this.errors.midtableError = "Could not save mid table configuration !";
        }
        this.componentLoading.midtable = false;
        return true;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.midtableError = 'Could not add db config, please try again later.';
        }
      }
      this.componentLoading.midtable = false;
    })
    return true;
  }

  static test(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'required': true };
  }
  
  get f() { return this.addDbConfigForm.controls; }

  onPayerMapSetting(payerData,event,index){
    this.newPayerName[payerData.switchAccountId] = payerData.name;
    if(event.checked){
      this.addPayerMappingList.push(payerData.switchAccountId);
    }else{
      var temp = this.addPayerMappingList.findIndex(x => x === payerData.switchAccountId);
      this.addPayerMappingList.splice(temp,1);
    }
    console.log(this.addPayerMappingList);
  }
  
  savePayerMapping(){
    if(this.existingPayers != undefined && this.existingPayers.length > 0){
      this.existingPayers.forEach(payer=>{
        if(!this.addPayerMappingList.includes(payer.payerId)){
          this.deletePayerMappingList.push(payer.payerId);
        }
      })
    }  
      var selectedPayer = [];
      if(this.addPayerMappingList.length > 0){
        this.addPayerMappingList.forEach(id=>{
          var data = {
            payerId : id,
            mapPayerName : this.newPayerMappingValue[id],
            payerName : this.newPayerName[id]
          }
          selectedPayer.push(data);
        })
        this.componentLoading.payerMapping = true;
        this.dbMapping.savePayerMapping(this.selectedProvider, selectedPayer).subscribe(event=>{
          console.log(event);
          if (event instanceof HttpResponse) {
            const data = event.body['response'];
            if(data){
              this.success.payerMappingSuccess = "Settings were saved successfully.";
            }else{
              this.errors.payerMappingError = "Could not save payer mapping details !";
            }
            this.componentLoading.payerMapping = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status != 404) {
              this.errors.payerMappingError = 'Could not change payer mapping, please try again later.';
            }
          }
          this.componentLoading.payerMapping = false;
        })
      }

      var deletePayers = [];
      if(this.deletePayerMappingList.length > 0){
        this.deletePayerMappingList.forEach(id=>{
          var data = {
            payerId : id
          }
          deletePayers.push(data);
        })
        this.componentLoading.payerMapping = true;
        //call delete function
        this.dbMapping.deletePayerMapping(this.selectedProvider, deletePayers).subscribe(event=>{
          console.log(event);
          this.deletePayerMappingList = [];
          if (event instanceof HttpResponse) {
            const data = event.body['response'];
            if(data){
              this.success.payerMappingSuccess = "Settings were saved successfully.";
            }else{
              this.errors.payerMappingError = "Could not save payer mapping details !";
            }
            this.componentLoading.payerMapping = false;
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status != 404) {
              this.errors.payerMappingError = 'Could not change payer mapping, please try again later.';
            }
          }
          this.componentLoading.payerMapping = false;
        })     
      }
      return true;
  }
  getPayerMapping(){
    this.componentLoading.payerMapping = true;
    this.errors.payerMappingError = null;
    this.success.payerMappingSuccess = null;
    this.dbMapping.getPayerMapping(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        const response = event.body['response'];
        if(response){
          const mappingList = event.body['mappingList'];
          this.existingPayers = mappingList;
          if(this.existingPayers.length > 0){
            this.existingPayers.forEach(payer=>{
              this.newPayerMappingEnable[payer.payerId] = true;
              this.newPayerMappingValue[payer.payerId] = payer.mappingName;
              this.newPayerName[payer.payerId] = payer.payerName;
              this.addPayerMappingList.push(payer.payerId);
            })
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
    const body = {
      providerCode: this.selectedProviderCode,
      mappingProviderCode: this.providerMappingController.value
    }
    this.componentLoading.providerMapping = true;
    this.dbMapping.setProviderMapping(body, this.selectedProvider).subscribe(event => {
      console.log(event);
      if (event instanceof HttpResponse) {
        const data = event.body['message'];
        if(data != null){
          this.success.providerMappingSuccess = "Settings were saved successfully.";
        }else{
          this.errors.providerMappingError = "Could not save provider mapping details !";
        }
        this.componentLoading.providerMapping = false;
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status != 404) {
          this.errors.providerMappingError = 'Could not save provider mapping, please try again later.';
        }
      }
      this.componentLoading.providerMapping = false;
    });
    return true;
  }
    
  getProviderMapping() {
    this.componentLoading.providerMapping = true;
    this.errors.providerMappingError = null;
    this.success.providerMappingSuccess = null;  
    this.dbMapping.getProviderMapping(this.selectedProvider).subscribe(event => {
        if (event instanceof HttpResponse) {
          const data = event.body['providerMapping'];
          if(data != null) {
            this.providerMappingController.setValue(data.mappingProviderCode);
          }
          else{
            this.providerMappingController.setValue("");
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
  resetDbAndMapping(){
     
     this.newPayerMappingEnable= {};
     this.newPayerMappingValue = {};
     this.newPayerName = {};
     this.addPayerMappingList = [];
     this.addDbConfigForm.reset();
     this.providerMappingController.setValue("");
    
  }
}
