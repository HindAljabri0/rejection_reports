import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Period } from '../models/period.type';
import { updateClaimDate, updateClaimType, updateFileNumber, updateMemberDob, updateIllnessDuration, updateAge } from '../store/claim.actions';

@Component({
  selector: 'gen-info',
  templateUrl: './gen-info.component.html',
  styleUrls: ['./gen-info.component.css']
})
export class GenInfoComponent implements OnInit {

  claimDateController: FormControl = new FormControl();
  claimTypeController: FormControl = new FormControl();
  fielNumberController: FormControl = new FormControl();
  memberDobController: FormControl = new FormControl();
  illnessDurationController: FormControl = new FormControl();
  ageController: FormControl = new FormControl();
  unitIllness: string;
  unitAge: string;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  updateClaim(field: string) {
    switch (field) {
      case ('claimDate'):
        this.store.dispatch(updateClaimDate({ claimDate: this.claimDateController.value }));
        break;
      case ('claimType'):
        this.store.dispatch(updateClaimType({ claimType: this.claimTypeController.value }));
        break;
      case ('fileNumber'):
        this.store.dispatch(updateFileNumber({ fileNumber: this.fielNumberController.value }));
        break;
      case ('memberDob'):
        this.store.dispatch(updateMemberDob({ memberDob: this.memberDobController.value }));
        break;
      case ('illnessDuration'):
        var illnessPeriod = this.returnPeriod(this.illnessDurationController.value, this.unitIllness);
        this.store.dispatch(updateIllnessDuration({ illnessDuration: illnessPeriod }));
        break;
      case ('age'):
        var agePeriod = this.returnPeriod(this.ageController.value, this.unitAge);
        this.store.dispatch(updateAge({ age: agePeriod }));
        break;
    }
  }

  updateClaimUnit(field: string, event) {

    switch (field) {
      case ('illnessDurationUnit'):
        this.unitIllness = event.value;
        if(this.illnessDurationController.value!=null)
        this.store.dispatch(updateIllnessDuration({ illnessDuration: this.returnPeriod(this.illnessDurationController.value,this.unitIllness) }));
        break;
      case ('ageUnit'):
        this.unitAge = event.value;
        if(this.ageController.value!=null)
        this.store.dispatch(updateAge({ age: this.returnPeriod(this.ageController.value,this.unitAge) }));
        break;
    }
  }

  returnPeriod(value: string, unit: string) {
    if (unit === 'Year')
      return { 'Years': value };
    else;
    if (unit === 'Month')
      return { 'Months': value };
    else;
    if (unit === 'Day')
      return { 'Days': value };
    else
      return { 'Years': value };
  }

}
