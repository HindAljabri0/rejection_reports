import { Component, OnInit } from '@angular/core';
import { FieldError, getClaim, getPageMode } from '../store/claim.reducer';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';
import { updateAdmissionDate, updateBedNumber, updateDischargeDate, updateLengthOfStay, updateRoomNumber } from '../store/claim.actions';
import { Period } from '../models/period.type';
import { Admission } from '../models/admission.model';

@Component({
  selector: 'claim-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css']
})
export class AdmissionComponent implements OnInit {

  admissionDateController: FormControl = new FormControl();
  admissionTimeController: FormControl = new FormControl();
  dischargeDateController: FormControl = new FormControl();
  dischargeTimeController: FormControl = new FormControl();
  lengthOfStayController: FormControl = new FormControl();
  lengthOfStayUnit: string = 'Day';
  roomNumberController: FormControl = new FormControl();
  bedNumberController: FormControl = new FormControl();


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
    const admission = (claim.admission == null ? new Admission() : claim.admission);
    const admissionDate = admission.admissionDate;
    const dischargeDate = admission.discharge.dischargeDate;
    const lengthOfStay = admission.discharge.actualLengthOfStay;
    const roomNumber = admission.roomNumber;
    const bedNumber = admission.bedNumber;
    if (admissionDate != null) {
      this.admissionDateController.setValue(this.datePipe.transform(admissionDate, 'yyyy-MM-dd'));
      this.admissionTimeController.setValue(this.datePipe.transform(admissionDate, 'hh:mm:ss'));
    } else {
      this.admissionDateController.setValue('');
      this.admissionTimeController.setValue('');
    }
    if (dischargeDate != null) {
      this.dischargeDateController.setValue(this.datePipe.transform(dischargeDate, 'yyyy-MM-dd'));
      this.dischargeTimeController.setValue(this.datePipe.transform(dischargeDate, 'hh:mm:ss'));
    } else {
      this.dischargeDateController.setValue('');
      this.dischargeTimeController.setValue('');
    }
    this.lengthOfStayController.setValue(lengthOfStay);
    this.roomNumberController.setValue(roomNumber);
    this.bedNumberController.setValue(bedNumber);
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    if (allowEdit) {
      this.admissionDateController.enable();
      this.admissionTimeController.enable();
      this.dischargeDateController.enable();
      this.dischargeTimeController.enable();
      this.lengthOfStayController.enable();
      this.roomNumberController.enable();
      this.bedNumberController.enable();
    } else {
      this.admissionDateController.disable();
      this.admissionTimeController.disable();
      this.dischargeDateController.disable();
      this.dischargeTimeController.disable();
      this.lengthOfStayController.disable();
      this.roomNumberController.disable();
      this.bedNumberController.disable();
    }

    if (enableForNulls) {
      if (this.isControlNull(this.admissionDateController))
        this.admissionDateController.enable();
      if (this.isControlNull(this.admissionTimeController))
        this.admissionTimeController.enable();
      if (this.isControlNull(this.dischargeDateController))
        this.dischargeDateController.enable();
      if (this.isControlNull(this.dischargeTimeController))
        this.dischargeTimeController.enable();
      if (this.isControlNull(this.lengthOfStayController))
        this.lengthOfStayController.enable();
      if (this.isControlNull(this.roomNumberController))
        this.roomNumberController.enable();
      if (this.isControlNull(this.bedNumberController))
        this.bedNumberController.enable();
    }
  }

  updateClaim(fieldName: string) {
    switch (fieldName) {
      case 'admissionDate': case 'admissionTime':
        let date1: string;
        if (!this.isControlNull(this.admissionDateController))
          date1 = this.admissionDateController.value
        if (!this.isControlNull(this.admissionTimeController))
          date1 += ' ' + this.admissionTimeController.value
        if (date1 != null)
          this.store.dispatch(updateAdmissionDate({ date: new Date(date1) }));
        break;
      case 'dischargeDate': case 'dischargeTime':
        let date2: string;
        if (!this.isControlNull(this.dischargeDateController))
          date2 = this.dischargeDateController.value
        if (!this.isControlNull(this.dischargeTimeController))
          date2 += ' ' + this.dischargeTimeController.value
        if (date2 != null)
          this.store.dispatch(updateDischargeDate({ date: new Date(date2) }));
        break;
      case 'lengthOfStay':
        this.store.dispatch(updateLengthOfStay({ length: this.returnPeriod(this.lengthOfStayController.value, this.lengthOfStayUnit) }));
        break;
      case 'roomNumber':
        this.store.dispatch(updateRoomNumber({ number: this.roomNumberController.value }));
        break;
      case 'bedNumber':
        this.store.dispatch(updateBedNumber({ number: this.bedNumberController.value }));
        break;
    }
  }

  updateClaimUnit(field: string, event) {

    switch (field) {
      case ('stayUnit'):
        this.lengthOfStayUnit = event.value;
        if (this.lengthOfStayController.value != null)
          this.store.dispatch(updateLengthOfStay({ length: this.returnPeriod(this.lengthOfStayController.value, this.lengthOfStayUnit) }));
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
