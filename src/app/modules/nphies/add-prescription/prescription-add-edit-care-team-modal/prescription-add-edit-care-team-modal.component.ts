import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, ReplaySubject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { P } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-prescription-add-edit-care-team-modal',
  templateUrl: './prescription-add-edit-care-team-modal.component.html',
  styles: []
})
export class PrescriptionAddEditCareTeamModalComponent implements OnInit {

  providerId;

  @ViewChild('practitionerSelect', { static: true }) practitionerSelect: MatSelect;
  practitionerList: any = [];
  filteredPractitioner: ReplaySubject<{ id:string, physician_name: string, speciality_code:string, physician_role:string }[]> = new ReplaySubject<{ id: string, physician_name: string,speciality_code:string,physician_role:string }[]>(1);
  IsPractitionerLading = false;
  selectedPractitioner = '';

  @ViewChild('specialitySelect', { static: true }) specialitySelect: MatSelect;
  specialityList: any = [];
  filteredSpeciality: ReplaySubject<{ specialityCode: string, speciallityName: string }[]> = new ReplaySubject<{ specialityCode: string, speciallityName: string }[]>(1);
  IsSpecialityLading = false;
  selectedSpeciality = '';

  onDestroy = new Subject<void>();

  FormCareTeam: FormGroup = this.formBuilder.group({
    practitioner: ['', Validators.required],
    practitionerFilter: [''],
    practitionerRole: ['', Validators.required],
    careTeamRole: ['', Validators.required],
    speciality: ['', Validators.required],
    specialityFilter: [''],
    practitionerName: [''],
    practitionerId: ['']
  });

  isSubmitted = false;

  practitionerRoleList = this.sharedDataService.practitionerRoleList;
  careTeamRoleList = this.sharedDataService.careTeamRoleList;
  IsPractitionerRequired = true;
  IsPractitionerNameRequired = false;



  constructor(
    private sharedDataService: SharedDataService,
    private dialogRef: MatDialogRef<PrescriptionAddEditCareTeamModalComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private sharedServices: SharedServices, private formBuilder: FormBuilder, private configurationService: NphiesConfigurationService,
    private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.providerId = this.sharedServices.providerId;
  }

  ngOnInit() {
    if (this.data.item && this.data.item.practitionerName) {
      this.FormCareTeam.patchValue({
        practitionerRole: this.practitionerRoleList.filter(x => x.value === this.data.item.practitionerRole)[0],
        careTeamRole: this.careTeamRoleList.filter(x => x.value === this.data.item.careTeamRole)[0],
      });
    } else {
      this.FormCareTeam.patchValue({
        practitionerRole: this.practitionerRoleList.filter(role => role.value === 'doctor')[0],
        careTeamRole: this.careTeamRoleList.filter(role => role.value === 'primary')[0],
      });
    }
    this.getPractitionerList();
    this.getSpecialityList();
  }

  PractitionerNameChange() {
    if (this.FormCareTeam.controls.practitionerName.value || this.FormCareTeam.controls.practitionerId.value) {
      this.FormCareTeam.controls.practitioner.clearValidators();
      this.FormCareTeam.controls.practitioner.updateValueAndValidity();
      this.FormCareTeam.controls.practitioner.setValue('');
      this.IsPractitionerRequired = false;

      this.FormCareTeam.controls.practitionerName.setValidators(Validators.required);
      this.FormCareTeam.controls.practitionerName.updateValueAndValidity();
      this.FormCareTeam.controls.practitionerId.setValidators(Validators.required);
      this.FormCareTeam.controls.practitionerId.updateValueAndValidity();
      this.IsPractitionerNameRequired = true;
    } else {
      this.FormCareTeam.controls.practitionerName.clearValidators();
      this.FormCareTeam.controls.practitionerName.updateValueAndValidity();
      this.FormCareTeam.controls.practitionerName.setValue('');

      this.FormCareTeam.controls.practitionerId.clearValidators();
      this.FormCareTeam.controls.practitionerId.updateValueAndValidity();
      this.FormCareTeam.controls.practitionerId.setValue('');
      this.IsPractitionerNameRequired = false;

      this.FormCareTeam.controls.practitioner.setValidators(Validators.required);
      this.FormCareTeam.controls.practitioner.updateValueAndValidity();
      this.FormCareTeam.controls.practitioner.setValue('');
      this.IsPractitionerRequired = true;
    }
  }

