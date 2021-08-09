import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styles: []
})
export class BeneficiaryComponent implements OnInit {
  addMode = false;
  editMode = false;
  viewMode = false;
  constructor() { }

  ngOnInit() {
  }

}
