import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SearchDiscountReconciliationReport } from 'src/app/models/reconciliationReport';
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service'
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { SearchDiscountReconciliationReportResponse } from 'src/app/models/reconciliationReportResponse'
import { AddDiscountReconciliationReport } from 'src/app/models/reconciliationReport'
import * as moment from 'moment';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
@Component({
  selector: 'app-reconciliation',
  templateUrl: './add-reconciliation-dialog.component.html',
  styles: []
})
export class AddReconciliationDialogComponent implements OnInit {
  status: boolean = false;
  searchComplete = true;
  searchDiscountReconciliationReport = new SearchDiscountReconciliationReport();
  startDateController: FormControl = new FormControl();
  endDateController: FormControl = new FormControl();
  payerIdControl: FormControl = new FormControl();
  promptDiscountControl: FormControl = new FormControl();
  volumeDiscountCotrol: FormControl = new FormControl();
  selectedPayerId = 'All';
  payersList: { id: string[] | string, name: string }[];
  selectedPayerName = 'All';
  searchDiscountReconciliationReportResponse: SearchDiscountReconciliationReportResponse;

  AddDiscountReconciliationReport = new AddDiscountReconciliationReport();





  constructor(
    private dialogRef: MatDialogRef<AddReconciliationDialogComponent>,
    private reconciliationService: ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private routeActive: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private dialogService: DialogService,



  ) { }

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
    this.routeActive.queryParams.subscribe(params => {
      if (params.payer != undefined) {
        if (params.payer instanceof Array && params.payer.length > 1) {
          this.payerIdControl.setValue(allPayersIds);
        } else {
          this.payerIdControl.setValue(params.payer);
        }
      }
      if (params.startDate != null) {
        this.searchDiscountReconciliationReport.startDate = params.startDate;
      }
      if (params.endDate != null) {
        this.searchDiscountReconciliationReport.endDate = params.endDate;
      }
      this.startDateController.setValue(new Date());
      this.endDateController.setValue(new Date());

    });
  }

  closeDialog(status: boolean = false) {
    this.status = status;
    this.dialogRef.close();
  }

  search() {
    if (this.searchDiscountReconciliationReport.startDate == null || this.searchDiscountReconciliationReport.startDate == undefined && this.searchDiscountReconciliationReport.endDate == null || this.searchDiscountReconciliationReport == undefined)
      return
    this.editURL(this.searchDiscountReconciliationReport.startDate, this.searchDiscountReconciliationReport.endDate);
    this.reconciliationService.getSearchAddReconciliation(
      this.sharedService.providerId,
      this.payerIdControl.value,
      this.datePipe.transform(this.startDateController.value, 'dd-MM-yyyy'),
      this.datePipe.transform(this.endDateController.value, 'dd-MM-yyyy'),
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.searchDiscountReconciliationReportResponse = event.body as SearchDiscountReconciliationReportResponse;

          console.log(this.searchDiscountReconciliationReportResponse.duration);
        }
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);

    });
  }
  editURL(startDate?: string, endDate?: string) {
    let path = `/reconciliationService/reconciliation.service?`;

    if (this.payerIdControl.value != null) {
      path += `payer=${this.payerIdControl.value}&`;
    }
    if (this.startDateController.value != null) {
      path += `from=${this.startDateController.value}&`;
    }
    if (this.endDateController.value != null) {
      path += `to=${this.endDateController.value}&`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  addDiscount() {
    let data: AddDiscountReconciliationReport = {
      promptDiscount: this.promptDiscountControl.value,
      volumeDiscount: this.volumeDiscountCotrol.value,
      startDate: this.datePipe.transform(this.startDateController.value, 'dd-MM-yyyy'),
      endDate: this.datePipe.transform(this.endDateController.value, 'dd-MM-yyyy'),
      payerId: this.payerIdControl.value
    };
    this.reconciliationService.getAddDiscount(
      this.sharedService.providerId, data
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
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

}