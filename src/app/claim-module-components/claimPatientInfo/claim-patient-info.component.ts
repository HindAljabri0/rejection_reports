import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePatientName, updatePatientGender, updatePayer, updatePatientMemberId, updatePolicyNum, updateNationalId, updateApprovalNum, updateVisitType, updateNationality, setError, updatePlanType } from '../store/claim.actions';
import { Observable } from 'rxjs';
import { getVisitType, nationalities, FieldError, getPatientErrors, getClaim, ClaimPageType, getPageType, getPageMode, ClaimPageMode } from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';

@Component({
  selector: 'claim-patient-info',
  templateUrl: './claim-patient-info.component.html',
  styleUrls: ['./claim-patient-info.component.css']
})
export class ClaimPatientInfo implements OnInit {

  isRetrievedClaim: boolean = false;
  editableFields = {
    payer: true,
    visitType: true,
    nationality: true,
    gender: true
  };

  fullNameController: FormControl = new FormControl();
  selectedGender: string = '';
  selectedPayer: number;
  selectedVisitType: string;
  selectedNationality: string;
  memberIdController: FormControl = new FormControl();
  policyNumController: FormControl = new FormControl();
  nationalIdController: FormControl = new FormControl();
  approvalNumController: FormControl = new FormControl();

  planTypeController: FormControl = new FormControl();

  payersList: { id: number, name: string, arName: string }[] = [];
  visitTypes: any[] = [];
  nationalities = nationalities;

  pageMode: ClaimPageMode
  claimPageType: ClaimPageType;

  errors: FieldError[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.payersList = this.sharedServices.getPayersList();
    this.store.select(getVisitType).subscribe(visitTypes => this.visitTypes = visitTypes || []);

    this.store.select(getPageMode).pipe(
      withLatestFrom(this.store.select(getClaim)),
      map(values => ({ mode: values[0], claim: values[1] }))
    ).subscribe(({ mode, claim }) => {
      this.pageMode = mode;
      if (mode == 'VIEW') {
        this.setData(claim);
        this.toggleEdit(false);
      } else if (mode == 'EDIT') {
        this.setData(claim);
        this.toggleEdit(true);
      } else if (mode == 'CREATE_FROM_RETRIEVED') {
        this.setData(claim)
        this.toggleEdit(false, true);
      } else {
        if (this.payersList.length > 0) {
          this.selectedPayer = this.payersList[0].id;
        } else {
          this.store.dispatch(setError({ error: { code: 'PAYERS_LIST' } }));
        }

        if (this.visitTypes.length > 0) {
          this.selectedVisitType = this.visitTypes[0];
        }
        this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
        this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));
      }
    });
    this.store.select(getPageType).subscribe(type => this.claimPageType = type);

    this.store.select(getPatientErrors).subscribe(errors => this.errors = errors);


  }

  setData(claim: Claim) {
    if (claim.claimIdentities.payerID != null)
      this.selectedPayer = Number.parseInt(claim.claimIdentities.payerID);
    this.selectedGender = claim.caseInformation.patient.gender;
    this.selectedVisitType = claim.visitInformation.visitType;
    this.selectedNationality = claim.caseInformation.patient.nationality;
    this.nationalIdController.setValue(claim.member.idNumber);
    this.approvalNumController.setValue(claim.claimIdentities.approvalNumber);
    this.fullNameController.setValue(claim.caseInformation.patient.fullName);
    this.policyNumController.setValue(claim.member.policyNumber);
    this.memberIdController.setValue(claim.member.memberID);
    this.planTypeController.setValue(claim.member.planType);
  }

  toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
    this.editableFields = {
      gender: allowEdit || (enableForNulls && this.selectedGender != 'M' && this.selectedGender != 'F'),
      nationality: allowEdit || (enableForNulls && this.nationalities.findIndex(n => n.Code == this.selectedNationality) == -1),
      payer: allowEdit || (enableForNulls && this.payersList.findIndex(p => p.id == this.selectedPayer) == -1),
      visitType: allowEdit || (enableForNulls && !this.visitTypes.includes(this.selectedVisitType))
    }
    if (allowEdit) {
      this.fullNameController.enable();
      this.memberIdController.enable();
      this.policyNumController.enable();
      this.nationalIdController.enable();
      this.approvalNumController.enable();
      this.planTypeController.enable();
    } else {
      this.fullNameController.disable();
      this.memberIdController.disable();
      this.policyNumController.disable();
      this.nationalIdController.disable();
      this.approvalNumController.disable();
      this.planTypeController.disable();
    }

    if (enableForNulls) {
      if (this.isControlNull(this.fullNameController))
        this.fullNameController.enable();
      if (this.isControlNull(this.memberIdController))
        this.memberIdController.enable();
      if (this.isControlNull(this.policyNumController))
        this.policyNumController.enable();
      if (this.isControlNull(this.nationalIdController) || this.nationalIdController.value.length != 10)
        this.nationalIdController.enable();
      if (this.isControlNull(this.approvalNumController))
        this.approvalNumController.enable();
      if (this.isControlNull(this.planTypeController))
        this.planTypeController.enable();
    }
  }

  updateClaim(field: string) {

    this.errors = this.errors.filter(error => error.fieldName == field);
    switch (field) {
      case 'fullName':
        this.store.dispatch(updatePatientName({ name: this.fullNameController.value }));
        break;
      case 'payer':
        this.store.dispatch(updatePayer({ payerId: this.selectedPayer }));
        break;
      case 'visitType':
        this.store.dispatch(updateVisitType({ visitType: this.selectedVisitType }));
        break;
      case 'nationality':
        this.store.dispatch(updateNationality({ nationality: this.selectedNationality }))
        break;
      case 'memberId':
        this.store.dispatch(updatePatientMemberId({ memberId: this.memberIdController.value }));
        break;
      case 'policyNum':
        this.store.dispatch(updatePolicyNum({ policyNo: this.policyNumController.value }));
        break;
      case 'nationalId':
        this.store.dispatch(updateNationalId({ nationalId: this.nationalIdController.value == null ? null : `${this.nationalIdController.value}` }));
        break;
      case 'approvalNum':
        this.store.dispatch(updateApprovalNum({ approvalNo: this.approvalNumController.value }));
        break;
      case 'gender':
        this.store.dispatch(updatePatientGender({ gender: this.selectedGender }));
        break;
      case 'planType':
        this.store.dispatch(updatePlanType({ planType: this.planTypeController.value }));
        break;
    }
  }

  fieldHasError(fieldName) {
    return this.errors.findIndex(error => error.fieldName == fieldName) != -1;
  }

  getFieldError(fieldName) {
    const index = this.errors.findIndex(error => error.fieldName == fieldName);
    if (index > -1) {
      return this.errors[index].error || '';
    }
    return '';
  }

  beautifyVisitType(visitType: string) {
    let str = visitType.substr(0, 1) + visitType.substr(1).toLowerCase();
    if (str.includes('_')) {
      let split = str.split('_');
      str = split[0] + ' ' + this.beautifyVisitType(split[1].toUpperCase());
    }
    return str;
  }

  isControlNull(control: FormControl) {
    return control.value == null || control.value == '';
  }
}
