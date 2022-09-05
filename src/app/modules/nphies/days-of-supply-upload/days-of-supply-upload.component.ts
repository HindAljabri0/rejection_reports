import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { daysSupplyModel } from 'src/app/models/daysSupplyModel';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { MedicationDaysUploadComponent } from '../medication-days-upload/medication-days-upload.component';

@Component({
  selector: 'app-days-of-supply-upload',
  templateUrl: './days-of-supply-upload.component.html',
  styleUrls: []
})
export class DaysOfSupplyUploadComponent implements OnInit {
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  FormList: FormGroup = this.formBuilder.group({
    uploadFromDate: [''],
    uploadToDate: ['']
  });

  isSubmitted = false;

  daysSupplyListModel: PaginatedResult<daysSupplyModel>;
  Lists = [];
  constructor(private formBuilder: FormBuilder, 
    private sharedService: SharedServices, 
    private dialogService: DialogService,
    private dialog: MatDialog,
    private nphiesConfigurationService: NphiesConfigurationService) { }

  ngOnInit() {
    this.search();
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSubmit();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatorLength() {
    if (this.daysSupplyListModel != null) {
      return this.daysSupplyListModel.totalElements;
    } else {
      return 0;
    }
  }
  updateFromDate(){
    this.FormList.controls.uploadToDate.setValue('');
  }
  downloadSample() {
    this.sharedService.loadingChanged.next(true);
    this.nphiesConfigurationService.downloadSampleDaysOfSupply(this.sharedService.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          const data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
          FileSaver.saveAs(data, 'DaysOfSupplySample.xlsx');
        }
      }
      this.sharedService.loadingChanged.next(false);
    }, err => {
      this.sharedService.loadingChanged.next(false);
      if (err instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: `Unable to download File at this moment`,
          isError: true
        });
      }
    });
  }

  search() {
    this.page = 0;
    this.pageSize = 10;
    this.onSubmit();
  }
  openUploadlistDialog() {
    const dialogRef = this.dialog.open(MedicationDaysUploadComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.FormPriceList.patchValue({
        //   payerNphiesId: result,
        //   effectiveDate: '',
        //   uploadFromDate: '',
        //   uploadToDate: ''
        // });
        this.onSubmit();
      }
    });
  }
  DeleteSingleRow(Id : number){

  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.FormList.valid) {
      this.sharedService.loadingChanged.next(true);
      const model: any = {};

      /*if (this.FormPriceList.controls.uploadFromDate.value) {
        model.uploadFromDate = this.datePipe.transform(this.FormPriceList.controls.uploadFromDate.value, 'yyyy-MM-dd');
      }*/
      //this.editURL(model.fromDate, model.toDate);
      this.nphiesConfigurationService.getMedicationList(this.sharedService.providerId, this.page,this.pageSize).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          console.log("body = "+JSON.stringify(body));
          // this.transactions = body;
          this.daysSupplyListModel = new PaginatedResult(body, daysSupplyModel);
          this.Lists = this.daysSupplyListModel.content;
          
          if (this.paginator) {
            const pages = Math.ceil((this.daysSupplyListModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.daysSupplyListModel.number;
            this.paginator.pageIndex = this.daysSupplyListModel.number;
            this.paginator.pageSize = this.daysSupplyListModel.size;
          }
          this.sharedService.loadingChanged.next(false);
        }
      }, err => {
        this.sharedService.loadingChanged.next(false);
        console.log(err);
      });

    }
  }

}
