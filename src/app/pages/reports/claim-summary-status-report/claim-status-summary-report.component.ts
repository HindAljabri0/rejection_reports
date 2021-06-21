import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-claim-status-summary-report',
  templateUrl: './claim-status-summary-report.component.html',
  styleUrls: ['./claim-status-summary-report.component.css']
})
export class ClaimStatusSummaryReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  claimStatusSummaryForm: FormGroup;
  submitted: boolean = false;
  errorMessage: string;
  detailTopActionIcon = 'ic-download.svg';
  constructor(private commen: SharedServices, private formBuilder: FormBuilder) { }
  criterias: { id: number, name: string }[] = [
    { id: 1, name: 'Upload Date' },
    { id: 2, name: 'Claim Date' },
  ];
  ngOnInit() {
    this.payers = [];
    const allPayersIds = [];
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });
    this.payers.push({
      id: allPayersIds,
      name: 'All'
    });
    this.formLoad();
  }

  formLoad() {
    this.claimStatusSummaryForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      criteria: ['', Validators.required],
    });
  }
  search() {
    this.submitted = true;
  }
  get formCn() { return this.claimStatusSummaryForm.controls; }
  backButton() {

  }

  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }
  }
}
