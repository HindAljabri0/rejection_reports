import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SearchDiscountReconciliationReport } from 'src/app/models/reconciliationReport';
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service'
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchDiscountReconciliationReportResponse } from 'src/app/models/reconciliationReportResponse'
import { AddDiscountReconciliationReport } from 'src/app/models/reconciliationReport'
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './add-reconciliation-dialog.component.html',
  styles: []
})
export class AddReconciliationDialogComponent implements OnInit {

  status: boolean = false;
  searchComplete = true;
  searchDiscountReconciliationReport = new SearchDiscountReconciliationReport();
  selectedPayerId = 'All';
  payersList: { id: string[] | string, name: string }[];
  selectedPayerName = 'All';
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  searchDiscountReconciliationReportResponse: SearchDiscountReconciliationReportResponse;
  AddDiscountReconciliationReport = new AddDiscountReconciliationReport();
  isSubmitted: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddReconciliationDialogComponent>,
    private reconciliationService: ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private routeActive: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) { }

  FormAddReconciliation: FormGroup = this.formBuilder.group({
    payerId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    volumeDiscount: [''],
    promptDiscount: ['']
  });

  ngOnInit() {
    this.status = false;
    this.payersList = [];
    const allPayersIds = [];
    this.sharedService.getPayersList().map(value => {
      this.payersList.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });
    this.payersList.push({
      id: allPayersIds,
      name: 'All'
    });
    this.FormAddReconciliation.controls.startDate.setValue(new Date());
    this.FormAddReconciliation.controls.endDate.setValue(new Date());
  }

  closeDialog(status: boolean = false) {
    this.status = status;
    this.dialogRef.close();
  }

  search() {
    this.isSubmitted = true;
    if (this.FormAddReconciliation.valid) {

      this.sharedService.loadingChanged.next(true);
      this.reconciliationService.getSearchAddReconciliation(
        this.sharedService.providerId,
        this.FormAddReconciliation.controls.payerId.value,
        this.datePipe.transform(this.FormAddReconciliation.controls.startDate.value, 'dd-MM-yyyy'),
        this.datePipe.transform(this.FormAddReconciliation.controls.endDate.value, 'dd-MM-yyyy'),
      ).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            this.searchDiscountReconciliationReportResponse = event.body as SearchDiscountReconciliationReportResponse;

            console.log(this.searchDiscountReconciliationReportResponse.duration);
          }
          this.sharedService.loadingChanged.next(false);
        }
      }, err => {
        this.sharedService.loadingChanged.next(false);
        console.log(err);

      });

    }
  }

  addDiscount() {
    let data: AddDiscountReconciliationReport = {
      promptDiscount: this.FormAddReconciliation.controls.promptDiscount.value,
      volumeDiscount: this.FormAddReconciliation.controls.volumeDiscount.value,
      startDate: this.datePipe.transform(this.FormAddReconciliation.controls.startDate.value, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.FormAddReconciliation.controls.endDate.value, 'yyyy-MM-dd'),
      payerId: this.FormAddReconciliation.controls.payerId.value
    };
    console.log(data.startDate)
    console.log(data.endDate)
    this.reconciliationService.getAddDiscount(
      this.sharedService.providerId, data
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event, "event response");

        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.status = true;
          this.closeDialog(true);
          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData('', err.error, true));
        this.status = false;
      }
    });
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.FormAddReconciliation.controls.startDate.value).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.FormAddReconciliation.controls.startDate.setValue('');
      }
    }
  }

}
