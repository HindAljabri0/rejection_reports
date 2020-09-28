import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Period } from '../models/period.type';
import { updateClaimDate, updateCaseType, updateFileNumber, updateMemberDob, updateIllnessDuration, updateAge, updateMainSymptoms, updateSignificantSign, updateCommReport, updateEligibilityNum, updateRadiologyReport, updateOtherCondition } from '../store/claim.actions';
import { getDepartmentCode, FieldError, getGenInfoErrors, getClaim, ClaimPageType, getPageType, getPageMode, ClaimPageMode } from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Claim } from '../models/claim.model';

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
  isCaceTypeEnabled: boolean = true;
  radiologyReportController: FormControl = new FormControl();
  otherConditionController: FormControl = new FormControl();

  errors: FieldError[] = [];

  pageMode: ClaimPageMode;
  claimPageType: ClaimPageType;

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
    this.store.select(getPageType).subscribe(type => this.claimPageType = type);
    this.store.select(getDepartmentCode).subscribe(type => this.departmentCode = type);
    this.store.select(getGenInfoErrors).subscribe(errors => this.errors = errors);
  }

  setData(claim: Claim) {
    this.fileNumberController.setValue(claim.caseInformation.patient.patientFileNumber);

    const illnessDuration = claim.caseInformation.caseDescription.illnessDuration;
    if (illnessDuration != null) {
      if (illnessDuration.years != null) {
        this.illnessDurationController.setValue(illnessDuration.years);
        this.unitIllness = 'Year';
      } else if (illnessDuration.months != null) {
        this.illnessDurationController.setValue(illnessDuration.months);
        this.unitIllness = 'Month';
      } else if (illnessDuration.days != null) {
        this.illnessDurationController.setValue(illnessDuration.days);
        this.unitIllness = 'Day';
      } else this.illnessDurationController.setValue('');
    } else this.illnessDurationController.setValue('');
    const ageDuration = claim.caseInformation.patient.age;
    if (ageDuration != null) {
      if (ageDuration.years != null) {
        this.ageController.setValue(ageDuration.years);
        this.unitAge = 'Year';
      } else if (ageDuration.months != null) {
        this.ageController.setValue(ageDuration.months);
        this.unitAge = 'Month';
      } else if (ageDuration.days != null) {
        this.ageController.setValue(ageDuration.days);
        this.unitAge = 'Day';
      } else this.ageController.setValue('');
    } else this.ageController.setValue('');
    this.mainSymptomsController.setValue(claim.caseInformation.caseDescription.chiefComplaintSymptoms);
    const visitDate = claim.visitInformation.visitDate;
    if (visitDate != null) {
      this.claimDateController.setValue(this.datePipe.transform(visitDate, 'yyyy-MM-dd'));
    } else this.claimDateController.setValue('');
    const dob = claim.caseInformation.patient.dob;
    if (dob != null) {
      this.memberDobController.setValue(this.datePipe.transform(dob, 'yyyy-MM-dd'));
    } else this.memberDobController.setValue('');
    this.significantSignController.setValue(claim.caseInformation.caseDescription.signicantSigns);
    this.commReportController.setValue(claim.commreport);
    this.eligibilityNumController.setValue(claim.claimIdentities.eligibilityNumber);
    this.selectedCaseType = claim.caseInformation.caseType;
    this.radiologyReportController.setValue(claim.caseInformation.radiologyReport);
    this.otherConditionController.setValue(claim.caseInformation.otherConditions);
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    this.fileNumberController.disable();
    this.claimDateController.disable();
    this.isCaceTypeEnabled = false;
    if (allowEdit) {
      this.illnessDurationController.enable();
      this.ageController.enable();
      this.mainSymptomsController.enable();
      this.memberDobController.enable();
      this.significantSignController.enable();
      this.commReportController.enable();
      this.radiologyReportController.enable();
      this.otherConditionController.enable();
      this.eligibilityNumController.enable();
    } else {
      this.illnessDurationController.disable();
      this.ageController.disable();
      this.mainSymptomsController.disable();
      this.memberDobController.disable();
      this.significantSignController.disable();
      this.commReportController.disable();
      this.radiologyReportController.disable();
      this.otherConditionController.disable();
      this.eligibilityNumController.disable()
    }

    if (enableForNulls) {
      if (this.isControlNull(this.fileNumberController))
        this.fileNumberController.enable();
      if (this.isControlNull(this.illnessDurationController))
        this.illnessDurationController.enable();
      if (this.isControlNull(this.ageController))
        this.ageController.enable();
      if (this.isControlNull(this.mainSymptomsController))
        this.mainSymptomsController.enable();
      if (this.isControlNull(this.claimDateController))
        this.claimDateController.enable();
      if (this.isControlNull(this.memberDobController))
        this.memberDobController.enable();
      if (this.isControlNull(this.significantSignController))
        this.significantSignController.enable();
      if (this.isControlNull(this.commReportController))
        this.commReportController.enable();
      if (this.isControlNull(this.radiologyReportController))
        this.radiologyReportController.enable();
      if (this.isControlNull(this.otherConditionController))
        this.otherConditionController.enable();
      if (this.isControlNull(this.eligibilityNumController))
        this.eligibilityNumController.enable();
    }
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
      case 'significantSign':
        this.store.dispatch(updateSignificantSign({ sign: this.significantSignController.value }));
        break;
      case 'commReport':
        this.store.dispatch(updateCommReport({ report: this.commReportController.value }));
        break;
      case 'eligibilityNum':
        this.store.dispatch(updateEligibilityNum({ number: this.eligibilityNumController.value }));
        break;
      case 'radiologyReport':
        this.store.dispatch(updateRadiologyReport({ report: this.radiologyReportController.value }));
        break;
      case 'otherCondition':
        this.store.dispatch(updateOtherCondition({ condition: this.otherConditionController.value }));
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

  isControlNull(control: FormControl) {
    return control.value == null || control.value == '';
  }

}
