import { PhysiciansComponent } from './../physicians/physicians.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SinglePhysician } from 'src/app/models/nphies/SinglePhysicianModel';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';

@Component({
  selector: 'app-add-physician-dialog',
  templateUrl: './add-physician-dialog.component.html',
  styles: []
})
export class AddPhysicianDialogComponent implements OnInit {


  singelPhysician: SinglePhysician;



  constructor(
    private dialogRef: MatDialogRef<AddPhysicianDialogComponent>,

  ) { }

  ngOnInit() {



  }



  closeDialog() {
    this.dialogRef.close();
  }

}
