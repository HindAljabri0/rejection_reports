import { PhysiciansComponent } from './../physicians/physicians.component';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelect, MAT_DIALOG_DATA } from '@angular/material';
import { SinglePhysician } from 'src/app/models/nphies/SinglePhysicianModel';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-physician-dialog',
  templateUrl: './add-physician-dialog.component.html',
  styles: []
})
export class AddPhysicianDialogComponent implements OnInit {

  FormPhysician: FormGroup = this.formBuilder.group({
    physicianId: ['', Validators.required],
    physicianName: ['', Validators.required],
    specialityCode: ['', Validators.required],
    physicianRole: ['', Validators.required],
    providerId: ['', Validators.required],
    specialityFilter: ['']
  });

  @ViewChild('specialitySelect', { static: true }) specialitySelect: MatSelect;
  specialityList: any = [];
  // tslint:disable-next-line:max-line-length
  filteredSpeciality: ReplaySubject<{ specialityCode: string, speciallityName: string }[]> = new ReplaySubject<{ specialityCode: string, speciallityName: string }[]>(1);
  IsSpecialityLading = false;
  selectedSpeciality = '';
  onDestroy = new Subject<void>();

  practitionerRoleList = this.sharedDataService.practitionerRoleList;
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<AddPhysicianDialogComponent>,
    private sharedDataService: SharedDataService,
    private common: SharedServices,
    private formBuilder: FormBuilder,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService,

  ) { }

  ngOnInit() {
    this.FormPhysician.patchValue({
      providerId: this.common.providerId
    });

    if (this.data && this.data.physician) {
      this.FormPhysician.patchValue({
        physicianId: this.data.physician.physician_id,
        physicianName: this.data.physician.physician_name,
        specialityCode: this.data.physician.speciality_code,
        physicianRole: this.data.physician.physician_role,
      });
    }
    this.getSpecialityList();
  }

  getSpecialityList() {
    this.IsSpecialityLading = true;
    this.FormPhysician.controls.specialityCode.disable();
    this.providerNphiesSearchService.getSpecialityList(this.common.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body;
        if (this.data.physician && this.data.physician.speciality_code) {
          if (this.specialityList.filter(x => x.speciallityCode === this.data.physician.speciality_code.toString())[0]) {
            this.FormPhysician.patchValue({
              specialityCode: this.specialityList.filter(x => x.speciallityCode === this.data.physician.speciality_code.toString())[0]
            });
          } else {
            this.FormPhysician.patchValue({
              specialityCode: ''
            });
          }
        }
        this.filteredSpeciality.next(this.specialityList.slice());
        this.IsSpecialityLading = false;
        this.FormPhysician.controls.specialityCode.enable();
        this.FormPhysician.controls.specialityFilter.valueChanges
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterSpeciality();
          });
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPhysician.valid) {
      const model = this.FormPhysician.value;
      model.specialityCode = model.specialityCode.speciallityCode;
      delete model.specialityFilter;
      this.common.loadingChanged.next(true);

      if (this.data && this.data.physician) {
        model.id = this.data.physician.id;
      }

      this.nphiesConfigurationService.addUpdateSinglePhysician(this.common.providerId, model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const content: any = event.body;
            const body: any = content.body;

            if (body.errormessage && body.errormessage.length > 0) {
              if (this.data && this.data.physician) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error', `${body.errormessage.join('<br>')}`, 'alert', true, 'OK');
              } else {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Error:', `${body.errormessage.join('<br>')}`, 'alert', true, 'OK');
              }
            } else {
              if (this.data && this.data.physician) {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Success', 'Physician Updated Successfully', 'success', true, 'OK');
              } else {
                // tslint:disable-next-line:max-line-length
                this.dialogService.showMessage('Success', 'Physician Added Successfully', 'success', true, 'OK');
              }

            }
          }

          this.common.loadingChanged.next(false);
          this.dialogRef.close(true);
        }

      }, error => {
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
        this.common.loadingChanged.next(false);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
