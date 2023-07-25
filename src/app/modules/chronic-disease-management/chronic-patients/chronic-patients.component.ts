import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ChronicPatientDetailsComponent } from '../chronic-patient-details/chronic-patient-details.component';
import { SharedServices } from 'src/app/services/shared.services';
import { CdmService } from 'src/app/services/cdmService/cdm.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { F } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-chronic-patients',
  templateUrl: './chronic-patients.component.html',
  styles: []
})
export class ChronicPatientsComponent implements OnInit {
  cdmForm: FormGroup = this.formBuilder.group({
    policyNumber: [''],
    //city: [''],
    region: [''],
    diagnosis: [''],
    memberId: ['']
  });
  policyError: string;
  cityError: string;
  regionError: string;
  diagnosisError: string;
  thereIsError: boolean = false;
  detailTopActionIcon: string;

  regions: { regionCode: string, regionDescription: string }[] = [];
  Cities: { Code: string, Region: string, Name: string }[] = this.sharedData.Cities;
  filterdCities: { Code: string, Region: string, Name: string }[];
  selectedRegion = '';
  diagnosisList = [];
  //{ Codes: string[], Name: string }[]
  patientList: any;
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  diagnosis: any;

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private sharedData: SharedDataService,
    private cdmService: CdmService,
    private downloadService: DownloadService,
    private settingService: SettingsService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchDiagnosis();
    this.fetchRegions();
  }

  fetchDiagnosis() {
    this.cdmService.getDiagnosisList().subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null)
          this.diagnosisList = event.body["diagnosis"] as { diagnosisCode: string, diagnosisDescription: string }[];
        //this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)
          this.diagnosisList = null;
        }
      });
  }
  fetchRegions() {
    this.cdmService.getRegionsList().subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log(event.body);
        if (event.body != null)
          this.regions = event.body["regions"] as { regionCode: string, regionDescription: string }[];
        //this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)
          this.regions = null;
        }
      });
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
  /*
  (selectionChange)="selectedRegion = $event.value;filterCities()"
  filterCities() {
    console.log("Selected Region = " + this.selectedRegion);
    this.filterdCities = this.Cities.filter(f => f.Region === this.selectedRegion);
  }*/
  getData() {
    const model: any = {};
    this.thereIsError = false;
    this.policyError = null;
    this.cityError = null;
    this.regionError = null;
    this.diagnosisError = null;

    if (this.cdmForm.controls.policyNumber.value) {
      model.policyNumber = this.cdmForm.controls.policyNumber.value;
    } else {
      this.policyError = 'Please fill policy number';
      this.thereIsError = true;
    }
    /*if (this.cdmForm.controls.city.value) {
      model.city = this.cdmForm.controls.city.value;
    } else {
      model.city = null;
    }*/
    if (this.cdmForm.controls.region.value) {
      model.region = this.cdmForm.controls.region.value;
    } else {
      this.regionError = 'Please select region';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.diagnosis.value) {
      //model.diagnosis = this.cdmForm.controls.diagnosis.value;
      //model.diagnosis = JSON.parse(model.diagnosis);
      model.diagnosis = Array.from(this.cdmForm.controls.diagnosis.value);
    } else {
      this.diagnosisError = 'Please select diagnosis';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.memberId.value) {
      model.memberId = this.cdmForm.controls.memberId.value;
    }
    if (!this.thereIsError) {
      this.sharedServices.loadingChanged.next(true);
      this.cdmService.getPatientList(this.sharedServices.providerId, model, this.pageIndex, this.pageSize).subscribe(event => {
        if (event instanceof HttpResponse) {
          //console.log(event.body);
          if (event.body != null)
            this.patientList = event.body["patients"];
          this.length = event.body["totalElements"];
          this.sharedServices.loadingChanged.next(false);
          //this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)
            this.patientList = null;
            this.sharedServices.loadingChanged.next(false);
          }
        });
    }
  }
  openChronicPatientDetails(_patientId) {
    let row={};
    if(this.patientList !=null){
      row=this.patientList.filter(f => f.patientId == _patientId)[0];
    }
    const dialogRef = this.dialog.open(ChronicPatientDetailsComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false,
      data: row
    });
  }
  async downloadSheetFormat() {
    const model: any = {};
    this.thereIsError = false;
    this.policyError = null;
    this.cityError = null;
    this.regionError = null;
    this.diagnosisError = null;
    let event;

    if (this.cdmForm.controls.policyNumber.value) {
      model.policyNumber = this.cdmForm.controls.policyNumber.value;
    } else {
      this.policyError = 'Please fill policy number';
      this.thereIsError = true;
    }
    /*if (this.cdmForm.controls.city.value) {
      model.city = this.cdmForm.controls.city.value;
    } else {
      model.city = null;
    }*/
    if (this.cdmForm.controls.region.value) {
      model.region = this.cdmForm.controls.region.value;
    } else {
      this.regionError = 'Please select region';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.diagnosis.value) {
      model.diagnosis = this.cdmForm.controls.diagnosis.value;
      model.diagnosis = JSON.parse(model.diagnosis);
      //odel.diagnosis = model.diagnosis.split(',');
    } else {
      this.diagnosisError = 'Please select diagnosis';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.memberId.value) {
      model.memberId = this.cdmForm.controls.memberId.value;
    }
    if (!this.thereIsError) {
      event = this.cdmService.downloadExcelsheet(this.sharedServices.providerId, model);
      if (event != null) {
        this.downloadService.startGeneratingDownloadFile(event)
          .subscribe(status => {
            if (status !== DownloadStatus.ERROR) {
              this.detailTopActionIcon = 'ic-check-circle.svg';
            } else {
              this.detailTopActionIcon = 'ic-download.svg';
            }
          });
      }
    }
  }
}
