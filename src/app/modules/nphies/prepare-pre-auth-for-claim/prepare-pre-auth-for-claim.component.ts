import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prepare-pre-auth-for-claim',
  templateUrl: './prepare-pre-auth-for-claim.component.html',
  styles: []
})
export class PreparePreAuthForClaim implements OnInit {

  currentOpenRow = -1;
  advanceSearchEnable = false;

  constructor() { }

  ngOnInit() {
  }

  toggleRow(index) {
    this.currentOpenRow = this.currentOpenRow == index ? -1 : index;
  }

  toggleAdvanceSearch() {
    this.advanceSearchEnable = !this.advanceSearchEnable;
  }

}
