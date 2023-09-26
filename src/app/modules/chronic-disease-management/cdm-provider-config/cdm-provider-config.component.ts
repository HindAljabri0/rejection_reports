import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { CdmService } from 'src/app/services/cdmService/cdm.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-cdm-provider-config',
  templateUrl: './cdm-provider-config.component.html',
  styleUrls: ['./cdm-provider-config.component.css']
})
export class CdmProviderConfigComponent implements OnInit {
  selectedProvider: string;
  providerController: FormControl = new FormControl();
  filteredProviders: any[] = [];
  providers: any[] = [];
  selectedCategory: string;
  selectedCategoryItems: string[] = [];
  newItem: string;
  selectedValues: string[] = [];
  isLoading: boolean = false;
  diagnosisList: any;
  categories: string[] = ['Policy', 'Region', 'Diagnosis'];
  regions: any;
  filterWLECodesControl: FormControl = new FormControl('');
  filteredCodes: { label: string, key: string }[] = [];
  codes: { label: string, key: string }[] = [];
  selectedCode: string;
  diagnosisFlag: boolean = false;
  regionFlag: boolean = false;
  fetchFlag: boolean = false;
  diagSelectedItems: any[] = [];
  regSelectedItems: any[] = [];
  policySelectedItems: any[] = [];
  error: string;
  policyResult: any;
  savePopupOpen: any;
  initialDiagSelectedItems: any[] = [];
  initialRegSelectedItems: any[] = [];
  initialPolicySelectedItems: any[] = [];


