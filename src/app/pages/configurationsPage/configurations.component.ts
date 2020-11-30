import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { addNewMappingValue, cancelChangesOfCodeValueManagement, deleteMappingValue, loadProviderMappingValues, saveChangesOfCodeValueManagement, setCodeValueManagementLoading } from './store/configurations.actions';
import { CategorizedCodeValue, codeValueManagementSelectors } from './store/configurations.reducer';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  codeValueDictionary: CategorizedCodeValue = new Map();
  categories: { label: string, key: string }[] = [];
  payers: { id: number, name: string }[] = [];
  codes: { label: string, key: string }[] = [];
  values: string[] = [];
  error: string;
  success: string;

  isLoading: boolean = false;
  hasChanges: boolean = false;

  selectedCategory: string;
  selectedCode: string;
  selectedPayer: string;

  mappedValueInputControl: FormControl = new FormControl('');

  categoriesStoreSubscription: Subscription;

  constructor(private store: Store, private sharedServices: SharedServices) { }

  ngOnInit() {
    this.store.dispatch(setCodeValueManagementLoading({ isLoading: true }));
    this.store.dispatch(loadProviderMappingValues());
    this.getCategoriesFromStore();
    this.store.select(codeValueManagementSelectors.getIsLoading).subscribe(isLoading => this.isLoading = isLoading);
    this.store.select(codeValueManagementSelectors.hasNewChanges).subscribe(hasChanges => this.hasChanges = hasChanges);
    this.store.select(codeValueManagementSelectors.getResponses).subscribe(responses => {
      if(responses.length > 0){
        this.success = null;
        this.error = null;
        if(responses.filter(response => response.status == 'error').length > 0){
          this.error = 'Some changes were not saved. Please try again later.';
        } else {
          this.success = 'All changes were saved successfully.';
        }
      }
    })
  }

  getCategoriesFromStore() {
    this.categoriesStoreSubscription = this.store.select(codeValueManagementSelectors.getCurrentValues).subscribe(values => {
      let payersCodes = [];
      values.forEach((value, key) => {
        this.codeValueDictionary.set(key, { label: value.label, codes: new Map() });
        value.codes.forEach((cValue, cKey) => this.codeValueDictionary.get(key).codes.set(cKey, { label: cValue.label, values: [...cValue.values] }));
        if (!key.startsWith('departmentName'))
          this.categories.push({ label: value.label, key: key });
        else {
          payersCodes.push(key.split('_')[1])
        }
      })
      this.payers = this.sharedServices.payers.filter(payer => payersCodes.includes(this.sharedServices.getPayerCode(`${payer.id}`)));
    });
  }

  selectCategory(category: string) {
    this.codes = [];
    if (category == 'departmentName_') {
      category += this.getPayerCode();
    }
    this.selectedCategory = category;
    if (this.codeValueDictionary.has(category)) {
      this.codeValueDictionary.get(category).codes.forEach((value, key) => {
        this.codes.push({ label: value.label, key: key });
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

  getPayerCode() {
    let code = this.sharedServices.getPayerCode(this.selectedPayer);
    return code;
  }

  addMappedValueToSelections() {
    this.addMappedValueToCodeOfCategory(this.selectedCategory, this.selectedCode, this.mappedValueInputControl.value);
    this.mappedValueInputControl.setValue('');
  }

  removeMappedValueFromSelections(index: number) {
    this.store.dispatch(deleteMappingValue({
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
    this.store.dispatch(addNewMappingValue({ value: { categoryId: category, codeId: code, value: value } }));
  }
  cancel() {
    this.values = [];
    this.codes = [];
    this.categories = [];
    this.selectedCode = '';
    this.selectedPayer = '';
    this.selectedCategory = '';
    this.categoriesStoreSubscription.unsubscribe();
    this.store.dispatch(cancelChangesOfCodeValueManagement());
    this.getCategoriesFromStore();
  }
  save() {
    this.values = [];
    this.codes = [];
    this.categories = [];
    this.selectedCode = '';
    this.selectedPayer = '';
    this.selectedCategory = '';
    this.store.dispatch(setCodeValueManagementLoading({ isLoading: true }));
    this.store.dispatch(saveChangesOfCodeValueManagement());
  }
}