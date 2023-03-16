import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Subject, ReplaySubject } from 'rxjs';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-manage-care-team',
  templateUrl: './manage-care-team.component.html'
})
export class ManageCareTeamComponent implements OnInit {

  @Input() isSubmitted = false;
  @Input() CareTeams = [];
  @Input() IsCareTeamRequired = false;
  @Input() pageMode = null;
  @Output() PrescriberDefault : EventEmitter<any> = new EventEmitter();
  providerId;
  @ViewChild('practitionerSelect', { static: true }) practitionerSelect: MatSelect;
  practitionerList: any = [];
  filteredPractitioner: ReplaySubject<{ id: string, physician_name: string, speciality_code: string, physician_role: string }[]> = new ReplaySubject<{ id: string, physician_name: string, speciality_code: string, physician_role: string }[]>(1);
  IsPractitionerLading = false;
  selectedPractitioner = '';

  @ViewChild('specialitySelect', { static: true }) specialitySelect: MatSelect;
  specialityList: any = [];
  filteredSpeciality: ReplaySubject<{ specialityCode: string, speciallityName: string }[]> = new ReplaySubject<{ specialityCode: string, speciallityName: string }[]>(1);
  IsSpecialityLading = false;
  selectedSpeciality = '';
  onDestroy = new Subject<void>();

  practitionerRoleList = this.sharedDataService.practitionerRoleList;
  careTeamRoleList = this.sharedDataService.careTeamRoleList;
  PhysicianOptions: any[] = [];
  PhysicianSearchRequet;
  constructor(private sharedDataService: SharedDataService, private sharedServices: SharedServices
    , private configurationService: NphiesConfigurationService, private providerNphiesSearchService: ProviderNphiesSearchService) {
    this.providerId = this.sharedServices.providerId;
  }


  ngOnInit() {
    this.getSpecialityList();
    /*if(this.pageMode == 'EDIT'){
    this.CareTeams.forEach(element =>
      element.specialitySelect = element.specialityCode,
      );
    }*/
  }
  getSpecialityList() {
    this.IsSpecialityLading = true;
    const request = this.providerNphiesSearchService.getSpecialityList(this.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body;
        /*if (this.data.item && this.data.item.specialityCode) {
          if (this.specialityList.filter(x => x.speciallityCode === this.data.item.specialityCode)[0]) {
            this.FormCareTeam.patchValue({
              speciality: this.specialityList.filter(x => x.speciallityCode === this.data.item.specialityCode)[0]
            });
          } else {
            this.FormCareTeam.patchValue({
              speciality: ''
            });
          }*/
      }
      this.filteredSpeciality.next(this.specialityList.slice());
      this.IsSpecialityLading = false;
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
    });

  }
  addPractitioner(diag: any, i: number) {
    //Set Selected Values
    let code = this.specialityList.filter(x => +x.speciallityCode === diag.speciality_code || x.speciallityCode === diag.speciality_code)[0] ? this.specialityList.filter(x => +x.speciallityCode === diag.speciality_code || x.speciallityCode === diag.speciality_code)[0].speciallityCode : null;
    this.CareTeams[i].practitionerRoleSelect = this.practitionerRoleList.filter(role => role.value === diag.physician_role.toLowerCase())[0];
    this.CareTeams[i].specialitySelect = code ? code : null;
    //Set Model Data
    this.CareTeams[i].physicianCode = diag.physician_id;
    this.CareTeams[i].practitionerName = diag.physician_name;
    this.CareTeams[i].practitionerRole = diag.physician_role;

    this.CareTeams[i].specialityCode = code ? code : null;
    this.CareTeams[i].qualificationCode = code ? code : null;
    this.CareTeams[i].speciality = code ? this.specialityList.filter(x => +x.speciallityCode === code || x.speciallityCode === code)[0].speciallityName : null;

    this.PrescriberDefault.emit(this.CareTeams.length  == 1? this.CareTeams[0].sequence : '0');

    console.log("PrescriberDefault = "+(this.CareTeams.length  == 1));
  }
  SpecialtyChange(newSpec: any, i: number) {
    //console.log("values changed = " + JSON.stringify(newSpec));
    this.CareTeams[i].specialityCode = newSpec;
    this.CareTeams[i].qualificationCode = newSpec;
    this.CareTeams[i].speciality = this.specialityList.filter(x => +x.speciallityCode === newSpec || x.speciallityCode === newSpec)[0].speciallityName;
    //console.log("values changed = " + JSON.stringify(this.CareTeams[i]));
  }
  careTeamRoleChange(newRole: any, i: number) {
    this.CareTeams[i].careTeamRole = newRole.value;
    //console.log("values changed = " + JSON.stringify(this.CareTeams[i]));
  }
  practitionerRoleChange(newRole: any, i: number) {
    this.CareTeams[i].practitionerRole = newRole.value;
    //console.log("values changed = " + JSON.stringify(this.CareTeams[i]));
  }
  searchPhysician(name, i) {
    if (this.PhysicianSearchRequet) {
      this.PhysicianSearchRequet.unsubscribe();
    }
    this.CareTeams[i].physicianCode = null;
    this.PhysicianOptions = [];
    if (name) {
      this.PhysicianSearchRequet = this.configurationService.searchPractitioner(this.sharedServices.providerId, name).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            if (event.body instanceof Object) {
              Object.keys(event.body).forEach(key => {
                //if (this.descriptionList.findIndex(diagnosis => diagnosis.diagnosisCode === event.body[key]['icddiagnosisCode']) === -1) {
                this.PhysicianOptions.push(event.body[key]);
                //}
              });
            }
          }
        }
      );
    }
  }
  addCareTeam() {

    const model: any = {};
    model.sequence = this.CareTeams.length === 0 ? 1 : (this.CareTeams[this.CareTeams.length - 1].sequence + 1);
    model.practitionerName = '';
    model.physicianCode = '';
    model.practitionerRole = 'doctor';
    model.careTeamRole = 'primary';
    model.speciality = '';
    model.specialityCode = '';
    model.qualificationCode = '';
    //Selections
    model.careTeamRoleSelect = this.careTeamRoleList.filter(role => role.value === 'primary')[0];;
    model.practitionerRoleSelect = this.practitionerRoleList.filter(role => role.value === 'doctor')[0];
    model.specialitySelect = '';
    this.CareTeams.push(model);
    //console.log(model);
  }
  removeCareTeam(i) {
    this.CareTeams.splice(i, 1);
    this.PrescriberDefault.emit(this.CareTeams.length  == 1? this.CareTeams[0].sequence : '0');
    console.log("PrescriberDefault = "+(this.CareTeams.length  == 1));
  }

}
function forbiddenNamesValidator(options: any): import("@angular/forms").ValidatorFn {
  throw new Error('Function not implemented.');
}

