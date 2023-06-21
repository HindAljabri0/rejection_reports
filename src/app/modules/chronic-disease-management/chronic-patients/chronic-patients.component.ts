import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ChronicPatientDetailsComponent } from '../chronic-patient-details/chronic-patient-details.component';
import { SharedServices } from 'src/app/services/shared.services';
import { CdmService } from 'src/app/services/cdmService/cdm.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-chronic-patients',
  templateUrl: './chronic-patients.component.html',
  styles: []
})
export class ChronicPatientsComponent implements OnInit {
  cdmForm: FormGroup = this.formBuilder.group({
    policyNumber: [''],
    city: [''],
    region: [''],
    diagnosis: [''],
    memberId: ['']
  });
  policyError: string;
  cityError: string;
  regionError: string;
  diagnosisError: string;
  thereIsError: boolean = false;

  Regions: { Code: string, Name: string }[] = [
    { Code: 'east', Name: 'East' },
    { Code: 'west', Name: 'West' },
    { Code: 'south', Name: 'South' },
    { Code: 'center', Name: 'Center' },
    { Code: 'north', Name: 'North' }
  ];
  Cities: { Code: string, Name: string }[] = [
    { Code: 'Ar Rass', Name: 'Ar Rass' },
    { Code: 'Arar', Name: 'Arar' },
    { Code: 'Bisha', Name: 'Bisha' },
    { Code: 'Dammam', Name: 'Dammam' },
    { Code: 'Riyadh', Name: 'Riyadh' }
  ];

  Diagnosis: { Codes: string[], Name: string }[] = [
    { Codes: ['G20.0', ' U80.1'], Name: 'hypertension' },
    { Codes: ['G20.7', ' U80.1'], Name: 'Thyroiditis' },
    { Codes: ['G20.9', ' U80.1'], Name: "Parkinson's disease" },
    { Codes: ['E78.2'], Name: 'Mixed hyperlipidaemia' },
  ];
  patientList: any;
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  diagnosis: any;

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private cdmService: CdmService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
  }
  searchByCriteria() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.getData();
  }
  handlePageEvent(data: PageEvent) {
    this.length = data.length;
    this.pageSize = data.pageSize;
    this.pageIndex = data.pageIndex;
    localStorage.setItem('pagesize', data.pageSize + '');
    this.getData();
  }
  showDiagnosisList(patientId) {
    let currentRow = this.patientList.filter(f => f.patientId === patientId)[0];
    this.diagnosis = currentRow.diagnosis;
    console.log(JSON.stringify(this.diagnosis));
  }
  getData() {
    const model: any = {};
    this.thereIsError=false;
    this.policyError=null;
    this.cityError=null;
    this.regionError=null;
    this.diagnosisError =null;

    if (this.cdmForm.controls.policyNumber.value) {
      model.policyNumber = this.cdmForm.controls.policyNumber.value;
    } else {
      this.policyError = 'Please fill policy number';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.city.value) {
      model.city = this.cdmForm.controls.city.value;
    } else {
      this.cityError = 'Please select city';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.region.value) {
      model.region = this.cdmForm.controls.region.value;
    } else {
      this.regionError = 'Please select region';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.diagnosis.value) {
      model.diagnosis = this.cdmForm.controls.diagnosis.value;
    } else {
      this.diagnosisError = 'Please select diagnosis';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.memberId.value) {
      model.memberId = this.cdmForm.controls.memberId.value;
    }
    if (!this.thereIsError) {
      this.cdmService.getPatientList(this.sharedServices.providerId, model, this.pageIndex, this.pageSize).subscribe(event => {
        if (event instanceof HttpResponse) {
          console.log(event.body);
          if (event.body != null)
            this.patientList = event.body["patients"];
          this.length = event.body["totalElements"];
          //this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)
            this.patientList = null;
          }
        });
    }
  }
  openChronicPatientDetails(_patientId) {
    const dialogRef = this.dialog.open(ChronicPatientDetailsComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false,
      data:{patientId:_patientId}
    });
  }

}
