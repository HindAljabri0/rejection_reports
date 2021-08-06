import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-medical-rejction-report',
  templateUrl: './medical-rejction-report.component.html',
  styleUrls: ['./medical-rejction-report.component.css']
})
export class MedicalRejctionReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  medicalRejectionReportForm: FormGroup;
  submitted = false;
  errorMessage: string;
  detailTopActionIcon = 'ic-download.svg';
  claimStatusSummaryData: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false };
  minDate: any;
  criterias: { id: string, name: string }[] = [
    { id: 'uploaddate', name: 'Upload Date' },
    { id: 'claimdate', name: 'Claim Date' },
  ];
  constructor(public commen: SharedServices,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private location: Location,
    private routeActive: ActivatedRoute) {

  }

  ngOnInit() {
    this.payers = [];
    this.medicalRejectionReportForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      summaryCriteria: ['', Validators.required],
    });
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
    });
  }
  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/claim-status-summary-report?';
    if (this.medicalRejectionReportForm.value.payerId != null) {
      path += `payerId=${this.medicalRejectionReportForm.value.payerId}&`;
    }
    if (this.medicalRejectionReportForm.value.summaryCriteria != null) {
      path += `summaryCriteria=${this.medicalRejectionReportForm.value.summaryCriteria}&`;
    }
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  get formCn() { return this.medicalRejectionReportForm.controls; }

  download() {

  }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.medicalRejectionReportForm.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.medicalRejectionReportForm.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }

  search() {
    this.submitted = true;

    if (this.medicalRejectionReportForm.invalid)
      return
  }
}
