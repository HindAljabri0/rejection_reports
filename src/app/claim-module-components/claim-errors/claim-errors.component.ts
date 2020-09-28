import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRetrievedClaimProps } from '../store/claim.reducer';

@Component({
  selector: 'claim-errors',
  templateUrl: './claim-errors.component.html',
  styleUrls: ['./claim-errors.component.css']
})
export class ClaimErrorsComponent implements OnInit {

  errors: {
    code: string,
    description: string,
    fieldName: string
  }[];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getRetrievedClaimProps).subscribe(props => {
      if (props != null)
        this.errors = props.errors
    });
  }

}
