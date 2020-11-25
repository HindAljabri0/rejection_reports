import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
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
  codes: { label: string, key: string }[] = [];
  values: string[] = [];

  isLoading: boolean = false;

  selectedCategory: string;
  selectedCode: string;

  mappedValueInputControl: FormControl = new FormControl('');

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(setCodeValueManagementLoading({isLoading: true}));
    this.store.dispatch(loadProviderMappingValues());
    this.store.select(codeValueManagementSelectors.getCurrentValues).subscribe(values => {
      this.codeValueDictionary = values
      values.forEach((value, key) => {
        if (!key.startsWith('departmentName'))
          this.categories.push({ label: value.label, key: key });
      })
    });
    this.store.select(codeValueManagementSelectors.getIsLoading).subscribe(isLoading => this.isLoading = isLoading);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.codes = [];
    this.codeValueDictionary.get(category).codes.forEach((value, key) => {
      this.codes.push({ label: value.label, key: key });
    });
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