  constructor(private sharedServices: SharedServices, private superAdmin: SuperAdminService, private cdmService: CdmService, private dialogService: DialogService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.fetchDiagnosis();
    this.fetchRegions();
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      this.error = 'could not load providers, please try again later.';
      console.log(error);
    });
  }


  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async fetchDataAndHideLoader() {
    await this.getAllList();
    await this.delay(1000); // Delay for 500 milliseconds
    this.sharedServices.loadingChanged.next(false);
  }
  
  async selectProvider(providerId: string = null) {
    this.sharedServices.loadingChanged.next(true);
    if (providerId !== null) {
      this.selectedProvider = providerId;
    } else {
      const providerId = this.providerController.value.split('|')[0].trim();
      this.selectedProvider = providerId;
    }  

    this.diagSelectedItems = [];
    this.regSelectedItems = [];
    this.policySelectedItems = [];
    await this.fetchDataAndHideLoader();
  }
  

  

  updateFilter() {
    this.filteredProviders = this.providers.filter(provider =>
      `${provider.switchAccountId} | ${provider.cchiId} | ${provider.code} | ${provider.name}`.toLowerCase()
        .includes(this.providerController.value.toLowerCase())
    );
  }

  getProvider() {
    //this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getProviders().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          this.providers = event.body;
          this.filteredProviders = this.providers;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getAllList() {
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAllList(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body instanceof Array) {
          const diagResult = event.body.filter(item1 =>
            item1.name != null && this.diagnosisList.some(item2 => item2.diagnosisDescription === item1.name)
          );
          const ids = diagResult.map(({ value }) => value);
          const diagFiltered = diagResult
            .filter(({ value }, index) => !ids.includes(value, index + 1))
            .map(({ name, value, cdmSequence }) => ({
              'diagnosisDescription': name,
              'diagnosisCode': value,
              'cdmSequence': cdmSequence
            }));

          const regResult = event.body.filter(item1 =>
            item1.name != null && this.regions.some(item2 => item2.regionDescription === item1.name)
          );
          const regIds = regResult.map(({ value }) => value);
          const regFilter = regResult
            .filter(({ value }, index) => !regIds.includes(value, index + 1))
            .map(({ name, value, cdmSequence }) => ({
              'regionDescription': name,
              'regionCode': value,
              'cdmSequence': cdmSequence
            }));


          const policyResult = event.body
            .filter(item => item.name === "policy")

          const policyIds = policyResult.map(({ value }) => value);

          const policyFilter = policyResult
            .filter(({ value }, index) => !policyIds.includes(value, index + 1))
            .map(({ name, value, cdmSequence }) => ({
              'policyCode': value,
              'cdmSequence': cdmSequence
            }));

          this.policySelectedItems.push(...policyFilter);
          this.diagSelectedItems.push(...diagFiltered);
          this.regSelectedItems.push(...regFilter);
          const diagnosisListFilter = this.diagnosisList.filter(item1 => !diagResult.some(item2 => item1.diagnosisDescription === item2.name));
          const regionsFilter = this.regions.filter(item1 => !regResult.some(item2 => item1.regionDescription === item2.name));
          this.diagnosisList = diagnosisListFilter;
          this.regions = regionsFilter;
          this.initialDiagSelectedItems = [...this.diagSelectedItems];
          this.initialRegSelectedItems = [...this.regSelectedItems];
          this.initialPolicySelectedItems = [...this.policySelectedItems];     
        }
      }
    },
      (error) => {
        console.error('getAllList error:', error);
      },

      () => {
        this.regionFlag = false;
        this.diagnosisFlag = false;
        this.fetchFlag = false;
        this.sharedServices.loadingChanged.next(false);
      });
    
  }

  onRegionChange(item: any) {
    item.regSelected = !item.regSelected;
    if (item.regSelected) {
      this.regSelectedItems.unshift(item);
      this.regions = this.regions.filter(region => region !== item);
      this.selectedValues.push(item.regionCode); 
    } else {
      const index = this.regSelectedItems.indexOf(item);
      if (index !== -1) {
        this.regSelectedItems.splice(index, 1);
      }
      const regionCode = item.regionCode; 
      const selectedIndex = this.selectedValues.indexOf(regionCode);
      if (selectedIndex !== -1) {
        this.selectedValues.splice(selectedIndex, 1); 
      }
    }
  }

  onDiagChange(item: any) {
    item.diagSelected = !item.diagSelected;
    if (item.diagSelected) {
      this.diagSelectedItems.unshift(item);
      this.diagnosisList = this.diagnosisList.filter(diagnosis => diagnosis !== item);
      this.selectedValues.push(item.diagnosisCode); 
    } else {
      const index = this.diagSelectedItems.indexOf(item);
      if (index !== -1) {
        this.diagSelectedItems.splice(index, 1);
      }
      const diagnosisCode = item.diagnosisCode; 
      const selectedIndex = this.selectedValues.indexOf(diagnosisCode);
      if (selectedIndex !== -1) {
        this.selectedValues.splice(selectedIndex, 1); 
      }
    }
  }

  fetchPolicy() {
    this.fetchFlag = true;
    this.regionFlag = false;
    this.diagnosisFlag = false;
  }
  fetchDiagnosis() {
    this.sharedServices.loadingChanged.next(true);
      this.superAdmin.getAllDiagnosis(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.diagnosisFlag = true;
          this.regionFlag = false;
          this.fetchFlag = false;
        if (event.body != null) {
          this.diagnosisList = event.body;
          const newDiagnosisList = this.diagnosisList.filter(item1 => !this.diagSelectedItems.some(item2 => item1.diagnosisDescription === item2.diagnosisDescription));
          this.diagnosisList = newDiagnosisList;
          for (let item of this.diagnosisList) {
            item.diagSelected = false;
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          this.diagnosisList = null;
        }
      });
  }
  fetchRegions() {
    this.sharedServices.loadingChanged.next(true);
    this.superAdmin.getAllRegion(this.selectedProvider).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.regionFlag = true;
        this.diagnosisFlag = false;
        this.fetchFlag = false;
        if (event.body != null)
          this.regions = event.body;
        const newRegionList = this.regions.filter(item1 => !this.regSelectedItems.some(item2 => item1.regionDescription === item2.regionDescription));
        this.regions = newRegionList;
        for (let item of this.regions) {
          item.regSelected = false;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          this.regions = null;
        }
      });
  }
  addItem(newItem) {
    if (newItem && newItem.trim() !== '') {
      const isDuplicate = this.policySelectedItems.some(item => item.policyCode === newItem);

      if (!isDuplicate) {
        this.policySelectedItems.push({ 'policyCode': newItem });
        this.newItem = '';
      } else {
        this.dialogService.openMessageDialog({
          title: '',
          message: 'The policy number you entered is already exist.',
          isError: true,
        });
      }
    }
  }


  removeDiagItem(index: number) {
    const removedItem = this.diagSelectedItems.splice(index, 1)[0];
    this.diagnosisList.unshift(removedItem);
    this.diagnosisList.sort((a, b) => a.diagnosisDescription.localeCompare(b.diagnosisDescription));
  }

  removeRegItem(index: number) {
    const removedItem = this.regSelectedItems.splice(index, 1)[0];
    this.regions.unshift(removedItem);
    this.regions.sort((a, b) => a.regionDescription.localeCompare(b.regionDescription));
  }

  removePolicyItem(index: number) {
    this.policySelectedItems.splice(index, 1);
  }

  reset(diag: boolean, policy: boolean, region: boolean) {
       if(diag){
        this.fetchDiagnosis();
      this.regionFlag = false;
      this.diagnosisFlag = true;
      this.fetchFlag = false;
    }
    if(policy){
      this.regionFlag = false;
      this.diagnosisFlag = false;
      this.fetchFlag = true;

    }
    if(region){
      this.fetchRegions();
      this.regionFlag = true;
      this.diagnosisFlag = false;
      this.fetchFlag = false;
      
    }
    this.diagSelectedItems.forEach(item => {
      const index = this.selectedValues.indexOf(item.diagnosisCode);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    });
  
    this.regSelectedItems.forEach(item => {
      const index = this.selectedValues.indexOf(item.regionCode);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    });
  
    this.policySelectedItems.forEach(item => {
      const index = this.selectedValues.indexOf(item.policyCode);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      }
    });
  
    this.diagSelectedItems = [...this.initialDiagSelectedItems];
    this.regSelectedItems = [...this.initialRegSelectedItems];
    this.policySelectedItems = [...this.initialPolicySelectedItems];
    }
  
    save() {
      const diagArray = this.diagSelectedItems.map(item => ({
        'diagnosisDescription': item.diagnosisDescription,
        'diagnosisCode': item.diagnosisCode,
        'cdmSequence': item.cdmSequence
      }));
    
      const regArray = this.regSelectedItems.map(item => ({
        'regionDescription': item.regionDescription,
        'regionCode': item.regionCode,
        'cdmSequence': item.cdmSequence
      }));
    
      const policyArray = this.policySelectedItems.map(item => ({
        'policyCode': item.policyCode,
        'cdmSequence': item.cdmSequence
      }));
        const dataToSave = {
        "diagnosis": diagArray,
        "region": regArray,
        "policy": policyArray,
      };
       this.savePopupOpen = true;
      this.sharedServices.loadingChanged.next(true);
      this.superAdmin.saveCdmCategories(this.selectedProvider, dataToSave)
        .pipe(
          finalize(() => {
             this.selectedValues = this.selectedValues.filter(value => {
              const existsInDiag = diagArray.some(item => item.diagnosisCode === value);
              const existsInReg = regArray.some(item => item.regionCode === value);
              const existsInPolicy = policyArray.some(item => item.policyCode === value);
              return !(existsInDiag || existsInReg || existsInPolicy);
            });
            
            this.sharedServices.loadingChanged.next(false);
            this.getAllList(); 
            this.policySelectedItems = []; 
          })
        )
        .subscribe(event => {
          if (event instanceof HttpResponse) {
            if (event.status == 201 || event.status) {
              this.dialogService.openMessageDialog({
                title: '',
                message: `Data saved successfully`,
                isError: false,
              });
            }
            this.sharedServices.loadingChanged.next(false);
          }
        },
        (error) => {
          console.error('Error saving data:', error);
        });
    }
    
  filterCodes() {
    if (this.filterWLECodesControl.value != null) {
      this.filteredCodes = this.codes.filter(
        code => code.label.toLowerCase().includes(this.filterWLECodesControl.value.toLowerCase())
          || code.key.toLowerCase().includes(this.filterWLECodesControl.value.toLowerCase())
      );
      this.filteredCodes.sort((c1, c2) =>
        (this.filterWLECodesControl.value.localeCompare(c1.key) == 0 ? -1 : 1)
        -
        (this.filterWLECodesControl.value.localeCompare(c2.key) == 0 ? -1 : 1)
      );
    }
  }
}
