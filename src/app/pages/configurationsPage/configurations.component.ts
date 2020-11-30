import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
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

  isLoading: boolean = false;

  selectedCategory: string;
  selectedCode: string;
  selectedPayer: string;

  mappedValueInputControl: FormControl = new FormControl('');

  constructor(private store: Store, private sharedServices: SharedServices) { }

  ngOnInit() {
    this.store.dispatch(setCodeValueManagementLoading({ isLoading: true }));
    this.store.dispatch(loadProviderMappingValues());
    this.store.select(codeValueManagementSelectors.getCurrentValues).subscribe(values => {
      values.forEach((value, key) => {
        this.codeValueDictionary.set(key, {label: value.label, codes: new Map()});
        value.codes.forEach((cValue, cKey) => this.codeValueDictionary.get(key).codes.set(cKey, {label: cValue.label, values: [...cValue.values]}));
        if (!key.startsWith('departmentName'))
          this.categories.push({ label: value.label, key: key });
      })
    });
    this.store.select(codeValueManagementSelectors.getIsLoading).subscribe(isLoading => this.isLoading = isLoading);
    this.payers = this.sharedServices.payers.filter(payer => ['AXA', 'NCCI', 'MedGulf'].includes(this.sharedServices.getPayerCode(`${payer.id}`)));
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
        category: this.selectedCategory, code: this.selectedCode, value:
          this.codeValueDictionary.get(this.selectedCategory).codes.get(this.selectedCode).values[index]
      }
    }));
    this.codeValueDictionary.get(this.selectedCategory).codes.get(this.selectedCode).values.splice(index, 1);
    this.selectCode(this.selectedCode);
  }

  addMappedValueToCodeOfCategory(category: string, code: string, value: string) {
    this.codeValueDictionary.get(category).codes.get(code).values.push(value);
    this.selectCode(code);
    this.store.dispatch(addNewMappingValue({ value: { category: category, code: code, value: value } }));
  }
  cancel() {
    this.store.dispatch(cancelChangesOfCodeValueManagement());
  }
  save() {
    this.store.dispatch(saveChangesOfCodeValueManagement());
  }
}