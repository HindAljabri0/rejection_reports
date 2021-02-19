import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bupa-rejection-report',
  templateUrl: './bupa-rejection-report.component.html',
  styles: []
})
export class BupaRejectionReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  controlBlur(e) {
    e.currentTarget.parentElement.classList.remove('focused');
  }

  controlFocus(e) {
    e.currentTarget.parentElement.classList.add('focused');
  }

  controlClick(e) {
    e.currentTarget.querySelector('.form-control').focus();
  }

}
