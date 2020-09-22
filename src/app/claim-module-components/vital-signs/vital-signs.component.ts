import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';
import { updateBloodPressure, updateHeight, updateLastMenstruationPeriod, updatePulse, updateRespiratoryRate, updateTemperature, updateWeight } from '../store/claim.actions';
import { FieldError, getClaim, getPageMode } from '../store/claim.reducer';

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

  constructor(private store: Store, private datePipe: DatePipe) { }

  ngOnInit() {
    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim)
        this.toggleEdit(false, true);
      }
    });
  }

  setData(claim: Claim) {
    const temperature = claim.caseInformation.caseDescription.temperature;
    const bloodPressure = claim.caseInformation.caseDescription.bloodPressure;
    const pulse = claim.caseInformation.caseDescription.pulse;
    const respiratoryRate = claim.caseInformation.caseDescription.respRate;
    const weight = claim.caseInformation.caseDescription.weight;
    const height = claim.caseInformation.caseDescription.height;
    const lastMenstruationPeriod = claim.caseInformation.caseDescription.lmp;
    this.temperatureController.setValue(temperature);
    this.bloodPressureController.setValue(bloodPressure);
    this.pulseController.setValue(pulse);
    this.respiratoryRateController.setValue(respiratoryRate);
    this.weightController.setValue(weight);
    this.heightController.setValue(height);
    if (lastMenstruationPeriod != null) {
      this.lastMenstruationPeriodController.setValue(this.datePipe.transform(lastMenstruationPeriod, 'yyyy-MM-dd'));
    } else this.lastMenstruationPeriodController.setValue('');
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    if (allowEdit) {
      this.temperatureController.enable();
      this.bloodPressureController.enable();
      this.pulseController.enable();
      this.respiratoryRateController.enable();
      this.weightController.enable();
      this.heightController.enable();
      this.lastMenstruationPeriodController.enable();
    } else {
      this.temperatureController.disable();
      this.bloodPressureController.disable();
      this.pulseController.disable();
      this.respiratoryRateController.disable();
      this.weightController.disable();
      this.heightController.disable();
      this.lastMenstruationPeriodController.disable();
    }

    if (enableForNulls) {
      if (this.isControlNull(this.temperatureController))
        this.temperatureController.enable();
      if (this.isControlNull(this.bloodPressureController))
        this.bloodPressureController.enable();
      if (this.isControlNull(this.pulseController))
        this.pulseController.enable();
      if (this.isControlNull(this.respiratoryRateController))
        this.respiratoryRateController.enable();
      if (this.isControlNull(this.weightController))
        this.weightController.enable();
      if (this.isControlNull(this.heightController))
        this.heightController.enable();
      if (this.isControlNull(this.lastMenstruationPeriodController))
        this.lastMenstruationPeriodController.enable();
    }
  }

  updateClaim(fieldName: string) {
    switch (fieldName) {
      case "temperature":
        this.store.dispatch(updateTemperature({ temperature: Number.parseInt(this.temperatureController.value) }));
        break;
      case "bloodPressure":
        this.store.dispatch(updateBloodPressure({ pressure: this.bloodPressureController.value }));
        break;
      case "pulse":
        this.store.dispatch(updatePulse({ pulse: Number.parseInt(this.pulseController.value) }));
        break;
      case "respiratoryRate":
        this.store.dispatch(updateRespiratoryRate({ rate: Number.parseInt(this.respiratoryRateController.value) }));
        break;
      case "weight":
        this.store.dispatch(updateWeight({ weight: Number.parseInt(this.weightController.value) }));
        break;
      case "height":
        this.store.dispatch(updateHeight({ height: Number.parseInt(this.heightController.value) }));
        break;
      case "lastMenstruationPeriod":
        this.store.dispatch(updateLastMenstruationPeriod({ period: this.lastMenstruationPeriodController.value }));
        break;
    }
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

  isControlNull(control: FormControl) {
    return control.value == null || control.value == '';
  }
}
