import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { startCreatingNewClaim } from '../store/claim.actions';
import { Claim } from '../models/claim.model';
import { getClaim } from '../store/claim.reducer';

@Component({
  selector: 'app-main-claim-page',
  templateUrl: './main-claim-page.component.html',
  styleUrls: ['./main-claim-page.component.css']
})
export class MainClaimPageComponent implements OnInit {

  claim: Claim;

  constructor(private router: Router, private store:Store) {
    store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  ngOnInit() {
    const claimId = this.router.routerState.snapshot.url.split('/')[2];
    if(claimId != 'add'){
      //to be changed later if we decide to view/edit the claim here.
      this.router.navigate(['/']);
    }
  }

  startCreatingClaim(type:string){
    this.store.dispatch(startCreatingNewClaim({caseType:type}));
  }

}
