import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Claim } from 'src/app/claim-module-components/models/claim.model';
import { Service } from 'src/app/claim-module-components/models/service.model';
// import { Service } from 'src/app/models/service';
// import { UploadsPage } from '../../models/claimReviewState.model';
import { getSingleClaim, getSingleClaimServices } from '../../store/claimReview.reducer';


@Component({
  selector: 'app-doctor-uploads-claim-details-dialog',
  templateUrl: './doctor-uploads-claim-details-dialog.component.html',
  styles: []
})
export class DoctorUploadsClaimDetailsDialogComponent implements OnInit {

  claim$: Observable<Claim>;
  services$: Observable<Service[]>;

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store) { }
  serviceList


  ngOnInit() {
    this.claim$ = this.store.select(getSingleClaim);
    this.services$ = this.store.select(getSingleClaimServices);
    
    // this.claim$.subscribe((claim) => {
    //   if (claim != null) {
    //     this.serviceList = claim.invoice.map(invoice => invoice.service).reduce((serviceList1, serviceList2) => { let res = []; res.push(...serviceList1); res.push(...serviceList2); return res; })
    //     console.log('this.serviceList', this.serviceList);
    //   }
    // })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
