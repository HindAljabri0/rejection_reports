import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { SelectServiceDialogData } from './select-service-dialog-data';
import { Service } from '../../models/service.model';
import { getRetreivedServices } from '../../store/claim.reducer';

@Component({
  selector: 'app-select-service-dialog',
  templateUrl: './select-service-dialog.component.html',
  styleUrls: ['./select-service-dialog.component.css']
})
export class SelectServiceDialogComponent implements OnInit {

  isSelectingOne:boolean;

  retreivedServices:Service[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data:SelectServiceDialogData,
    private store:Store
  ) { }

  ngOnInit() {
    this.isSelectingOne = this.data.serviceIndex != -1;

    this.store.select(getRetreivedServices).subscribe(services => this.retreivedServices = services);
  }

}
