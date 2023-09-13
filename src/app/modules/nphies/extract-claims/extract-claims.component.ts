import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extract-claims',
  templateUrl: './extract-claims.component.html',
  styles: []
})
export class ExtractClaimsComponent implements OnInit {
  extractBy = 'by-payer';
  constructor() { }

  ngOnInit() {
  }

}
