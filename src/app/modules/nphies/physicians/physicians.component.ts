import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NphiesConfigurationsSearchService } from 'src/app/services/nphiesConfigurationsService/nphies-configurations-service';
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
    nphiesConfigurationsSearchService:NphiesConfigurationsSearchService ,
    private providerNphiesSearchService: ProviderNphiesSearchService ) { }

  ngOnInit() {
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
