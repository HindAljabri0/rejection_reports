import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { take, takeUntil } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatSelect, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, ReplaySubject } from 'rxjs';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';

@Component({
  selector: 'app-add-edit-care-team-modal',
  templateUrl: './add-edit-care-team-modal.component.html',
  styleUrls: ['./add-edit-care-team-modal.component.css']
})
export class AddEditCareTeamModalComponent implements OnInit {

  providerId;

  @ViewChild('practitionerSelect', { static: true }) practitionerSelect: MatSelect;
  practitionerList: any = [];
  filteredPractitioner: ReplaySubject<{ physicianId: { physicianCode: string }, name: string }[]> = new ReplaySubject<{ physicianId: { physicianCode: string }, name: string }[]>(1);
  IsPractitionerLading = false;
  selectedPractitioner = '';

  @ViewChild('specialitySelect', { static: true }) specialitySelect: MatSelect;
  specialityList: any = [];
  filteredSpeciality: ReplaySubject<{ speciallityCode: string, speciallityName: string }[]> = new ReplaySubject<{ speciallityCode: string, speciallityName: string }[]>(1);
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
  });

  isSubmitted = false;

  practitionerRoleList = [
    { value: 'doctor', name: 'Doctor' },
    { value: 'nurse', name: 'Nurse' },
    { value: 'pharmacist', name: 'Pharmacist' },
    { value: 'researcher', name: 'Researcher' },
    { value: 'teacher', name: 'Teacher/educator' },
    { value: 'dentist', name: 'Dentist' },
    { value: 'physio', name: 'Physiotherapist' },
    { value: 'speech', name: 'Speechtherapist' },
    { value: 'ict', name: 'ICT professional' },
  ];

  careTeamRoleList = [
    { value: 'primary', name: 'Primary provider' },
    { value: 'assist', name: 'Assisting Provider' },
    { value: 'supervisor', name: 'Supervising Provider' },
    { value: 'other', name: 'Other' },
  ];

  constructor(
    private dialogRef: MatDialogRef<AddEditCareTeamModalComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private sharedServices: SharedServices, private formBuilder: FormBuilder, private adminService: AdminService,
    private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.providerId = this.sharedServices.providerId;
  }

  ngOnInit() {
    if (this.data.item && this.data.item.practitionerName) {
      this.FormCareTeam.patchValue({
        practitionerRole: this.practitionerRoleList.filter(x => x.value === this.data.item.practitionerRole)[0],
        careTeamRole: this.careTeamRoleList.filter(x => x.value === this.data.item.careTeamRole)[0],
      });
    }
    this.getPractitionerList();
    this.getSpecialityList();
  }

  getPractitionerList() {
    this.IsPractitionerLading = true;
    this.FormCareTeam.controls.practitioner.disable();
    this.adminService.getPractitionerList(this.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.practitionerList = event.body;
        if (this.data.item && this.data.item.practitionerName) {
          this.FormCareTeam.patchValue({
            practitioner: this.practitionerList.filter(x => x.name === this.data.item.practitionerName)[0]
          });
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
        if (this.data.item && this.data.item.practitionerName) {
          this.FormCareTeam.patchValue({
            speciality: this.specialityList.filter(x => x.speciallityName === this.data.item.speciality)[0]
          });
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
      this.practitionerList.filter(practitioner => practitioner.name.toLowerCase().indexOf(search) > -1)
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
    debugger;
    this.isSubmitted = true;
    if (this.FormCareTeam.valid) {
      const model: any = {};
      model.sequence = this.data.Sequence;
      model.practitionerName = this.FormCareTeam.controls.practitioner.value.name;
      model.physicianCode = this.FormCareTeam.controls.practitioner.value.physicianId.physicianCode;
      model.practitionerRole = this.FormCareTeam.controls.practitionerRole.value.value;
      model.careTeamRole = this.FormCareTeam.controls.careTeamRole.value.value;
      model.speciality = this.FormCareTeam.controls.speciality.value.speciallityName;
      model.speciallityCode = this.FormCareTeam.controls.speciality.value.speciallityCode;

      model.practitionerRoleName = this.FormCareTeam.controls.practitionerRole.value.name;
      model.careTeamRoleName = this.FormCareTeam.controls.careTeamRole.value.name;
      this.dialogRef.close(model);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
