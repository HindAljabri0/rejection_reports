import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material';
import { Subject,ReplaySubject } from 'rxjs';
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

  practitionerRoleList = this.sharedDataService.practitionerRoleList;
  careTeamRoleList = this.sharedDataService.careTeamRoleList;
  PhysicianOptions: any[] = [];

  constructor(private sharedDataService: SharedDataService,private sharedServices: SharedServices
    , private configurationService: NphiesConfigurationService,private providerNphiesSearchService:ProviderNphiesSearchService) { 
      this.providerId = this.sharedServices.providerId;
    }


  ngOnInit() {
    this.getSpecialityList();
  }
  getSpecialityList() {
    this.IsSpecialityLading = true;
    
    this.providerNphiesSearchService.getSpecialityList(this.providerId).subscribe(event => {
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
     this.CareTeams[i].practitionerRoleSelect = this.practitionerRoleList.filter(role => role.value === diag.physician_role)[0];
     this.CareTeams[i].specialitySelect = this.specialityList.filter(x => +x.speciallityCode === diag.speciality_code)[0],
     //Set Model Data
    this.CareTeams[i].physicianCode = diag.physician_id;
    this.CareTeams[i].practitionerName = diag.physician_name;
    this.CareTeams[i].practitionerRole = diag.physician_role;
    this.CareTeams[i].specialityCode = diag.speciality_code;
    this.CareTeams[i].qualificationCode = diag.speciality_code;
    this.CareTeams[i].speciality = this.CareTeams[i].specialitySelect.speciallityName;
   
    console.log(this.CareTeams[i]);
    
  }
  searchPhysician(name,i){
    this.PhysicianOptions=[];
    if (name) {
      this.configurationService.searchPractitioner(this.sharedServices.providerId,name).subscribe(
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
    model.physicianCode ='';
    model.practitionerRole = 'doctor';
    model.careTeamRole ='primary';
    model.speciality = '';
    model.specialityCode = '';
    model.qualificationCode = '';
    //Selections
    model.careTeamRoleSelect =  this.careTeamRoleList.filter(role => role.value === 'primary')[0];;
    model.practitionerRoleSelect = this.practitionerRoleList.filter(role => role.value === 'doctor')[0];
    model.specialitySelect = '';
    this.CareTeams.push(model);
    console.log(model);
  }
  removeCareTeam(i) {
    this.CareTeams.splice(i, 1);
  }

}
