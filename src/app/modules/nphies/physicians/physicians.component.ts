import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, PageEvent, MatSelect } from '@angular/material';
import { Physicians } from 'src/app/models/nphies/physicians';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddPhysicianDialogComponent } from '../add-physician-dialog/add-physician-dialog.component';
import { UploadPhysiciansDialogComponent } from '../upload-physicians-dialog/upload-physicians-dialog.component';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';


@Component({
  selector: 'app-physicians',
  templateUrl: './physicians.component.html',
  styles: []
})
export class PhysiciansComponent implements OnInit {

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  physiciansList: Physicians[];

  @ViewChild('specialitySelect', { static: true }) specialitySelect: MatSelect;
  specialityList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredSpeciality: ReplaySubject<{ specialityCode: string, speciallityName: string }[]> = new ReplaySubject<{ specialityCode: string, speciallityName: string }[]>(1);
  IsSpecialityLading = false;
  selectedSpeciality = '';
  onDestroy = new Subject<void>();

  FormPhysician: FormGroup = this.formBuilder.group({
    physicianId: [''],
    physicianName: [''],
    specialityCode: [''],
    physicianRole: [''],
    specialityFilter: ['']
  });

  practitionerRoleList = this.sharedDataService.practitionerRoleList;

  constructor(
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private sharedDataService: SharedDataService,
    private formBuilder: FormBuilder,
    private nphiesConfigurationsService: NphiesConfigurationService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.getSpecialityList();
  }

  getSpecialityList() {
    this.FormPhysician.controls.specialityCode.disable();
    this.providerNphiesSearchService.getSpecialityList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body as [];
        this.filteredSpeciality.next(this.specialityList.slice());
        this.IsSpecialityLading = false;
        this.FormPhysician.controls.specialityCode.enable();
        this.FormPhysician.controls.specialityFilter.valueChanges
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterSpeciality();
          });
        this.getData();
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });
  }

  filterSpeciality() {
    if (!this.specialityList) {
      return;
    }
    // get the search keyword
    let search = this.FormPhysician.controls.specialityFilter.value;
    if (!search) {
      this.filteredSpeciality.next(this.specialityList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredSpeciality.next(
      this.specialityList.filter(speciality => speciality.speciallityName.toLowerCase().indexOf(search) > -1)
    );
  }

  handlePageEvent(data: PageEvent) {
    this.length = data.length;
    this.pageSize = data.pageSize;
    this.pageIndex = data.pageIndex;
    localStorage.setItem('pagesize', data.pageSize + '');
    this.getData();
  }

  openUploadPhysiciansDialog() {
    const dialogRef = this.dialog.open(UploadPhysiciansDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    });
  }

  openAddPhysicianDialog(physicianData: any = null) {
    const dialogRef = this.dialog.open(AddPhysicianDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],
      autoFocus: false,
      data: {
        physician: physicianData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.getData();
      }
    });
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.getData();
  }

  getData() {
    const model: any = {};

    if (this.FormPhysician.controls.physicianId.value) {
      model.physician_id = this.FormPhysician.controls.physicianId.value;
    }

    if (this.FormPhysician.controls.physicianName.value) {
      model.physician_name = this.FormPhysician.controls.physicianName.value;
    }

    if (this.FormPhysician.controls.specialityCode.value && this.FormPhysician.controls.specialityCode.value.speciallityCode) {
      model.speciality_code = this.FormPhysician.controls.specialityCode.value.speciallityCode;
    }

    if (this.FormPhysician.controls.physicianRole.value) {
      model.physician_role = this.FormPhysician.controls.physicianRole.value;
    }

    this.sharedServices.loadingChanged.next(true);
    this.nphiesConfigurationsService.getPhysicianList(this.sharedServices.providerId, this.pageIndex,
      this.pageSize, model.physician_id, model.physician_name, model.speciality_code, model.physician_role).subscribe(data => {
      if (data instanceof HttpResponse) {
        const body: any = data.body;
        this.physiciansList = body["content"] as Physicians[];
        this.physiciansList.forEach(x => {
          if (x.speciality_code) {
            // tslint:disable-next-line:max-line-length
            x.specialityName = this.specialityList.filter(y => y.speciallityCode === x.speciality_code.toString())[0] ? this.specialityList.filter(y => y.speciallityCode === x.speciality_code.toString())[0].speciallityName : '';
          }
        });
        this.length = body["totalElements"];
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);
        if (error.status === 400) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
      }
    });
  }

  DownloadPhysicianSample() {
    this.nphiesConfigurationsService.downloadPhysicianList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          var data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
          FileSaver.saveAs(data, "SamplePhysicianDownload.xlsx");
        }
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err)
          this.dialogService.openMessageDialog({
            title: '',
            message: `Unable to download File at this moment`,
            isError: true
          });
        }
      });
  }

  DeletePhysician(physicianId) {
    this.sharedServices.loadingChanged.next(false);
    this.nphiesConfigurationsService.deletePhysician(this.sharedServices.providerId, physicianId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // tslint:disable-next-line:max-line-length
          this.dialogService.showMessage('Success:', body.message, 'success', true, 'OK');
          this.getData();
        }
        this.sharedServices.loadingChanged.next(false);
      }

    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
        } else if (error.status === 503) {
          const errors: any[] = [];
          if (error.error.errors) {
            error.error.errors.forEach(x => {
              errors.push(x);
            });
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
          } else {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          }
        }
      }
    });
  }

}
