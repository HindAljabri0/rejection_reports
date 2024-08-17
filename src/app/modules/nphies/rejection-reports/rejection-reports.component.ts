import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rejection-reports',
  templateUrl: './rejection-reports.component.html',
  styles: []
})
export class RejectionReportsComponent implements OnInit {
    claimsAdvanceSearchEnable=false;
    itlemsAdvanceSearchEnable=false;
    
    constructor() { }

    ngOnInit() {
  }

claimsToggleAdvanceSearch(){
    this.claimsAdvanceSearchEnable = !this.claimsAdvanceSearchEnable;
}

itemsToggleAdvanceSearch(){
    this.itlemsAdvanceSearchEnable = !this.itlemsAdvanceSearchEnable;
}

}
