import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Physicians } from 'src/app/models/nphies/physicians';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddPhysicianDialogComponent } from '../add-physician-dialog/add-physician-dialog.component';
import { UploadPhysiciansDialogComponent } from '../upload-physicians-dialog/upload-physicians-dialog.component';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';


@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styles: []
})
export class PhysiciansComponent implements OnInit {

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  physiciansList: Physicians[];
  specialityList = [];

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private nphiesConfigurationsService: NphiesConfigurationService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getSpecialityList();
  }

  getSpecialityList() {
    this.providerNphiesSearchService.getSpecialityList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body as [];
        this.getData();
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });
  }

  handlePageEvent(data: PageEvent) {
    this.length = data.length;
    this.pageSize = data.pageSize;
    this.pageIndex = data.pageIndex;
    localStorage.setItem('pagesize', data.pageSize + '');
    this.getData();
  }

  openUploadPhysiciansDialog() {
    const dialogRef = this.dialog.open(UploadPhysiciansDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    });
  }

  openAddPhysicianDialog(physicianData: any = null) {
    const dialogRef = this.dialog.open(AddPhysicianDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],
      autoFocus: false,
      data: {
        physician: physicianData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.getData();
      }
    });
  }

  getData() {
    this.sharedServices.loadingChanged.next(true);
    this.nphiesConfigurationsService.getPhysicianList(this.sharedServices.providerId, this.pageIndex, this.pageSize).subscribe(data => {
      if (data instanceof HttpResponse) {
        const body: any = data.body;
        this.physiciansList = body["content"] as Physicians[];
        this.physiciansList.map(x => {
          // tslint:disable-next-line:max-line-length
          x.specialityName = this.specialityList.filter(y => y.speciallityCode === x.speciality_code)[0] ? this.specialityList.filter(y => y.speciallityCode === x.speciality_code)[0].speciallityName : '';
        });
        this.length = body["totalElements"];
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.message)
      }
    });
  }

  DownloadPhysicianSample() {
    this.nphiesConfigurationsService.downloadPhysicianList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          var data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
          FileSaver.saveAs(data, "SamplePhyscianDownload.xlsx");
        }
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err)
          this.dialogService.openMessageDialog({
            title: '',
            message: `Unable to download File at this moment`,
            isError: true
          });
        }
      });
  }

  DeletePhysician(physicianId) {
    this.sharedServices.loadingChanged.next(false);
    this.nphiesConfigurationsService.deletePhysician(this.sharedServices.providerId, physicianId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // tslint:disable-next-line:max-line-length
          this.dialogService.showMessage('Success:', body.message, 'success', true, 'OK');
          this.getData();
        }
        this.sharedServices.loadingChanged.next(false);
      }

    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        if (error.status === 500) {
          this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
        }
      }
    });
  }

}
