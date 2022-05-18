import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatTab, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Diagnosis } from 'src/app/claim-module-components/models/diagnosis.model';
import { Service } from 'src/app/claim-module-components/models/service.model';
// import { FieldError } from 'src/app/claim-module-components/store/claim.reducer';
import { FieldError, getClaimErrors, getSelectedIllnessCodes, getSingleClaim, getSingleClaimServices } from '../../store/claimReview.reducer';


@Component({
  selector: 'app-doctor-uploads-claim-details-dialog',
  templateUrl: './doctor-uploads-claim-details-dialog.component.html',
  styles: []
})
export class DoctorUploadsClaimDetailsDialogComponent implements OnInit {

  claim$: Observable<Claim>;
  services$: Observable<Service[]>;
  selectedIllnesses$: Observable<string[]>;
  selectedIllnesses: string[] = [];
  errors$: Observable<{errors: FieldError[]}>;
  selectedTabIndex = 0

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) { }



  ngOnInit() {
    this.claim$ = this.store.select(getSingleClaim);
    this.services$ = this.store.select(getSingleClaimServices);
    this.selectedIllnesses$ = this.store.select(getSelectedIllnessCodes)
    this.selectedIllnesses$.subscribe(selectedIllnesses => {
      this.selectedIllnesses = selectedIllnesses
    })
    this.errors$ = this.store.select(getClaimErrors)
    this.errors$.subscribe(data =>{
      console.log('errors: ', data);
    })
  }

  isSelected(illnessCode: string): boolean {
    const codeIndex = this.selectedIllnesses.findIndex(code => {
      return code.toUpperCase() === illnessCode.toUpperCase();
    });

    return codeIndex !== -1

  }

  closeDialog() {
    this.dialogRef.close();
  }


  focusOutFunction(diagnosis: Diagnosis, value: string){
    console.log('value: ', value);
    console.log('diagnosis: ', diagnosis);
  }

  nextTab() {
    if( this.selectedTabIndex !== 7){
      this.selectedTabIndex = this.selectedTabIndex + 1
    }
      
 }

 prevTab() {
  if( this.selectedTabIndex !== 0){
    this.selectedTabIndex = this.selectedTabIndex - 1
  }
}

firstTab() {
  this.selectedTabIndex = 0
}

lastTab() {
  this.selectedTabIndex = 7
}

}
