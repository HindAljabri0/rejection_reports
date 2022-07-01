import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
    private dialog: MatDialog, private tawuniyaGssService : TawuniyaGssService
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
      })
    })
    
  }

}
