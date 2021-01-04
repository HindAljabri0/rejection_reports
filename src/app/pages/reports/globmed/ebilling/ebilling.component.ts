import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ebilling',
  templateUrl: './ebilling.component.html',
  styleUrls: ['./ebilling.component.css']
})
export class EbillingComponent implements OnInit {
  pageSize: number;
  fetchData() {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}
