import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from '../models/claim.model';
import { getClaim, getRetrievedClaimProps, getPBMClaimError, getPBMClaimStatus } from '../store/claim.reducer';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';

@Component({
  selector: 'pbm-comments',
  templateUrl: './pbm-comments.component.html',
  styles: []
})
export class PbmCommentsComponent implements OnInit {
  pbmClaimError: any[] = [];
  pbmClaimStatus: string;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPBMClaimError).subscribe(pbmData => this.pbmClaimError = pbmData);
    this.store.select(getPBMClaimStatus).subscribe(pbmData => this.pbmClaimStatus = pbmData);
    this.pbmClaimError = this.pbmClaimError !== null && this.pbmClaimError !== undefined && this.pbmClaimError.length > 0 ? this.pbmClaimError : [];
  }

}
