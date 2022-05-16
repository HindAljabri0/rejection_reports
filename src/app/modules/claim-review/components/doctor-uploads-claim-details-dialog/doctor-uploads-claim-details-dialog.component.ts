import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Service } from 'src/app/claim-module-components/models/service.model';
import { getIllnessCode } from 'src/app/claim-module-components/store/claim.reducer';
// import { Service } from 'src/app/models/service';
// import { UploadsPage } from '../../models/claimReviewState.model';
import { getSelectedIllnessCodes, getSingleClaim, getSingleClaimServices } from '../../store/claimReview.reducer';


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


  // selectedIllnesses: string[] = ['NA'];

  // beautifyCode(code: string) {
  //   if (code == 'NA') { return 'N/A'; }
  //   let str = code.substr(0, 1) + code.substr(1).toLowerCase();
  //   if (str.includes('_')) {
  //     const split = str.split('_');
  //     str = split[0] + ' ' + this.beautifyCode(split[1].toUpperCase());
  //   }
  //   return str;
  // }

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) { }



  ngOnInit() {
    this.claim$ = this.store.select(getSingleClaim);
    this.services$ = this.store.select(getSingleClaimServices);
    this.selectedIllnesses$ = this.store.select(getSelectedIllnessCodes)
    this.selectedIllnesses$.subscribe(selectedIllnesses => {
      console.log('selectedIllnesses', selectedIllnesses);
      this.selectedIllnesses = selectedIllnesses
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

}
