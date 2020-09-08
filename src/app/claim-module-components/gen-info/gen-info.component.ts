import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Period } from '../models/period.type';
import { updateClaimDate, updateCaseType, updateFileNumber, updateMemberDob, updateIllnessDuration, updateAge, updateMainSymptoms } from '../store/claim.actions';
import { getDepartmentCode, FieldError, getGenInfoErrors, getIsRetrievedClaim, getClaim, ClaimPageType, getPageType } from '../store/claim.reducer';
import { withLatestFrom } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit {

  isRetrievedClaim: boolean = false;

  departmentCode: string;

  claimDateController: FormControl = new FormControl();
  
  
  fileNumberController: FormControl = new FormControl();
  memberDobController: FormControl = new FormControl();
  illnessDurationController: FormControl = new FormControl();
  ageController: FormControl = new FormControl();
  mainSymptomsController: FormControl = new FormControl();
  unitIllness: string = 'Day';
  unitAge: string = 'Year';

  significantSignController: FormControl = new FormControl();
  commReportController: FormControl = new FormControl();
  eligibilityNumController: FormControl = new FormControl();
  selectedCaseType: string;
  radiologyReportController: FormControl = new FormControl();
  otherConditionController: FormControl = new FormControl();

  errors: FieldError[] = [];

  claimPageType:ClaimPageType;

  constructor(private store: Store, private datePipe: DatePipe) { }

  ngOnInit() {
    this.store.select(getPageType).subscribe(type => this.claimPageType = type);
    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim))
    ).subscribe((values) => {
      this.isRetrievedClaim = values[0];
      if (this.isRetrievedClaim) {
        this.fileNumberController.setValue(values[1].caseInformation.patient.patientFileNumber);
        this.fileNumberController.disable({onlySelf: values[1].caseInformation.patient.patientFileNumber != null});
        const illnessDuration = values[1].caseInformation.caseDescription.illnessDuration;
        if (illnessDuration != null) {
          if (illnessDuration.years != null) {
            this.illnessDurationController.setValue(illnessDuration.years);
            this.illnessDurationController.disable({onlySelf:true});
            this.unitIllness = 'Year';
          } else if (illnessDuration.months != null) {
            this.illnessDurationController.setValue(illnessDuration.months);
            this.illnessDurationController.disable({onlySelf:true});
            this.unitIllness = 'Month';
          } else if (illnessDuration.days != null) {
            this.illnessDurationController.setValue(illnessDuration.days);
            this.illnessDurationController.disable({onlySelf:true});
            this.unitIllness = 'Day';
          }
        }
        const ageDuration = values[1].caseInformation.patient.age;
        if (ageDuration != null) {
          if (ageDuration.years != null) {
            this.ageController.setValue(ageDuration.years);
            this.ageController.disable({onlySelf:true});
            this.unitAge = 'Year';
          } else if (ageDuration.months != null) {
            this.ageController.setValue(ageDuration.months);
            this.ageController.disable({onlySelf:true});
            this.unitAge = 'Month';
          } else if (ageDuration.days != null) {
            this.ageController.setValue(ageDuration.days);
            this.ageController.disable({onlySelf:true});
            this.unitAge = 'Day';
          }
        }
        this.mainSymptomsController.setValue(values[1].caseInformation.caseDescription.chiefComplaintSymptoms);
        this.mainSymptomsController.disable({onlySelf: values[1].caseInformation.caseDescription.chiefComplaintSymptoms != null});
        const visitDate = values[1].visitInformation.visitDate;
        if(visitDate != null){
          this.claimDateController.setValue(this.datePipe.transform(visitDate, 'yyyy-MM-dd'));
          this.claimDateController.disable({onlySelf: true});
        }
        const dob = values[1].caseInformation.patient.dob;
        if(dob != null){
          this.memberDobController.setValue(this.datePipe.transform(dob, 'yyyy-MM-dd'));
          this.memberDobController.disable({onlySelf: true});
        }
      } else {

      }

    }).unsubscribe();

    this.store.select(getDepartmentCode).subscribe(type => this.departmentCode = type);
    this.store.select(getGenInfoErrors).subscribe(errors => this.errors = errors);
  }

  updateClaim(field: string) {
    switch (field) {
      case ('claimDate'):
        this.store.dispatch(updateClaimDate({ claimDate: new Date(this.claimDateController.value) }));
        break;
      case ('caseType'):
        this.store.dispatch(updateCaseType({ caseType: this.selectedCaseType }));
        break;
      case ('fileNumber'):
        this.store.dispatch(updateFileNumber({ fileNumber: this.fileNumberController.value }));
        break;
      case ('memberDob'):
        this.store.dispatch(updateMemberDob({ memberDob: new Date(this.memberDobController.value) }));
        break;
      case ('illnessDuration'):
        var illnessPeriod = this.returnPeriod(this.illnessDurationController.value, this.unitIllness);
        this.store.dispatch(updateIllnessDuration({ illnessDuration: illnessPeriod }));
        break;
      case ('age'):
        var agePeriod = this.returnPeriod(this.ageController.value, this.unitAge);
        this.store.dispatch(updateAge({ age: agePeriod }));
        break;
      case ('mainSymptoms'):
        this.store.dispatch(updateMainSymptoms({ symptoms: this.mainSymptomsController.value }));
        break;
    }
  }

  updateClaimUnit(field: string, event) {

    switch (field) {
      case ('illnessDurationUnit'):
        this.unitIllness = event.value;
        if (this.illnessDurationController.value != null)
          this.store.dispatch(updateIllnessDuration({ illnessDuration: this.returnPeriod(this.illnessDurationController.value, this.unitIllness) }));
        break;
      case ('ageUnit'):
        this.unitAge = event.value;
        if (this.ageController.value != null)
          this.store.dispatch(updateAge({ age: this.returnPeriod(this.ageController.value, this.unitAge) }));
        break;
    }
  }

  returnPeriod(value: string, unit: string): Period {
    if (unit === 'Year')
      return new Period(Number.parseInt(value), 'years');
    else;
    if (unit === 'Month')
      return new Period(Number.parseInt(value), 'months');
    else;
    if (unit === 'Day')
      return new Period(Number.parseInt(value), 'days');
    else
      return new Period(Number.parseInt(value), 'years');
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
