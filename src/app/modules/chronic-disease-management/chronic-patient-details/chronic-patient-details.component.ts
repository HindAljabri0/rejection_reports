import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { forEach } from 'jszip';
import { CdmService } from 'src/app/services/cdmService/cdm.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-chronic-patient-details',
  templateUrl: './chronic-patient-details.component.html',
  styles: []
})
export class ChronicPatientDetailsComponent implements OnInit {
 
  currentDetailsOpen = -1;
  dataModel:any=null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ChronicPatientDetailsComponent>,
    private cdmService:CdmService,
    private sharedServices:SharedServices
  ) { }

  ngOnInit() {
    //console.log("data = "+JSON.stringify(this.data));
    this.getData();
  }
  getData() {
    let model:any = {};
    model.policyNumber = this.data.policyNumber;
    model.region = this.data.ResionCode != null ?this.data.ResionCode : '0';
    model.diagnosis = this.data.diagnosis.map(p=> p.diagnosisCode);
    model.memberCode=this.data.memberCode;
    console.log("model = "+JSON.stringify(model));
    this.cdmService.getPatientApproval(this.sharedServices.providerId, model).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null)
          this.dataModel = event.body;
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)
          this.dataModel = null;
        }
      });
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

  toggleRow(index) {
    this.currentDetailsOpen = (this.currentDetailsOpen == index) ? -1 : index;
  }

}
