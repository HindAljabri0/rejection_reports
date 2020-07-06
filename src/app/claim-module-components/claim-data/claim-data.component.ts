import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeSelectedTab } from '../store/claim.actions';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'claim-data',
  templateUrl: './claim-data.component.html',
  styleUrls: ['./claim-data.component.css']
})
export class ClaimDataComponent implements OnInit {

  constructor(private store:Store) { }

  ngOnInit() {
  }

  changeTab(event:MatTabChangeEvent){
    this.store.dispatch(changeSelectedTab({tab:event.index}));
  }

}
