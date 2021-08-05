import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FieldError, getAllErrors } from '../store/claim.reducer';

@Component({
  selector: 'claim-errors',
  templateUrl: './claim-errors.component.html',
  styles: []
})
export class ClaimErrorsComponent implements OnInit {

  errors: FieldError[] = [];

  constructor(private store: Store) { }


  ngOnInit() {
    this.store.select(getAllErrors).subscribe(error => {
      this.errors = [
        ...error.diagnosisErrors,
        ...error.genInfoErrors,
        ...error.invoicesErrors,
        ...error.labResultsErrors,
        ...error.uncategorised,
        ...error.admissionErrors,
        ...error.illnessErrors,
        ...error.vitalSignsErrors,
      ];
    });
  }

}
