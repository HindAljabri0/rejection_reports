import { Component, OnInit } from '@angular/core';
import { FieldError } from '../store/claim.reducer';
import { FormControl } from '@angular/forms';

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
  
  constructor() { }

  ngOnInit() {
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
