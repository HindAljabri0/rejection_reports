

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Physicians } from 'src/app/models/nphies/physicians';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddPhysicianDialogComponent } from '../add-physician-dialog/add-physician-dialog.component';
import { UploadPhysiciansDialogComponent } from '../upload-physicians-dialog/upload-physicians-dialog.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';


@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styles: []
})
export class PhysiciansComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private sharedServices: SharedServices,
    private nphiesConfigurationsService: NphiesConfigurationService, private dialogService: DialogService) { }

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  physiciansList: Physicians[];



  ngOnInit() {
    this.getData();
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
  openAddPhysicianDialog() {
    const dialogRef = this.dialog.open(AddPhysicianDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],

      autoFocus: false

    });
  }
  getData() {
    this.nphiesConfigurationsService.getPhysicianList(this.sharedServices.providerId, this.pageIndex, this.pageSize).subscribe(data => {
      if (data instanceof HttpResponse) {
        if (data.body != null && data.body instanceof Array)
          this.physiciansList = [];

        this.physiciansList = data.body["content"] as Physicians[];
        this.length = data.body["totalElements"];

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





}
