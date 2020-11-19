import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.css']
})
export class ConfigurationsComponent implements OnInit {

  codeValueDictionary: Map<string, Map<string, string[]>> = new Map();

  selectedCategory:string;
  selectedCode:string;

  mappedValueInputControl:FormControl = new FormControl('');

  constructor() { }

  ngOnInit() {
  }

  selectCategory(category:string){
    this.selectedCategory = category;
    this.selectCode('');
  }

  selectCode(code:string){
    this.selectedCode = code;
    this.mappedValueInputControl.setValue('');
  }

  addMappedValueToSelections(){
    this.addMappedValueToCodeOfCategory(this.selectedCategory, this.selectedCode, this.mappedValueInputControl.value);
    this.mappedValueInputControl.setValue('');
  }

  removeMappedValueFromSelections(index:number){
    this.codeValueDictionary.get(this.selectedCategory).get(this.selectedCode).splice(index, 1);
  }

  addMappedValueToCodeOfCategory(category:string, code:string, value:string){
    if(!this.codeValueDictionary.has(category)){
      this.codeValueDictionary.set(category, new Map());
    }
    if(!this.codeValueDictionary.get(category).has(code)){
      this.codeValueDictionary.get(category).set(code, []);
    }
    if(this.codeValueDictionary.get(category).get(code).includes(value)){
      return;
    }
    this.codeValueDictionary.get(category).get(code).push(value);
  }

}
