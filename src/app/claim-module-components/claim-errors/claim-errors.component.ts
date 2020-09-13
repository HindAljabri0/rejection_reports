import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'claim-errors',
  templateUrl: './claim-errors.component.html',
  styleUrls: ['./claim-errors.component.css']
})
export class ClaimErrorsComponent implements OnInit {

  errors: {
    code: string,
    description: string,
    fieldName: string
  }[];

  constructor() { }

  ngOnInit() {
  }

}
