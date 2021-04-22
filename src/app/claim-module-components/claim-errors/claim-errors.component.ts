import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FieldError, getRetrievedClaimProps, getUncategorisedErrors , getGenInfoErrors ,getDiagnosisErrors ,getInvoicesErrors, getLabResultsErrors} from '../store/claim.reducer';

@Component({
  selector: 'claim-errors',
  templateUrl: './claim-errors.component.html',
  styles: []
})
export class ClaimErrorsComponent implements OnInit {

  errors: FieldError[];

  constructor(private store: Store) { }
 

  ngOnInit() {
    this.store.select(getUncategorisedErrors).subscribe(error => {
      // tslint:disable-next-line: curly
   
        this.errors = error;
    
    });

    this.store.select(getGenInfoErrors).subscribe(error => {
      // tslint:disable-next-line: curly
   
        this.errors = error;
    
    });

    // this.store.select(getDiagnosisErrors).subscribe(error => {
    //   // tslint:disable-next-line: curly
   
    //     this.errors = error;
    
    // });

   // this.store.select(getInvoicesErrors).subscribe(error => {
 
   //     this.errors = error;
    
 //});
    
    // this.store.select(getLabResultsErrors).subscribe(error => {
    //   // tslint:disable-next-line: curly
   
    //     this.errors = error;
    
    // });
  }

}
