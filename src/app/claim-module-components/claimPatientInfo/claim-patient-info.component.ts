import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import { updatePatientName, updatePatientGender, updatePayer, updatePatientMemberId, updatePolicyNum, updateNationalId, updateApprovalNum, updateVisitType, updateNationality, setError } from '../store/claim.actions';
import { Observable } from 'rxjs';
import { getVisitType, nationalities, FieldError, getPatientErrors, getIsRetrievedClaim, getClaim, ClaimPageType, getPageType, getPageMode, ClaimPageMode } from '../store/claim.reducer';
import { map, withLatestFrom } from 'rxjs/operators';

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
    this.store.select(getPageMode).subscribe(mode => this.pageMode = mode);
    this.store.select(getPageType).subscribe(type => this.claimPageType = type);
    this.payersList = this.sharedServices.getPayersList();
    this.store.select(getVisitType).subscribe(visitTypes => this.visitTypes = visitTypes || []);

    this.store.select(getIsRetrievedClaim).pipe(
      withLatestFrom(this.store.select(getClaim)),
      withLatestFrom(this.store.select(getPageMode)),
      map(values => ({ isRetrieved: values[0][0], claim: values[0][1], mode: values[1] }))
    ).subscribe(values => {
      this.isRetrievedClaim = values.isRetrieved;
      if (this.isRetrievedClaim) {
        this.selectedPayer = Number.parseInt(values.claim.claimIdentities.payerID);
        this.editableFields.payer = values.mode == 'EDIT' || (values.mode == 'CREATE' && Number.isNaN(this.selectedPayer));
        this.selectedGender = values.claim.caseInformation.patient.gender;
        this.editableFields.gender = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.caseInformation.patient.gender != 'F' && values.claim.caseInformation.patient.gender != 'M'));
        this.selectedVisitType = values.claim.visitInformation.visitType;
        this.editableFields.visitType = values.mode == 'EDIT' || (values.mode == 'CREATE' && !this.visitTypes.includes(this.selectedVisitType));
        this.selectedNationality = values.claim.caseInformation.patient.nationality;
        this.editableFields.nationality = values.mode == 'EDIT' || (values.mode == 'CREATE' && this.nationalities.findIndex(n => this.selectedNationality == n.Code) == -1);
        if (values.claim.member.idNumber != null) {
          this.nationalIdController.setValue(values.claim.member.idNumber);
          let isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.member.idNumber.length != 10 || Number.isNaN(Number.parseInt(values.claim.member.idNumber))));
          if (!isEditable) this.nationalIdController.disable();
        } else if (values.mode == 'VIEW') {
          this.nationalIdController.disable();
        }
        this.approvalNumController.setValue(values.claim.claimIdentities.approvalNumber);
        let isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.claimIdentities.approvalNumber == null || values.claim.claimIdentities.approvalNumber.trim().length == 0));
        if (!isEditable) this.approvalNumController.disable();
        this.fullNameController.setValue(values.claim.caseInformation.patient.fullName);
        isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.caseInformation.patient.fullName == null || values.claim.caseInformation.patient.fullName.trim().length == 0));
        if (!isEditable) this.fullNameController.disable();
        this.policyNumController.setValue(values.claim.member.policyNumber);
        isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.member.policyNumber == null || values.claim.member.policyNumber.trim().length == 0));
        if (!isEditable) this.policyNumController.disable();
        this.memberIdController.setValue(values.claim.member.memberID);
        isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.member.memberID == null || values.claim.member.memberID.trim().length == 0));
        if (!isEditable) this.memberIdController.disable();
        this.planTypeController.setValue(values.claim.member.planType);
        isEditable = values.mode == 'EDIT' || (values.mode == 'CREATE' && (values.claim.member.planType == null || values.claim.member.planType.trim().length == 0));
        if (!isEditable) this.planTypeController.disable();
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

    }).unsubscribe();


    this.store.select(getPatientErrors).subscribe(errors => this.errors = errors);


  }

  printEvent(event) { console.log(event); }

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
}
