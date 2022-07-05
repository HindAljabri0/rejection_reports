import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convert-pre-auth-to-claim',
  templateUrl: './convert-pre-auth-to-claim.component.html',
  styles: []
})
export class ConvertPreAuthToClaimComponent implements OnInit {

  currentOpenRow = -1;

  constructor() { }

  ngOnInit() {
  }

  toggleRow(index) {
    this.currentOpenRow = this.currentOpenRow == index ? -1 : index;
  }

}
