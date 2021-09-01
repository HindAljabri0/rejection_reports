import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal/add-edit-care-team-modal.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { DatePipe } from '@angular/common';
import { AddEditDiagnosisModalComponent } from './add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { X } from '@angular/cdk/keycodes';

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
    dateOrdered: ['', Validators.required],
    type: ['', Validators.required],
    subType: [''],
    accidentType: ['', Validators.required],
    streetName: [''],
    city: [''],
    state: [''],
    country: [''],
    date: ['', Validators.required],
  });

  SupportingInfos = [];
  CareTeams = [];
  Diagnosises = [];
  Items = [];

  model: any = {};

  isSubmitted = false;
  constructor(
    private dialog: MatDialog, private formBuilder: FormBuilder, private sharedServices: SharedServices, private datePipe: DatePipe,
    private beneficiaryService: ProvidersBeneficiariesService) {

  }

  ngOnInit() {

    // let x: any = {};
    // x.sequence = 1;
    // x.practitionerName = 'asd';
    // x.practitionerRole = 'asd';
    // x.careTeamRole = 'asd';
    // x.speciality = 'asd';

    // this.CareTeams.push(x);

    // let y: any = {};
    // y.sequence = 2;
    // y.practitionerName = 'bbb';
    // y.practitionerRole = 'bbb';
    // y.careTeamRole = 'bbb';
    // y.speciality = 'bbb';
    // this.CareTeams.push(y);

    // let z: any = {};
    // z.sequence = 3;
    // z.practitionerName = 'xxx';
    // z.practitionerRole = 'xxx';
    // z.careTeamRole = 'xxx';
    // z.speciality = 'xxx';
    // this.CareTeams.push(z);

    // const diagnosisModel: any = {};
    // diagnosisModel.sequence = '';
    // diagnosisModel.codeDescription = '';
    // diagnosisModel.type = '';
    // diagnosisModel.onAdmission = '';
    // this.model.diagnosis = [diagnosisModel, diagnosisModel];

    // const supportingInfoModel: any = {};
    // supportingInfoModel.sequence = '';
    // supportingInfoModel.reason = '';
    // supportingInfoModel.category = '';
    // supportingInfoModel.value = '';
    // supportingInfoModel.code = '';
    // supportingInfoModel.attachment = '';
    // this.model.supportingInfo = [supportingInfoModel, supportingInfoModel];





    // const ItemModel: any = {};
    // ItemModel.sequence = '';
    // ItemModel.type = '';
    // ItemModel.codeDescription = '';
    // ItemModel.nonStandardCode = '';
    // ItemModel.isPackage = '';
    // ItemModel.quantity = '';
    // ItemModel.unitPrice = '';
    // ItemModel.discount = '';
    // ItemModel.factor = '';
    // ItemModel.taxPercent = '';
    // ItemModel.patientSharePercent = '';
    // ItemModel.tax = '';
    // ItemModel.net = '';
    // ItemModel.patientShare = '';
    // ItemModel.payerShare = '';
    // ItemModel.startDate = '';
    // ItemModel.supportingInfoSequence = [1, 2, 3];
    // ItemModel.diagnosisSequence = [1, 2, 3];
    // ItemModel.careTeamSequence = [1, 2, 3];
    // this.model.Items = [ItemModel, ItemModel];

    // console.log(this.model);

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
              x.physicianCode = result.physicianCode;
              x.practitionerRole = result.practitionerRole;
              x.careTeamRole = result.careTeamRole;
              x.speciality = result.speciality;
              x.speciallityCode = result.practitionerName;
              x.practitionerRoleName = result.practitionerRoleName;
              x.careTeamRoleName = result.careTeamRoleName;
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

  openAddEditDiagnosis(diagnosis: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (diagnosis !== null) ? diagnosis.sequence : (this.Diagnosises.length === 0 ? 1 : (this.Diagnosises[this.Diagnosises.length - 1].sequence + 1)),
      item: diagnosis
    };

    const dialogRef = this.dialog.open(AddEditDiagnosisModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Diagnosises.find(x => x.sequence === result.sequence)) {
          this.Diagnosises.map(x => {
            if (x.sequence === result.sequence) {
              x.diagnosisDescription = result.diagnosisDescription;
              x.type = result.type;
              x.onAdmission = result.onAdmission;
              x.diagnosisCode = result.diagnosisCode;
              x.typeName = result.typeName;
              x.onAdmissionName = result.onAdmissionName;
            }
          });
        } else {
          this.Diagnosises.push(result);
        }
      }
    });
  }

  deleteDiagnosis(index: number) {
    this.Diagnosises.splice(index, 1);
  }

  openAddEditItemDialog(itemModel: any = null) {
    debugger;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (itemModel !== null) ? itemModel.sequence : (this.Items.length === 0 ? 1 : (this.Items[this.Items.length - 1].sequence + 1)),
      item: itemModel,
      careTeams: this.CareTeams,
      diagnosises: this.Diagnosises,
      supportingInfos: this.SupportingInfos
    };

    const dialogRef = this.dialog.open(AddEditPreauthorizationItemComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Items.find(x => x.sequence === result.sequence)) {
          this.Items.map(x => {
            if (x.sequence === result.sequence) {
              x.type = result.type;
              x.typeName = result.typeName,
              x.itemCode = result.itemCode;
              x.itemDescription = result.itemDescription;
              x.nonStandardCode = result.nonStandardCode;
              x.isPackage = result.isPackage;
              x.quantity = result.quantity;
              x.unitPrice = result.unitPrice;
              x.discount = result.discount;
              x.factor = result.factor;
              x.taxPercent = result.taxPercent;
              x.patientSharePercent = result.patientSharePercent;
              x.tax = result.tax;
              x.net = result.net;
              x.patientShare = result.patientShare;
              x.payerShare = result.payerShare;
              x.startDate = result.startDate;
              x.supportingInfoSequence = result.supportingInfoSequence;
              x.careTeamSequence = result.careTeamSequence;
              x.diagnosisSequence = result.diagnosisSequence;
            }
          });
        } else {
          this.Items.push(result);
        }
      }
    });
  }

  onSubmit() {
    debugger;
    this.isSubmitted = true;
    if (this.FormPreAuthorization.valid) {


      this.model.beneficaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
      this.model.insurancePlanId = this.FormPreAuthorization.controls.insurancePlanId.value;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'yyyy-MM-dd');
      preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value;
      preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value;
      this.model.preAuthorizationInfo = preAuthorizationModel;


      this.model.diagnosis = this.Diagnosises.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.diagnosisDescription = x.diagnosisDescription;
        model.type = x.type;
        model.onAdmission = x.onAdmission;
        model.diagnosisCode = x.diagnosisCode;
        return model;
      });

      const accidentModel: any = {};
      accidentModel.accidentType = this.FormPreAuthorization.controls.accidentType.value;
      accidentModel.streetName = this.FormPreAuthorization.controls.streetName.value;
      accidentModel.city = this.FormPreAuthorization.controls.city.value;
      accidentModel.state = this.FormPreAuthorization.controls.state.value;
      accidentModel.country = this.FormPreAuthorization.controls.country.value;
      accidentModel.date = this.datePipe.transform(this.FormPreAuthorization.controls.date.value, 'yyyy-MM-dd');
      this.model.accident = accidentModel;

      this.model.careTeam = this.CareTeams.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.practitionerName = x.practitionerName;
        model.physicianCode = x.physicianCode;
        model.practitionerRole = x.practitionerRole;
        model.careTeamRole = x.careTeamRole;
        model.speciality = x.speciality;
        model.speciallityCode = x.speciallityCode;
        return model;
      });

      this.model.items = this.Items.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.type = x.type;
        model.itemCode = x.itemCode;
        model.itemDescription = x.itemDescription;
        model.nonStandardCode = x.nonStandardCode;
        model.isPackage = x.isPackage;
        model.quantity = x.quantity;
        model.unitPrice = x.unitPrice;
        model.discount = x.discount;
        model.factor = x.factor;
        model.taxPercent = x.taxPercent;
        model.patientSharePercent = x.patientSharePercent;
        model.tax = x.tax;
        model.net = x.net;
        model.patientShare = x.patientShare;
        model.payerShare = x.payerShare;
        model.startDate = x.startDate;
        model.supportingInfoSequence = x.supportingInfoSequence;
        model.careTeamSequence = x.careTeamSequence;
        model.diagnosisSequence = x.diagnosisSequence;
        return model;
      });

      console.log('FormValue', this.FormPreAuthorization.value);
      console.log('Model', this.model);
    }
  }

}
