import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from '../models/claim.model';
import { getClaim } from '../store/claim.reducer';

@Component({
  selector: 'gdpn-calculation',
  templateUrl: './gdpn-calculation.component.html',
  styleUrls: ['./gdpn-calculation.component.css']
})
export class GdpnCalculationComponent implements OnInit {

  claim:Claim;

  constructor(private store:Store) {
    store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  ngOnInit() {
  }

}
