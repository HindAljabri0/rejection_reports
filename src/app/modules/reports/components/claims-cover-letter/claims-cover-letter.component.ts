import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-claims-cover-letter',
  templateUrl: './claims-cover-letter.component.html',
  styles: []
})
export class ClaimsCoverLetterComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  constructor() { }

  ngOnInit() {
  }

}
