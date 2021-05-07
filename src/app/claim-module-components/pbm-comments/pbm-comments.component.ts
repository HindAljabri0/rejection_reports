import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from '../models/claim.model';
import { getClaim, getRetrievedClaimProps } from '../store/claim.reducer';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';

@Component({
  selector: 'pbm-comments',
  templateUrl: './pbm-comments.component.html',
  styles: []
})
export class PbmCommentsComponent implements OnInit {
  claim: Claim;
  claimProps: RetrievedClaimProps;
  pbmClaimError: any[] = [];
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getClaim).subscribe(type => this.claim = type);
    this.store.select(getRetrievedClaimProps).subscribe(props => this.claimProps = props);
    this.pbmClaimError = this.claimProps.pbmClaimError !== null && this.claimProps.pbmClaimError !== undefined && this.claimProps.pbmClaimError.length > 0 ? this.claimProps.pbmClaimError : [];
  }

}
