import { Component, OnInit } from '@angular/core';
import { FieldError, getClaim, getPageMode } from '../store/claim.reducer';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

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
  roomNumberController: FormControl = new FormControl();
  bedNumberController: FormControl = new FormControl();


  errors: FieldError[] = [];

  constructor(private store: Store, private datePipe: DatePipe) { }

  ngOnInit() {
    // this.store.select(getIsRetrievedClaim).pipe(
    //   withLatestFrom(this.store.select(getClaim)),
    //   withLatestFrom(this.store.select(getPageMode)),
    //   map(values => ({ isRetrieved: values[0][0], claim: values[0][1], mode: values[1] }))
    // ).subscribe(
    //   values => {
    //     if (values.isRetrieved) {
    //       if (values.claim.admission != null) {
    //         const admissionDate = values.claim.admission.admissionDate;
    //         const dischargeDate = values.claim.admission.discharge.dischargeDate;
    //         const lengthOfStay = values.claim.admission.estimatedLengthOfStay;
    //         const roomNumber = values.claim.admission.roomNumber;
    //         const bedNumber = values.claim.admission.bedNumber;
    //         if (admissionDate != null) {
    //           this.admissionDateController.setValue(this.datePipe.transform(admissionDate, 'yyyy-MM-dd'));
    //           this.admissionTimeController.setValue(this.datePipe.transform(admissionDate, 'hh:mm:ss'));
    //           this.admissionDateController.disable({ onlySelf: true });
    //           this.admissionTimeController.disable({ onlySelf: true });
    //         }
    //         if (dischargeDate != null) {
    //           this.dischargeDateController.setValue(this.datePipe.transform(dischargeDate, 'yyyy-MM-dd'));
    //           this.dischargeTimeController.setValue(this.datePipe.transform(dischargeDate, 'hh:mm:ss'));
    //           this.dischargeDateController.disable({ onlySelf: true });
    //           this.dischargeTimeController.disable({ onlySelf: true });
    //         }
    //         this.lengthOfStayController.setValue(lengthOfStay);
    //         this.lengthOfStayController.disable({ onlySelf: lengthOfStay != null });
    //         this.roomNumberController.setValue(roomNumber);
    //         this.roomNumberController.disable({ onlySelf: roomNumber != null });7
    //         this.bedNumberController.setValue(bedNumber);
    //         this.bedNumberController.disable({ onlySelf: bedNumber != null });
    //       }
    //       if (values.mode != 'CREATE') {
    //         this.admissionDateController.disable({ onlySelf: true });
    //         this.admissionTimeController.disable({ onlySelf: true });
    //         this.dischargeDateController.disable({ onlySelf: true });
    //         this.dischargeTimeController.disable({ onlySelf: true });
    //         this.lengthOfStayController.disable({ onlySelf: true });
    //         this.roomNumberController.disable({ onlySelf: true });
    //         this.bedNumberController.disable({ onlySelf: true });
    //       }
    //     }
    //   }
    // )
  }

  updateClaim(fieldName: string) {

  }

  updateClaimUnit(field: string, event) {
    // switch (field) {
    //   case ('illnessDurationUnit'):
    //     this.unitIllness = event.value;
    //     if (this.illnessDurationController.value != null)
    //       this.store.dispatch(updateIllnessDuration({ illnessDuration: this.returnPeriod(this.illnessDurationController.value, this.unitIllness) }));
    //     break;
    //   case ('ageUnit'):
    //     this.unitAge = event.value;
    //     if (this.ageController.value != null)
    //       this.store.dispatch(updateAge({ age: this.returnPeriod(this.ageController.value, this.unitAge) }));
    //     break;
    // }
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
