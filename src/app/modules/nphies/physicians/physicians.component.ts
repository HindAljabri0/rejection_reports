

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Physicians } from 'src/app/models/nphies/physicians';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';

import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddPhysicianDialogComponent } from '../add-physician-dialog/add-physician-dialog.component';
import { UploadPhysiciansDialogComponent } from '../upload-physicians-dialog/upload-physicians-dialog.component';

@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styles: []
})
export class PhysiciansComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private sharedServices: SharedServices,
    private nphiesConfigurationsService: NphiesConfigurationService,
    private providerNphiesSearchService: ProviderNphiesSearchService) { }

    physiciansmodel: Physicians[];

  ngOnInit() {
    this.nphiesConfigurationsService.getPhysicianList(this.sharedServices.providerId).subscribe(data => {
      if (data instanceof HttpResponse ) {
        this.physiciansmodel=[];

        this.physiciansmodel = data.body["content"] as Physicians[];

      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.message)
      }
    });
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

}
