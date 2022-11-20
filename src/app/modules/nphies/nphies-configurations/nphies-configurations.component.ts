import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
import { MatDialog } from '@angular/material';
import {
  nphiesAddNewMappingValue,
  nphiesCancelChangesOfCodeValueManagement,
  nphiesDeleteMappingValue,
  nphiesLoadProviderMappingValues,
  nphiesSaveChangesOfCodeValueManagement,
  nphiesSetCodeValueManagementLoading
} from './store/configurations.actions';
import { CategorizedCodeValue, codeValueManagementSelectors } from './store/configurations.reducer';
import { ConfiguartionModalComponent } from 'src/app/pages/configuartion-modal/configuartion-modal.component';

@Component({
  selector: 'app-nphies-configurations',
  templateUrl: './nphies-configurations.component.html',
  styleUrls: ['./nphies-configurations.component.css']
})
export class NphiesConfigurationsComponent implements OnInit, OnDestroy {


  codeValueDictionary: CategorizedCodeValue = new Map();
  categories: { label: string, key: string }[] = [];
  payers: { id: number, name: string }[] = [];
  codes: { label: string, key: string }[] = [];
  filteredCodes: { label: string, key: string }[] = [];
  values: string[] = [];
  error: string;
  success: string;

  isLoading = false;
  hasChanges = false;

  selectedCategory: string;
  tempSelectedCategory: string;
  selectedCode: string;
  tempSelectedCode: string;
  selectedPayer = '-1';
  tempSelectedPayer: string;

  filterWLECodesControl: FormControl = new FormControl('');
  mappedValueInputControl: FormControl = new FormControl('');


  categoriesStoreSubscription: Subscription;

  constructor(private store: Store, private sharedServices: SharedServices, private dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(nphiesSetCodeValueManagementLoading({ isLoading: true }));
    this.store.dispatch(nphiesLoadProviderMappingValues());
    this.getCategoriesFromStore();
    this.store.select(codeValueManagementSelectors.getIsLoading).subscribe(isLoading => this.isLoading = isLoading);
    this.store.select(codeValueManagementSelectors.hasNewChanges).subscribe(hasChanges => this.hasChanges = hasChanges);
    this.store.select(codeValueManagementSelectors.getResponses).subscribe(responses => {
      if (responses.length > 0) {
        this.success = null;
        this.error = null;
        if (responses.filter(response => response.status == 'error').length > 0) {
          this.error = 'Some changes were not saved. Please try again later.';
        } else {
          this.success = 'All changes were saved successfully.';
        }
      }
    });

  }

  ngOnDestroy() {
    this.cancel();
  }

  getCategoriesFromStore() {
    this.categoriesStoreSubscription = this.store.select(codeValueManagementSelectors.getCurrentValues).subscribe(values => {
      const payersCodes = [];
      this.categories = [];
      values.forEach((value, key) => {
        this.codeValueDictionary.set(key, { label: value.label, codes: new Map() });
        value.codes.forEach((cValue, cKey) => this.codeValueDictionary.get(key).codes.set(cKey,
          { label: cValue.label, values: [...cValue.values] }));
        if (!key.startsWith('departmentName') && !key.endsWith('Unit')) {
          this.categories.push({ label: value.label, key });
        } else if (!key.endsWith('Unit')) {
          payersCodes.push(key.split('_')[1]);
        }
      });
      this.payers = this.sharedServices.getPayersList().filter(payer =>
        payersCodes.includes(this.sharedServices.getPayerCode(`${payer.id}`)));
      this.selectedPayer = this.tempSelectedPayer || '-1';
      this.selectCategory(this.tempSelectedCategory);
      this.selectCode(this.tempSelectedCode || '');
    });
  }

  selectCategory(category: string) {
    this.filterWLECodesControl.setValue('');
    this.codes = [];
    console.log("category = "+category);
    if (category == 'departmentName_') {
      category += this.getPayerCode();
    }
    this.selectedCategory = category;
    if (this.codeValueDictionary.has(category)) {
      this.codeValueDictionary.get(category).codes.forEach((value, key) => {
        
        if(key !== "institutional" && key !== "professional")
        this.codes.push({ label: value.label, key });
        this.codes.sort((c1, c2) => c1.label.localeCompare(c2.label));
      });
    }
    this.selectCode('');
  }

  selectCode(code: string) {
    this.selectedCode = code;
    
    this.values = [];
    if (code != '') {
      this.values = this.codeValueDictionary.get(this.selectedCategory).codes.get(this.selectedCode).values;
    }
    this.mappedValueInputControl.setValue('');
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

  getPayerCode() {
    const code = this.sharedServices.getPayerCode(this.selectedPayer);
    return code;
  }

  addMappedValueToSelections() {
    this.addMappedValueToCodeOfCategory(this.selectedCategory, this.selectedCode, this.mappedValueInputControl.value);
    this.mappedValueInputControl.setValue('');
  }

  removeMappedValueFromSelections(index: number) {
    this.store.dispatch(nphiesDeleteMappingValue({
      value: {
        categoryId: this.selectedCategory, codeId: this.selectedCode, value:
          this.codeValueDictionary.get(this.selectedCategory).codes.get(this.selectedCode).values[index]
      }
    }));
    this.codeValueDictionary.get(this.selectedCategory).codes.get(this.selectedCode).values.splice(index, 1);
    this.selectCode(this.selectedCode);
  }

  addMappedValueToCodeOfCategory(category: string, code: string, value: string) {
    let codeThatAlreadyHasTheValue: string;
    this.codeValueDictionary.get(category).codes.forEach((code, key) => {
      if (code.values.includes(value)) {
        codeThatAlreadyHasTheValue = code.label;
        return;
      }
    });
    if (codeThatAlreadyHasTheValue != null) {
      this.success = null;
      this.error = `Value [${value}] already exists in ${codeThatAlreadyHasTheValue}`;
      setTimeout(() => this.error = null, 8000);
      return;
    }
    this.codeValueDictionary.get(category).codes.get(code).values.push(value);
    this.selectCode(code);
    this.store.dispatch(nphiesAddNewMappingValue({ value: { categoryId: category, codeId: code, value } }));
  }
  cancel() {
    this.values = [];
    this.codes = [];
    this.categories = [];
    this.selectedCode = '';
    this.selectedPayer = '-1';
    this.selectedCategory = '';
    this.categoriesStoreSubscription.unsubscribe();
    this.store.dispatch(nphiesCancelChangesOfCodeValueManagement());
    this.getCategoriesFromStore();
  }
  save() {
    this.values = [];
    this.codes = [];
    this.categories = [];
    this.tempSelectedCategory = this.selectedCategory;
    this.tempSelectedCode = this.selectedCode;
    this.tempSelectedPayer = this.selectedPayer;
    this.selectedCode = '';
    this.selectedPayer = '-1';
    this.selectedCategory = '';
    this.store.dispatch(nphiesSetCodeValueManagementLoading({ isLoading: true }));
    this.store.dispatch(nphiesSaveChangesOfCodeValueManagement());
  }
  openCSV(event) {
    const dialogRef = this.dialog.open(ConfiguartionModalComponent,
      {
        panelClass: ['primary-dialog'], autoFocus: false, data: {
          file: event.target.files[0],
          providerId: this.sharedServices.providerId, selectedProviderId: this.sharedServices.providerId
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    }, error => {

    });

  }

  clearFiles(event) {
    event.target.value = '';
  }

}
