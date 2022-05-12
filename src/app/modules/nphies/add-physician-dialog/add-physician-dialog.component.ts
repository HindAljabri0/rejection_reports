import { PhysiciansComponent } from './../physicians/physicians.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SinglePhysician } from 'src/app/models/nphies/SinglePhysicianModel';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-add-physician-dialog',
  templateUrl: './add-physician-dialog.component.html',
  styles: []
})
export class AddPhysicianDialogComponent implements OnInit {


  singelPhysician: SinglePhysician = {};
  physicianId = "";
  physicianName = "";


  physicianIdController: FormControl = new FormControl();
  physicianNameController: FormControl = new FormControl();
  specialtyCodeController: FormControl = new FormControl();
  physicianRoleController: FormControl = new FormControl();

  setSingelphsicininformationService() {
    this.singelPhysician.physicianId = this.physicianIdController.value;
    this.singelPhysician.physicianName = this.physicianNameController.value;
    this.singelPhysician.physicianRole = this.physicianRoleController.value;
    this.singelPhysician.specialityCode=this.specialtyCodeController.value;
  }

  constructor(
    private dialogRef: MatDialogRef<AddPhysicianDialogComponent>,
    private common: SharedServices,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService,

  ) { }

  ngOnInit() {
  }

  addPhysician() {
    this.common.loadingChanged.next(true);
    this.setSingelphsicininformationService();
    this.nphiesConfigurationService.addSinglePhysician(this.common.providerId, this.singelPhysician).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: `Physician added successfully`,
          isError: false
        }).subscribe(event => { window.location.reload(); });
        this.common.loadingChanged.next(false);
      }

    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.common.loadingChanged.next(false);
        if (error.status === 500) {
          this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
        }

      }

    });
    this.common.loadingChanged.next(false);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
