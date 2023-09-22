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
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { getProviderId } from '../../claim-review/store/claimReview.reducer';

@Component({
  selector: 'app-chronic-patients',
  templateUrl: './chronic-patients.component.html',
  styles: []
})
export class ChronicPatientsComponent implements OnInit {
  cdmForm: FormGroup = this.formBuilder.group({
    policyNumber: [''],
    region: [''],
    diagnosis: [''],
    memberId: ['']
  });
  
  policyError: string;
  cityError: string;
  regionError: string;
  diagnosisError: string;
  thereIsError: boolean = false;
  detailTopActionIcon: string="ic-download.svg";

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
  policyNames: string[] = [];
  diagnosisNames: string[] = [];
  regionNames: string[] = [];
  regionCodes: string[] = [];
 diagnosisCodes: string[] = [];
  policyNumber: any; 
  validationFlag: boolean;
  

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private sharedData: SharedDataService,
    private cdmService: CdmService,
    private superAdmin: SuperAdminService,
    private downloadService: DownloadService,
    private settingService: SettingsService,
    private formBuilder: FormBuilder
  ) { }
    ngOnInit() {
      this.superAdmin.getList(this.sharedServices.providerId).subscribe((data: any) => {
        if (data && data.body) { 
         if (data.body.diagnosisData && Array.isArray(data.body.diagnosisData)) {
            this.diagnosisNames = data.body.diagnosisData.map(diagnosisData => diagnosisData.diagnosisDescription);
            this.diagnosisCodes = data.body.diagnosisData.map(diagnosisData => diagnosisData.diagnosis);
          } else {
            this.diagnosisNames = [];
          }
      
          if (data.body.regionData && Array.isArray(data.body.regionData)) {
            this.regionNames = data.body.regionData.map(regionData => regionData.regionDescription);
            this.regionCodes = data.body.regionData.map(regionData => regionData.region);
          } else {
            this.regionNames = [];
        }
        if (data.body.policyData && Array.isArray(data.body.policyData)) {
          this.policyNames = data.body.policyData.map(policyData => policyData.policyNumber);
         
        } else {
          this.policyNames = [];
      }
      }
    });
    
 }
 validatePolicyNumber() {
  if (this.cdmForm.controls.policyNumber.value) {
    const exists = this.policyNames.includes(this.cdmForm.controls.policyNumber.value);

    if (exists) {
      this.validationFlag = false;
    } else {
      this.validationFlag = true;

    }
  }
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
    //console.log(JSON.stringify(this.diagnosis));
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
    if (this.cdmForm.controls.region.value) {
      // Use the stored region code value
      model.region = this.regionCodes[this.regionNames.indexOf(this.cdmForm.controls.region.value)];
    } else {
      this.regionError = 'Please select region';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.diagnosis.value) {
      // Use the stored diagnosis code value
      model.diagnosis = this.diagnosisCodes[this.diagnosisNames.indexOf(this.cdmForm.controls.diagnosis.value)];
    } else {
      this.diagnosisError = 'Please select diagnosis';
      this.thereIsError = true;
    }
    if (this.cdmForm.controls.memberId.value) {
      model.memberCode = this.cdmForm.controls.memberId.value;
    }
    if (!this.thereIsError) {
      this.sharedServices.loadingChanged.next(true);
      this.cdmService.getPatientList(this.sharedServices.providerId, model, this.pageIndex, this.pageSize).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.body != null)
            this.patientList = event.body["patients"];
          this.length = event.body["totalElements"];
          this.sharedServices.loadingChanged.next(false);
        }
      }, err => {
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
      model.memberCode = this.cdmForm.controls.memberId.value;
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
