import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldError } from '../store/claim.reducer';

@Component({
  selector: 'claim-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.css']
})
export class VitalSignsComponent implements OnInit {

  temperatureController: FormControl = new FormControl();
  bloodPressureController: FormControl = new FormControl();
  pulseController: FormControl = new FormControl();
  respiratoryRateController: FormControl = new FormControl();
  weightController: FormControl = new FormControl();
  heightController: FormControl = new FormControl();
  lastMenstruationPeriodController: FormControl = new FormControl();


  errors: FieldError[] = [];

  constructor() { }

  ngOnInit() {
  }

  updateClaim(fieldName: string) {

  }

  fieldHasError(fieldName) {
    return this.errors.findIndex(error => error.fieldName == fieldName) != -1;
  }
  
  getFieldError(fieldName) {
    const index = this.errors.findIndex(error => error.fieldName == fieldName);
    if (index > -1) {
      return this.errors[index].error || '';
    }
    return '';
  }

}
