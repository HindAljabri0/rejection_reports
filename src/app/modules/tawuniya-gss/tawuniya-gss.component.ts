import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';

@Component({
  selector: 'app-tawuniya-gss',
  templateUrl: './tawuniya-gss.component.html',
  styles: []
})
export class TawuniyaGssComponent implements OnInit {

  initiateModel : Array<InitiateResponse> = [];
  constructor(
    private dialog: MatDialog, private tawuniyaGssService : TawuniyaGssService, private store : Store
  ) { }

  ngOnInit() {
  }

  openGenerateReportDialog() {
    const dialogRef = this.dialog.open(TawuniyaGssGenerateReportDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm']
    })
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      this.tawuniyaGssService.generateReportInitiate(data).subscribe( (data : InitiateResponse) => {
        console.log(data);
        this.initiateModel.push(data);
        return this.store.dispatch(showSnackBarMessage({ message: 'Tawuniya Report Initiated Successfully!' }));
      }, err => {
        console.log(err);
        return this.store.dispatch(showSnackBarMessage({ message: err.error.error_description }));
      })
    })
    
  }

}
