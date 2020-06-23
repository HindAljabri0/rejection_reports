import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  updateClaim(field: string) {
    switch (field) {
      case ('claimDate'):

        break;
      case ('claimType'):

        break;
      case ('fileNumber'):

        break;
      case ('memberDob'):

        break;
      case (' illnessDuration'):

        break;
      case ('age'):

        break;

    }
  }

  updateClaimUnit(field: string, event) {

    switch (field) {
      case ('illnessDurationUnit'):
        this.unitIllness = event.value;
        console.log("illness" + this.unitIllness);

        break;
      case ('ageUnit'):
        this.unitAge = event.value;
        console.log("age" + this.unitAge);

        break;
    }

  }

}