  PractitionerChange() {
    let selectedPractitioner =this.FormCareTeam.controls.practitioner.value;
    if (selectedPractitioner) {
      this.FormCareTeam.controls.practitionerName.clearValidators();
      this.FormCareTeam.controls.practitionerName.updateValueAndValidity();
      this.FormCareTeam.controls.practitionerName.setValue('');

      this.FormCareTeam.controls.practitionerId.clearValidators();
      this.FormCareTeam.controls.practitionerId.updateValueAndValidity();
      this.FormCareTeam.controls.practitionerId.setValue('');
      this.IsPractitionerNameRequired = false;

      this.FormCareTeam.controls.practitioner.setValidators(Validators.required);
      this.FormCareTeam.controls.practitioner.updateValueAndValidity();
      this.IsPractitionerRequired = true;
      ///console.log("Specialty = "+JSON.stringify(this.specialityList.filter(x => +x.speciallityCode === selectedPractitioner.speciality_code)[0]));
      this.FormCareTeam.patchValue({
        speciality: this.specialityList.filter(x => +x.speciallityCode === selectedPractitioner.speciality_code)[0],

        practitionerRole: this.practitionerRoleList.filter(x => x.value === selectedPractitioner.physician_role.toLowerCase())[0],
      });
    }
  }

  getPractitionerList() {
    this.IsPractitionerLading = true;
    this.FormCareTeam.controls.practitioner.disable();
    this.configurationService.getPractitionerList(this.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.practitionerList = event.body['content'];
        if (this.data.item && this.data.item.practitionerName) {
          if (this.practitionerList.filter(x => x.physician_name === this.data.item.practitionerName)[0]) {
            this.FormCareTeam.patchValue({
              practitioner: this.practitionerList.filter(x => x.physician_name === this.data.item.practitionerName)[0]
            });

            this.FormCareTeam.controls.practitioner.setValidators(Validators.required);

            this.FormCareTeam.controls.practitioner.clearValidators();
            this.FormCareTeam.controls.practitioner.updateValueAndValidity();

            this.FormCareTeam.controls.practitionerName.clearValidators();
            this.FormCareTeam.controls.practitionerId.updateValueAndValidity();
          } else {
            this.FormCareTeam.patchValue({
              practitionerName: this.data.item.practitionerName,
              practitionerId: this.data.item.physicianCode,
            });

            this.FormCareTeam.controls.practitionerName.setValidators(Validators.required);
            this.FormCareTeam.controls.practitionerId.setValidators(Validators.required);

            this.FormCareTeam.controls.practitioner.clearValidators();
            this.FormCareTeam.controls.practitioner.updateValueAndValidity();
          }
        }
        this.filteredPractitioner.next(this.practitionerList.slice());
        this.IsPractitionerLading = false;
        this.FormCareTeam.controls.practitioner.enable();
        this.FormCareTeam.controls.practitionerFilter.valueChanges
          .pipe(takeUntil(this.onDestroy))
          .subscribe(() => {
            this.filterPractitioner();
          });
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });
  }


  getSpecialityList() {
    this.IsSpecialityLading = true;
    this.FormCareTeam.controls.speciality.disable();
    this.providerNphiesSearchService.getSpecialityList(this.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body;
        if (this.data.item && this.data.item.specialityCode) {
          if (this.specialityList.filter(x => x.speciallityCode === this.data.item.specialityCode)[0]) {
            this.FormCareTeam.patchValue({
              speciality: this.specialityList.filter(x => x.speciallityCode === this.data.item.specialityCode)[0]
            });
          } else {
            this.FormCareTeam.patchValue({
              speciality: ''
            });
          }
        }
        this.filteredSpeciality.next(this.specialityList.slice());
        this.IsSpecialityLading = false;
        this.FormCareTeam.controls.speciality.enable();
        this.FormCareTeam.controls.specialityFilter.valueChanges
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

  filterPractitioner() {
    if (!this.practitionerList) {
      return;
    }
    // get the search keyword
    let search = this.FormCareTeam.controls.practitionerFilter.value;
    if (!search) {
      this.filteredPractitioner.next(this.practitionerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredPractitioner.next(
      this.practitionerList.filter(practitioner => practitioner.physician_name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterSpeciality() {
    if (!this.specialityList) {
      return;
    }
    // get the search keyword
    let search = this.FormCareTeam.controls.specialityFilter.value;
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
    if (this.FormCareTeam.valid) {
      
      const model: any = {};
      model.sequence = this.data.Sequence;
      if (this.FormCareTeam.controls.practitionerName.value) {
        model.practitionerName = this.FormCareTeam.controls.practitionerName.value;
        model.physicianCode = this.FormCareTeam.controls.practitionerId.value;
      } else {
        model.practitionerName = this.FormCareTeam.controls.practitioner.value.physician_name;
        model.physicianCode = this.FormCareTeam.controls.practitioner.value.physician_id;
      }
      model.practitionerRole = this.FormCareTeam.controls.practitionerRole.value.value;
      model.careTeamRole = this.FormCareTeam.controls.careTeamRole.value.value;
      model.speciality = this.FormCareTeam.controls.speciality.value.speciallityName;
      model.specialityCode = this.FormCareTeam.controls.speciality.value.speciallityCode;
      model.qualificationCode = this.FormCareTeam.controls.speciality.value.speciallityCode;
      model.practitionerRoleName = this.FormCareTeam.controls.practitionerRole.value.name;
      model.careTeamRoleName = this.FormCareTeam.controls.careTeamRole.value.name;
      console.log("Model = "+JSON.stringify(model));
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
