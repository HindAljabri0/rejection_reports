import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { FieldError, getClaim, getIsRetrievedClaim, getPageMode } from '../store/claim.reducer';

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
    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({isRetrieved: values[0][0], claim: values[0][1], mode: values[1]}))
    ).subscribe(
      values => {
        if(values.isRetrieved){
          const temperature = values.claim.caseInformation.caseDescription.temperature;
          const bloodPressure = values.claim.caseInformation.caseDescription.bloodPressure;
          const pulse = values.claim.caseInformation.caseDescription.pulse;
          const respiratoryRate = values.claim.caseInformation.caseDescription.respRate;
          const weight = values.claim.caseInformation.caseDescription.weight;
          const height = values.claim.caseInformation.caseDescription.height;
          const lastMenstruationPeriod = values.claim.caseInformation.caseDescription.lmp;

          this.temperatureController.setValue(temperature);
          this.temperatureController.disable({ onlySelf: values.mode != 'CREATE' || temperature != null});

          this.bloodPressureController.setValue(bloodPressure);
          this.bloodPressureController.disable({ onlySelf: values.mode != 'CREATE' || bloodPressure != null});

          this.pulseController.setValue(pulse);
          this.pulseController.disable({ onlySelf: values.mode != 'CREATE' || pulse != null});

          this.respiratoryRateController.setValue(respiratoryRate);
          this.respiratoryRateController.disable({ onlySelf: values.mode != 'CREATE' || respiratoryRate != null});

          this.weightController.setValue(weight);
          this.weightController.disable({ onlySelf: values.mode != 'CREATE' || weight != null});

          this.heightController.setValue(height);
          this.heightController.disable({ onlySelf: values.mode != 'CREATE' || height != null});

          if(lastMenstruationPeriod != null){
            this.lastMenstruationPeriodController.setValue(this.datePipe.transform(lastMenstruationPeriod, 'yyyy-MM-dd'));
          }
          this.lastMenstruationPeriodController.disable({ onlySelf: values.mode != 'CREATE' || lastMenstruationPeriod != null});
        }
      }
    )
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
