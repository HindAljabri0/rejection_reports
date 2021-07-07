import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BatchSummaryModel } from 'src/app/models/batchSummary';
import { BatchSummary } from 'src/app/models/batchSummaryModel';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddBatchDialogComponent } from '../add-batch-dialog/add-batch-dialog.component';
@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styles: []
})
export class CreateBatchComponent implements OnInit {
  payersList: { id: number, name: string, arName: string }[] = [];
  batchSummary: BatchSummary = new BatchSummary();
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  minDate: any;
  allCheckBoxIsChecked: boolean;
  allCheckBoxIsIndeterminate: boolean;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  totalElements: number;
  paginatorPagesNumbers: number[];
  batchModel: PaginatedResult<BatchSummaryModel>;
  batchData: any[] = [];
  constructor(public dialog: MatDialog, private sharedService: SharedServices, private claimService: ClaimService, private dialogService: DialogService, private location: Location, private routeActive: ActivatedRoute) {
    this.batchSummary.page = 0;
    this.batchSummary.pageSize = 10;
  }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
    this.routeActive.queryParams.subscribe(params => {
      if (params.startDate != null) {
        const startDate = moment(params.startDate, 'YYYY-MM-DD').toDate();
        this.batchSummary.startDate = startDate;
      }
      if (params.endDate != null) {
        const endDate = moment(params.endDate, 'YYYY-MM-DD').toDate();
        this.batchSummary.endDate = endDate;
      }
      if (params.payerId != null) {
        this.batchSummary.payerId = params.payerId === '0' ? '0' : parseInt(params.payerId);
      }
      if (params.page != null) {
        this.batchSummary.page = params.page;
      }
      if (params.pageSize != null) {
        this.batchSummary.pageSize = params.pageSize;
      }
      if (params.startDate != null && params.endDate != null) {
        this.getBatchData();
      }
    });
  }

  getBatchData() {
    this.sharedService.loadingChanged.next(true);
    const startDate = moment(this.batchSummary.startDate).format('YYYY-MM-DD');
    const endDate = moment(this.batchSummary.endDate).format('YYYY-MM-DD');
    const obj = {
      startDate: startDate,
      endDate: endDate,
      payerId: this.batchSummary.payerId,
      page: this.batchSummary.page,
      size: this.batchSummary.pageSize
    }
    this.editURL(startDate, endDate);
    this.sharedService.loadingChanged.next(true);
    this.claimService.batchSummary(this.sharedService.providerId, obj).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = JSON.parse(event['body']);
        const pages = Math.ceil((body.totalElements / this.paginator.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.batchModel = new PaginatedResult(body, BatchSummaryModel);
        this.batchData = this.batchModel.content;

        this.paginator.pageIndex = this.batchModel.number;
        this.paginator.pageSize = this.batchModel.size;
      }
      this.sharedService.loadingChanged.next(false);
    }, err => {
      this.sharedService.loadingChanged.next(false);
      this.batchData = [];
      this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
      console.log(err);
    });

  }

  submit() {
    this.batchSummary.pageSize = 10;
    this.batchSummary.page = 0;
    this.getBatchData();
  }

  openAddBatchDialog() {
    const dialogRef = this.dialog.open(AddBatchDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm']
      });
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.batchSummary.endDate).format('YYYY-MM-DD');
      if (startDate > endDate)
        this.batchSummary.endDate = '';
    }
    this.minDate = new Date(event);

  }
  selectAllinPage(event) {
    this.allCheckBoxIsChecked = event.checked;
    console.log(event);

  }

  editURL(startDate?: string, endDate?: string) {
    let path = '/collection-management/create-batch?';

    if (startDate != null) {
      path += `startDate=${startDate}&`;
    }
    if (endDate != null) {
      path += `endDate=${endDate}&`;
    }
    if (this.batchSummary.payerId != null) {
      path += `payerId=${this.batchSummary.payerId}&`;
    }
    if (this.batchSummary.page != null) {
      path += `page=${this.batchSummary.page}&`;
    }
    if (this.batchSummary.pageSize != null) {
      path += `pageSize=${this.batchSummary.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 2);
    }
    this.location.go(path);
  }

  paginatorAction(event) {
    // this.manualPage = event['pageIndex'];
    this.batchSummary.page = event.pageIndex;
    this.batchSummary.pageSize = event.pageSize;
    this.getBatchData();
  }

  get paginatorLength() {
    if (this.batchModel != null) {
      return this.batchModel.totalElements;
    } else {
      return 0;
    }
  }
}
