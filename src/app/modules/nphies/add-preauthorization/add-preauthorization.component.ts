import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal/add-edit-care-team-modal.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';

@Component({
  selector: 'app-add-preauthorization',
  templateUrl: './add-preauthorization.component.html',
  styles: []
})
export class AddPreauthorizationComponent implements OnInit {

  beneficiarySearchController = new FormControl();
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedBeneficiary: BeneficiariesSearchResult;
  selectedPlanId: string;
  selectedPlanIdError: string;

  FormPreAuthorization: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    insurancePlanId: ['', Validators.required],
    dateOrdered: [''],
    type: [''],
    subType: [''],
    accidentType: [''],
    streetName: [''],
    city: [''],
    state: [''],
    country: [''],
    date: [''],
  });

  CareTeams = [];

  model: any = {};

  isSubmitted = false;
  constructor(
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices,
    private beneficiaryService: ProvidersBeneficiariesService) {

  }

  ngOnInit() {
    this.model.beneficaryId = '';

    const preAuthorizationModel: any = {};
    preAuthorizationModel.dateOrdered = '';
    preAuthorizationModel.type = '';
    preAuthorizationModel.subType = '';
    this.model.preAuthorizationInfo = preAuthorizationModel;

    const diagnosisModel: any = {};
    diagnosisModel.sequence = '';
    diagnosisModel.codeDescription = '';
    diagnosisModel.type = '';
    diagnosisModel.onAdmission = '';
    this.model.diagnosis = [diagnosisModel, diagnosisModel];

    const supportingInfoModel: any = {};
    supportingInfoModel.sequence = '';
    supportingInfoModel.reason = '';
    supportingInfoModel.category = '';
    supportingInfoModel.value = '';
    supportingInfoModel.code = '';
    supportingInfoModel.attachment = '';
    this.model.supportingInfo = [supportingInfoModel, supportingInfoModel];

    const accidentModel: any = {};
    accidentModel.accidentType = '';
    accidentModel.streetName = '';
    accidentModel.city = '';
    accidentModel.state = '';
    accidentModel.country = '';
    accidentModel.date = '';
    this.model.accident = accidentModel;

    const careTeamModel: any = {};
    careTeamModel.sequence = '';
    careTeamModel.practitioner = '';
    careTeamModel.practitionerRole = '';
    careTeamModel.careTeamRole = '';
    careTeamModel.speciality = '';
    this.model.careTeam = [careTeamModel, careTeamModel];

    const ItemModel: any = {};
    ItemModel.sequence = '';
    ItemModel.type = '';
    ItemModel.codeDescription = '';
    ItemModel.nonStandardCode = '';
    ItemModel.isPackage = '';
    ItemModel.quantity = '';
    ItemModel.unitPrice = '';
    ItemModel.discount = '';
    ItemModel.factor = '';
    ItemModel.taxPercent = '';
    ItemModel.patientSharePercent = '';
    ItemModel.tax = '';
    ItemModel.net = '';
    ItemModel.patientShare = '';
    ItemModel.payerShare = '';
    ItemModel.startDate = '';
    ItemModel.supportingInfoSequence = [1, 2, 3];
    ItemModel.diagnosisSequence = [1, 2, 3];
    ItemModel.careTeamSequence = [1, 2, 3];
    this.model.Items = [ItemModel, ItemModel];

    console.log(this.model);

  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.beneficiaryService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormPreAuthorization.controls.beneficiaryName.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    const primaryPlanIndex = beneficiary.plans.findIndex(plan => plan.primary);
    if (primaryPlanIndex !== -1) {
      this.selectedPlanId = beneficiary.plans[primaryPlanIndex].planId;
    }
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthorization.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id
    });
  }

  isPlanExpired(date: Date) {
    if (date != null) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date.getTime() > Date.now() ? ' (Active)' : ' (Expired)';
    }
    return '';
  }

  openAddEditCareTeam(careTeam: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (careTeam !== null) ? careTeam.sequence : (this.CareTeams.length === 0 ? 1 : (this.CareTeams[this.CareTeams.length - 1].sequence + 1)),
      item: careTeam
    };

    const dialogRef = this.dialog.open(AddEditCareTeamModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.CareTeams.find(x => x.sequence === result.sequence)) {
          this.CareTeams.map(x => {
            if (x.sequence === result.sequence) {
              x.practitionerName = result.practitionerName;
              x.practitionerRole = result.practitionerRole;
              x.careTeamRole = result.careTeamRole;
              x.speciality = result.speciality;
            }
          });
        } else {
          this.CareTeams.push(result);
        }
      }
    });
  }

  deleteCareTeam(index: number) {
    this.CareTeams.splice(index, 1);
  }

  openAddEditItemDialog() {
    this.dialog.open(AddEditPreauthorizationItemComponent, {
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPreAuthorization.valid) {
      console.log(this.FormPreAuthorization.value);
    }
  }

}
