import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-rejection-comparison-report',
  templateUrl: './rejection-comparison-report.component.html',
  styles: []
})
export class RejectionComparisonReportComponent implements OnInit {
  check=false;
  selectedPayerId = 'All';
  selectedCategory: 'Doctor' | 'Department' | 'ServiceCode' | 'ServiceType' | 'Payers' = 'Payers';
  selectedPayerName = 'All';
  payersList: { id: number, name: string, arName: string }[] = [];
  fromDateControl = '';
  fromDateError: string;
  toDateControl = '';
  toDateError: string;
  error: string;
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  tempPieChartData: any = [];

  selectedDoctor = -1;
  servicePerDoctorData: any[] = [];
  tempPieChartLables: Label[] = [];
  minDate: any;
  constructor(    private sharedService: SharedServices,) { }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
  }

  onPayerChanged() {
    if (this.selectedPayerId != 'All' && this.selectedCategory == 'Payers') {
        this.selectedCategory = 'ServiceCode';
    }
    this.selectedPayerName = this.selectedPayerId == 'All'
        ? 'All'
        : this.payersList.find(payer => payer.id == Number.parseInt(this.selectedPayerId, 10)).name;
}
dateValidation(event: any) {
  if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.fromDateControl).format('YYYY-MM-DD');
      if (startDate > endDate) {
          this.toDateControl = '';
      }
  }
  this.minDate = new Date(event);
  this.minDate = new Date(this.minDate.setMonth(this.minDate.getMonth() + 1));
}

onOpenCalendar(container) {
  container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
  };
  container.setViewMode('month');
}



}
